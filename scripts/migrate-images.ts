import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID!;
const CF_API_KEY = process.env.CF_API_KEY!;
const CF_AUTH_EMAIL = process.env.CF_AUTH_EMAIL!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const KV_NAMESPACE_ID = process.env.KV_NAMESPACE_ID!;
const R2_BUCKET = "wiggles-images";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

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

// --- Phase 2: Download from CF Images + Upload to R2 ---
// Build a mapping of cfImageId → r2Key
async function migrateImage(cfImageId: string): Promise<string> {
  // Download original from CF Images
  const downloadRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1/${cfImageId}/blob`,
    { headers: cfHeaders },
  );
  if (!downloadRes.ok)
    throw new Error(`Failed to download ${cfImageId}: ${downloadRes.status}`);

  const data = await downloadRes.arrayBuffer();
  const contentType = downloadRes.headers.get("content-type") || "image/jpeg";
  const ext = contentType.includes("png") ? "png" : "jpeg";
  const r2Key = `${cfImageId}.${ext}`; // use cfImageId as base for traceability

  // Upload to R2
  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: r2Key,
      Body: new Uint8Array(data),
      ContentType: contentType,
    }),
  );

  console.log(`Migrated: ${cfImageId} → ${r2Key}`);
  return r2Key;
}

// --- Phase 3: Update KV post metadata ---
// List all KV keys with post- prefix, update metadata to use r2Key
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

      // Replace cfImageId with r2Key in metadata
      const newMetadata = { ...key.metadata, r2Key };
      delete (newMetadata as Record<string, unknown>).cfImageId;
      updates.push({ key: key.name, value: "", metadata: newMetadata });
    }

    // Bulk write updated metadata
    if (updates.length > 0) {
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}/bulk`,
        {
          method: "PUT",
          headers: { ...cfHeaders, "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        },
      );
      console.log(`Updated ${updates.length} KV entries`);
    }

    cursor = data.result_info.cursor;
    done = !cursor;
  }
}

// --- Run migration ---
async function main() {
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
}

main().catch(console.error);
