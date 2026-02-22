import "zx/globals";
import Cloudflare from "cloudflare";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// --- Parse config from wrangler.toml ---
const apiDir = path.join(import.meta.dirname, "..", "api");
const wranglerToml = fs.readFileSync(
  path.join(apiDir, "wrangler.toml"),
  "utf-8",
);

const accountId = wranglerToml.match(/^account_id\s*=\s*"(.+)"/m)?.[1];
const kvNamespaceId = wranglerToml.match(
  /\[\[kv_namespaces\]\][^[]*?id\s*=\s*"([^"]+)"/s,
)?.[1];
if (!accountId || !kvNamespaceId) {
  echo("Failed to parse account_id or kv namespace id from wrangler.toml");
  process.exit(1);
}
echo(`Using account_id: ${accountId}`);
echo(`Using kv_namespace_id: ${kvNamespaceId}`);

const cf = new Cloudflare(); // uses CLOUDFLARE_API_TOKEN env var
const R2_BUCKET = "wiggles-images";
const $w = $({ cwd: apiDir, quiet: true });

// R2 S3-compatible client — uses R2_ACCESS_KEY_ID + R2_SECRET_ACCESS_KEY env vars
const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// --- Phase 1: List all Cloudflare Images (v2 API, up to 10k per request) ---
async function listAllCfImages() {
  const images: string[] = [];
  let continuationToken: string | null | undefined;

  do {
    if (!accountId) {
      throw new Error("ahhh! no account id")
    }
    const page = await cf.images.v2.list({
      account_id: accountId,
      per_page: 10000,
      continuation_token: continuationToken,
    });
    for (const image of page.images ?? []) {
      if (image.id) images.push(image.id);
    }
    continuationToken = page.continuation_token;
  } while (continuationToken);

  return images;
}

// --- Phase 2: Download from CF Images + Upload to R2 via S3 API ---
async function migrateImage(cfImageId: string): Promise<string> {
  const res = await cf.images.v1.blobs.get(cfImageId, {
    account_id: accountId,
  });
  const data = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") || "image/jpeg";
  const ext = contentType.includes("png") ? "png" : "jpeg";
  const r2Key = `${cfImageId}.${ext}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: r2Key,
      Body: Buffer.from(data),
      ContentType: contentType,
    }),
  );

  echo`Migrated: ${cfImageId} → ${r2Key}`;
  return r2Key;
}

// --- Phase 3: Update KV post metadata via wrangler ---
async function updateKvMetadata(idMapping: Map<string, string>) {
  const result =
    await $w`pnpm wrangler kv key list --namespace-id ${kvNamespaceId} --prefix post-`;
  const keys = JSON.parse(result.stdout) as {
    name: string;
    metadata?: { cfImageId?: string; r2Key?: string };
  }[];

  const updates: { key: string; value: string; metadata: object }[] = [];
  for (const key of keys) {
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
    const bulkFile = tmpfile("kv-bulk.json", JSON.stringify(updates));
    await $w`pnpm wrangler kv bulk put ${bulkFile} --namespace-id ${kvNamespaceId}`;
    fs.removeSync(bulkFile);
    echo`Updated ${updates.length} KV entries`;
  }
}

// --- Run migration ---
echo("Phase 1: Listing all Cloudflare Images...");
const cfImages = await listAllCfImages();
echo(`Found ${cfImages.length} images`);

echo("Phase 2: Downloading from CF Images + uploading to R2...");
const idMapping = new Map<string, string>();
for (let i = 0; i < cfImages.length; i += 10) {
  const batch = cfImages.slice(i, i + 10);
  const results = await Promise.all(
    batch.map(async (cfImageId) => {
      const r2Key = await migrateImage(cfImageId);
      return [cfImageId, r2Key] as const;
    }),
  );
  for (const [cfId, r2Key] of results) {
    idMapping.set(cfId, r2Key);
  }
}
echo(`Migrated ${idMapping.size} images to R2`);

echo("Phase 3: Updating KV post metadata...");
await updateKvMetadata(idMapping);

echo("Migration complete!");
echo("Next steps:");
echo("  1. Deploy the updated Worker code (with R2 bindings)");
echo("  2. Verify images load correctly from R2 presigned URLs");
echo("  3. Optionally delete old Cloudflare Images via API");
