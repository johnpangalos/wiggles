import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID!;
const CF_API_KEY = process.env.CF_API_KEY!;
const CF_AUTH_EMAIL = process.env.CF_AUTH_EMAIL!;
const KV_NAMESPACE_ID = process.env.KV_NAMESPACE_ID!;
const R2_BUCKET = "wiggles-images";
const TMP_DIR = join(import.meta.dirname, ".tmp-migration");

const cfHeaders = {
  "X-Auth-Email": CF_AUTH_EMAIL,
  "X-Auth-Key": CF_API_KEY,
};

// --- Phase 1: List all Cloudflare Images ---
async function listAllCfImages(): Promise<{ id: string }[]> {
  const images: { id: string }[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1?page=${page}&per_page=100`,
      { headers: cfHeaders },
    );
    const data = (await res.json()) as {
      result: { images: { id: string }[] };
      result_info: { count: number };
    };
    images.push(...data.result.images);
    hasMore = data.result.images.length === 100;
    page++;
  }
  return images;
}

// --- Phase 2: Download from CF Images + Upload to R2 via wrangler ---
async function migrateImage(cfImageId: string): Promise<string> {
  const downloadRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1/${cfImageId}/blob`,
    { headers: cfHeaders },
  );
  if (!downloadRes.ok)
    throw new Error(`Failed to download ${cfImageId}: ${downloadRes.status}`);

  const data = await downloadRes.arrayBuffer();
  const contentType = downloadRes.headers.get("content-type") || "image/jpeg";
  const ext = contentType.includes("png") ? "png" : "jpeg";
  const r2Key = `${cfImageId}.${ext}`;

  // Write to temp file, then upload via wrangler
  const tmpFile = join(TMP_DIR, r2Key);
  writeFileSync(tmpFile, new Uint8Array(data));

  execSync(
    `pnpm wrangler r2 object put "${R2_BUCKET}/${r2Key}" --file "${tmpFile}" --content-type "${contentType}"`,
    { cwd: join(import.meta.dirname, "..", "api"), stdio: "pipe" },
  );

  rmSync(tmpFile);
  console.log(`Migrated: ${cfImageId} → ${r2Key}`);
  return r2Key;
}

// --- Phase 3: Update KV post metadata via wrangler ---
async function updateKvMetadata(idMapping: Map<string, string>) {
  let cursor: string | undefined;
  let done = false;

  while (!done) {
    const url = new URL(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}/keys`,
    );
    url.searchParams.set("prefix", "post-");
    url.searchParams.set("limit", "1000");
    if (cursor) url.searchParams.set("cursor", cursor);

    const res = await fetch(url.toString(), {
      headers: { ...cfHeaders, "Content-Type": "application/json" },
    });
    const data = (await res.json()) as {
      result: {
        name: string;
        metadata?: { cfImageId?: string; r2Key?: string };
      }[];
      result_info: { cursor?: string; count: number };
    };

    const updates: { key: string; value: string; metadata: object }[] = [];
    for (const key of data.result) {
      if (!key.metadata?.cfImageId) continue;
      const r2Key = idMapping.get(key.metadata.cfImageId);
      if (!r2Key) {
        console.warn(
          `No R2 key found for cfImageId ${key.metadata.cfImageId} (key: ${key.name})`,
        );
        continue;
      }

      const newMetadata = { ...key.metadata, r2Key };
      delete (newMetadata as Record<string, unknown>).cfImageId;
      updates.push({ key: key.name, value: "", metadata: newMetadata });
    }

    if (updates.length > 0) {
      const bulkFile = join(TMP_DIR, "kv-bulk.json");
      writeFileSync(bulkFile, JSON.stringify(updates));

      execSync(
        `pnpm wrangler kv bulk put "${bulkFile}" --namespace-id "${KV_NAMESPACE_ID}"`,
        { cwd: join(import.meta.dirname, "..", "api"), stdio: "pipe" },
      );

      rmSync(bulkFile);
      console.log(`Updated ${updates.length} KV entries`);
    }

    cursor = data.result_info.cursor;
    done = !cursor;
  }
}

// --- Run migration ---
async function main() {
  mkdirSync(TMP_DIR, { recursive: true });

  try {
    console.log("Phase 1: Listing all Cloudflare Images...");
    const cfImages = await listAllCfImages();
    console.log(`Found ${cfImages.length} images`);

    console.log("Phase 2: Downloading from CF Images + uploading to R2...");
    const idMapping = new Map<string, string>();
    // Process in batches of 10 to avoid rate limits
    for (let i = 0; i < cfImages.length; i += 10) {
      const batch = cfImages.slice(i, i + 10);
      const results = await Promise.all(
        batch.map(async (img) => {
          const r2Key = await migrateImage(img.id);
          return [img.id, r2Key] as const;
        }),
      );
      for (const [cfId, r2Key] of results) {
        idMapping.set(cfId, r2Key);
      }
    }
    console.log(`Migrated ${idMapping.size} images to R2`);

    console.log("Phase 3: Updating KV post metadata...");
    await updateKvMetadata(idMapping);

    console.log("Migration complete!");
    console.log("Next steps:");
    console.log("  1. Deploy the updated Worker code (with R2 bindings)");
    console.log("  2. Verify images load correctly from R2 presigned URLs");
    console.log("  3. Optionally delete old Cloudflare Images via API");
  } finally {
    rmSync(TMP_DIR, { recursive: true, force: true });
  }
}

main().catch(console.error);
