import "zx/globals";
import Cloudflare from "cloudflare";

// --- Parse config from wrangler.toml ---
const apiDir = path.join(import.meta.dirname, "..", "api");
const wranglerToml = fs.readFileSync(
  path.join(apiDir, "wrangler.toml"),
  "utf-8",
);

const accountId = wranglerToml.match(/^account_id\s*=\s*"(.+)"/m)?.[1];
const kvNamespaceId = wranglerToml.match(
  /\[\[kv_namespaces\]\][^[]*?id\s*=\s*"(.+)"/s,
)?.[1];
if (!accountId || !kvNamespaceId) {
  echo("Failed to parse account_id or kv namespace id from wrangler.toml");
  process.exit(1);
}

const cf = new Cloudflare(); // uses CLOUDFLARE_API_TOKEN env var
const R2_BUCKET = "wiggles-images";
const $w = $({ cwd: apiDir, quiet: true });

// --- Phase 1: List all Cloudflare Images ---
async function listAllCfImages() {
  const images: { id: string }[] = [];
  for await (const image of cf.images.v1.list({ account_id: accountId })) {
    images.push(image);
  }
  return images;
}

// --- Phase 2: Download from CF Images + Upload to R2 via wrangler ---
async function migrateImage(cfImageId: string): Promise<string> {
  const res = await cf.images.v1.blobs.get(cfImageId, {
    account_id: accountId,
  });
  const data = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") || "image/jpeg";
  const ext = contentType.includes("png") ? "png" : "jpeg";
  const r2Key = `${cfImageId}.${ext}`;

  const tmp = tmpfile(r2Key, Buffer.from(data));
  await $w`pnpm wrangler r2 object put ${R2_BUCKET}/${r2Key} --file ${tmp} --content-type ${contentType}`;
  fs.removeSync(tmp);

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
    batch.map(async (img) => {
      const r2Key = await migrateImage(img.id);
      return [img.id, r2Key] as const;
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
