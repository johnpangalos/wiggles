# Migration Plan: Cloudflare Images → R2 + Workers

## Overview

Replace Cloudflare Images (upload API + `imagedelivery.net` HMAC-signed URLs) with R2 object storage + S3-presigned GET URLs. This eliminates the per-image pricing of Cloudflare Images while keeping images private behind time-limited signed URLs — same security model, simpler implementation.

Includes a full bulk migration of all existing images from Cloudflare Images into R2.

---

## Current Architecture

```
Upload:  Frontend → POST /api/upload → CF Images API → returns cfImageId
Serve:   GET /api/posts → generate HMAC-signed imagedelivery.net URL → cache in KV → return to frontend
Delete:  DELETE /api/posts → CF Images API delete + KV cleanup
```

**Key files:**
- `api/src/handlers/posts.ts` — upload/delete handlers
- `api/src/utils/index.ts` — `generateSignedUrl()` (HMAC), `parseFormDataRequest()`
- `api/src/db/posts.ts` — `populatePost()` (signed URL generation + KV caching), `createPosts()`, `deletePosts()`
- `api/src/types/index.ts` — `WigglesEnv` bindings, `Post` type
- `api/wrangler.toml` / `api/wrangler-dev.toml` — config

**Existing bugs found:**
- `db/posts.ts:152` — deletion URL uses `c.env.API_KEY` instead of `c.env.ACCOUNT_ID`
- `handlers/posts.ts:48` — references `res` instead of `response`

---

## Target Architecture

```
Upload:  Frontend → POST /api/upload → R2 bucket.put() → returns r2Key
Serve:   GET /api/posts → generate S3-presigned R2 GET URL on the fly → return to frontend
Delete:  DELETE /api/posts → R2 bucket.delete() + KV cleanup
```

Images remain private in R2 (no public bucket). The Worker generates time-limited presigned GET URLs using the `@aws-sdk/s3-request-presigner` on every request — no KV URL caching needed. The presigner does local crypto only (no network call), so generating a fresh URL is fast. This eliminates all `image-*` KV keys and removes the risk of serving expired cached URLs. Frontend `<img src=...>` tags fetch directly from the presigned R2 URL — no auth headers needed, no streaming proxy endpoint needed.

---

## Step-by-Step Changes

### Step 1: Install S3 SDK dependencies

**File:** `api/package.json`

```bash
pnpm --filter api add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

These are needed to generate presigned GET URLs for R2 objects. The presigner does cryptographic signing locally (no network call) — it just constructs a URL with S3v4 auth query parameters.

### Step 2: Add R2 bucket binding to wrangler config

**Files:** `api/wrangler.toml`, `api/wrangler-dev.toml`

Add R2 binding alongside existing KV binding:

```toml
[[r2_buckets]]
  binding = "IMAGES_BUCKET"
  bucket_name = "wiggles-images"
```

The bucket must be created beforehand via:
```bash
wrangler r2 bucket create wiggles-images
```

And for dev:
```bash
wrangler r2 bucket create wiggles-images-dev
```

### Step 3: Update TypeScript types

**File:** `api/src/types/index.ts`

Update `WigglesEnv` bindings and `Post` type:

```typescript
export type Post = {
  id: string;
  contentType: string;
  timestamp: string;
  accountId: string;
  r2Key: string;           // was cfImageId
};

export type WigglesEnv = {
  Bindings: {
    WIGGLES: KVNamespace;
    IMAGES_BUCKET: R2Bucket;       // NEW — R2 binding
    R2_ACCESS_KEY_ID: string;      // NEW — for presigned URLs
    R2_SECRET_ACCESS_KEY: string;  // NEW — for presigned URLs
    ACCOUNT_ID: string;            // keep (KV bulk API + R2 S3 endpoint)
    API_KEY: string;               // keep (KV bulk API)
    AUTH0_DOMAIN: string;
    AUTH0_AUDIENCE: string;
    WIGGLES_KV_ID: string;
  };
  // ...
};
```

- Add `IMAGES_BUCKET: R2Bucket`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
- Remove `IMAGES_KEY` (no longer needed — was for HMAC signing)
- Rename `cfImageId` → `r2Key` in `Post`

### Step 4: Rewrite `generateSignedUrl` to use S3 presigner

**File:** `api/src/utils/index.ts`

Replace the manual HMAC signing with the S3 presigner:

```typescript
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function generateSignedUrl(
  c: WigglesContext,
  r2Key: string,
  expiresIn: number,
): Promise<string> {
  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${c.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: c.env.R2_ACCESS_KEY_ID,
      secretAccessKey: c.env.R2_SECRET_ACCESS_KEY,
    },
  });

  return await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: "wiggles-images",
      Key: r2Key,
    }),
    { expiresIn },
  );
}
```

Changes:
- Remove `ImageSize` parameter (R2 serves originals, no named variants)
- Remove `bufferToHex()` helper
- Remove manual HMAC key import / signing logic
- `expiresIn` is seconds (use `DAY = 86400`)

### Step 5: Update post population (generate presigned URL on the fly)

**File:** `api/src/db/posts.ts`

The `populatePost()` function currently checks KV for a cached signed URL, generates one if missing, and caches it. Replace all of that with a direct `generateSignedUrl()` call — the S3 presigner is pure local crypto (no network), so it's fast enough to run on every request. This eliminates all `image-*` KV keys entirely.

```typescript
export async function populatePost(
  c: WigglesContext,
  post: Post,
): Promise<PostResponse | null> {
  const urlPromise = generateSignedUrl(c, post.r2Key, DAY);

  const accountPromise = (async () => {
    const account = await c.env.WIGGLES.get(`account-${post.accountId}`);
    if (account === null) throw new Error(`Bad post data: ${post.accountId}`);
    return account;
  })();

  const [url, account] = await Promise.all([urlPromise, accountPromise]);

  return {
    ...post,
    url,
    account: JSON.parse(account),
    orderKey: (MAX - Number.parseInt(post.timestamp)).toString(),
  };
}
```

Changes:
- Remove KV cache read/write for image URLs (`image-{id}-size-{size}` keys gone)
- Remove `size` / `ReadPostOptions` parameter (no named variants)
- Fresh presigned URL generated per request — naturally expires after 1 day

### Step 6: Rewrite image upload handler

**File:** `api/src/handlers/posts.ts`

Replace the Cloudflare Images API call with R2 `put()`:

```typescript
export async function PostUpload(c: WigglesContext) {
  try {
    const files = await parseFormDataRequest(c.req);
    if (!files) return c.body(null, 204);

    const r2Keys = await Promise.all(
      files.map(async ({ file, key }) => {
        const data = await file.arrayBuffer();  // buffer for known length
        await c.env.IMAGES_BUCKET.put(key, data, {
          httpMetadata: { contentType: file.type },
        });
        return key;
      }),
    );

    const timestamp = +new Date();
    const { payload } = c.get("JWT");
    const email = getEmailFromPayload(payload);

    const postList: Post[] = r2Keys.map((r2Key, idx) => ({
      id: crypto.randomUUID(),
      contentType: "image/*",
      r2Key,
      timestamp: (timestamp + idx).toString(),
      accountId: email,
    }));

    const res = await createPosts(c, postList);
    if (res.status > 300)
      throw new Error(`Failed to upload post: ${res.status} ${await res.text()}`);
    return c.json({ message: "success" });
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
    return c.json({ error: "Could not upload image." }, 500);
  }
}
```

Key points:
- Use `file.arrayBuffer()` before `put()` to avoid the R2 stream-length gotcha (unknown stream length causes silent truncation)
- Remove `ImageUploadResponse` type
- Remove the `fetch()` call to `api.cloudflare.com/.../images/v1`
- Remove `requireSignedURLs` form data field

### Step 7: Update `parseFormDataRequest` utility

**File:** `api/src/utils/index.ts`

Simplify to return `{ file, key }` pairs instead of wrapping in new FormData:

```typescript
export const parseFormDataRequest = async (
  request: HonoRequest,
): Promise<{ file: File; key: string }[] | undefined> => {
  const incoming = await request.raw.formData();
  const files = incoming.getAll("file");
  if (files.length === 0) return;

  return files
    .filter((entry): entry is File => typeof entry !== "string")
    .map((file) => {
      const ext = file.type?.includes("png") ? "png" : "jpeg";
      const key = `${crypto.randomUUID()}.${ext}`;
      return { file, key };
    });
};
```

### Step 8: Update image deletion

**File:** `api/src/db/posts.ts`

Replace the Cloudflare Images API delete with R2 delete:

```typescript
// Before:
await fetch(`https://api.cloudflare.com/.../images/v1/${post.cfImageId}`, { method: "DELETE", ... });

// After:
await c.env.IMAGES_BUCKET.delete(post.r2Key);
```

This also fixes the existing bug where `c.env.API_KEY` was used instead of `c.env.ACCOUNT_ID` in the URL. R2 batch delete supports up to 1000 keys, so we can also batch:

```typescript
const r2Keys = posts.map((p) => p.r2Key);
await c.env.IMAGES_BUCKET.delete(r2Keys);
```

### Step 9: Update `GetPosts` handler

**File:** `api/src/handlers/posts.ts`

- Remove the `size` query parameter validation (`WRPost` / `WRThumbnail`) — R2 serves originals
- Simplify `readPosts` call (no `size` parameter)
- Keep backward-compatible: ignore `size` if frontend still sends it

### Step 10: Update frontend types

**File:** `web/src/types/index.ts`

```typescript
export type NewPost = {
  url: string;              // now a presigned R2 URL
  account: Account;
  id: string;
  contentType: string;
  timestamp: string;
  accountId: string;
  r2Key: string;            // was cfImageId
  orderKey: string;
};
```

### Step 11: Update frontend data fetching

**File:** `web/src/hooks/useInfinitePosts.ts`

- Remove the `imageSize` query parameter from the fetch URL (or keep sending it — API ignores it)
- The `url` field in the response already contains the full presigned URL, so `Image.tsx` needs no changes

### Step 12: Clean up dead code

- Remove `ImageSize` type export from `api/src/utils/index.ts`
- Remove `bufferToHex()` from `api/src/utils/index.ts`
- Remove `IMAGES_KEY` from any secret configuration
- Old `image-{cfImageId}-size-{size}` KV cache entries will auto-expire within 1 day (no manual cleanup needed)
- Remove `DAY` and `unixTime()` from utils if no longer referenced (they were only used for KV URL caching TTLs)

---

## Bulk Migration of Existing Images

All existing images in Cloudflare Images must be downloaded and re-uploaded to R2, then KV post metadata updated to use the new R2 keys.

### Migration Script: `scripts/migrate-images.ts`

A standalone Node.js script (not a Worker) that runs locally or in CI:

```typescript
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
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
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
    const data = await res.json() as {
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
  if (!downloadRes.ok) throw new Error(`Failed to download ${cfImageId}: ${downloadRes.status}`);

  const data = await downloadRes.arrayBuffer();
  const contentType = downloadRes.headers.get("content-type") || "image/jpeg";
  const ext = contentType.includes("png") ? "png" : "jpeg";
  const r2Key = `${cfImageId}.${ext}`;  // use cfImageId as base for traceability

  // Upload to R2
  await s3.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: r2Key,
    Body: new Uint8Array(data),
    ContentType: contentType,
  }));

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

    const res = await fetch(url.toString(), { headers: { ...cfHeaders, "Content-Type": "application/json" } });
    const data = await res.json() as {
      result: { name: string; metadata?: { cfImageId?: string; r2Key?: string } }[];
      result_info: { cursor?: string; count: number };
    };

    const updates: { key: string; value: string; metadata: object }[] = [];
    for (const key of data.result) {
      if (!key.metadata?.cfImageId) continue;
      const r2Key = idMapping.get(key.metadata.cfImageId);
      if (!r2Key) {
        console.warn(`No R2 key found for cfImageId ${key.metadata.cfImageId} (key: ${key.name})`);
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
```

### Migration Execution Order

The migration must happen in this specific order to avoid downtime:

```
1. Create R2 bucket                          (wrangler r2 bucket create wiggles-images)
2. Create R2 API token                       (Dashboard → R2 → Manage R2 API Tokens)
3. Set new secrets                           (wrangler secret put R2_ACCESS_KEY_ID, etc.)
4. Run migration script                      (downloads CF Images → uploads to R2 → updates KV)
5. Deploy updated Worker                     (new code reads r2Key from KV, generates presigned URLs)
6. Verify everything works
7. Clean up old Cloudflare Images            (optional — delete via API to stop billing)
8. Remove old secrets (IMAGES_KEY)           (wrangler secret delete IMAGES_KEY)
```

### Rollback Strategy

If something goes wrong after deploying the new Worker:
- Old `image-{cfImageId}-size-{size}` KV cache entries auto-expire (1 day TTL), so they'll be gone
- Keep the old Worker code ready to re-deploy
- The migration script is idempotent — re-running it won't duplicate R2 objects (same key = overwrite)
- During the migration window, keep `IMAGES_KEY` secret alive until fully verified

### Phase 3.5 (Optional): Dual-read fallback

For extra safety, the Worker can support both old and new formats during transition:

```typescript
// In populatePost():
const imageId = post.r2Key ?? post.cfImageId;
if (post.r2Key) {
  // New path: presigned R2 URL
  url = await generateR2SignedUrl(c, post.r2Key, DAY);
} else {
  // Legacy path: old HMAC-signed CF Images URL
  url = await generateCfImagesSignedUrl(c, post.cfImageId, DAY, size);
}
```

This allows deploying the new Worker before the migration script finishes, handling both migrated and un-migrated posts.

---

## What About Image Resizing (Thumbnails)?

The current setup uses Cloudflare Images named variants (`WRPost` and `WRThumbnail`) to serve different sizes. With R2, there are three options:

### Option A: Serve originals only (Recommended for now)
- Simplest approach — serve the original image at all sizes
- Frontend already constrains image display size via CSS (`h-[115px]` for thumbnails, `h-[424px]` for posts)
- Trade-off: slightly more bandwidth for thumbnail views, but images are already small enough for a photo-sharing app
- Can add resizing later if needed

### Option B: Cloudflare Image Resizing (add later if needed)
- A separate Cloudflare product that can resize on-the-fly
- Works with any origin including R2
- Would require enabling Image Resizing on the zone and using URL parameters like `/cdn-cgi/image/width=200/api/images/:key`
- Per-request pricing but with caching

### Option C: Pre-generate thumbnails on upload
- On upload, use a library or Cloudflare Image Resizing to create a thumbnail
- Store both `{uuid}.jpeg` and `{uuid}-thumb.jpeg` in R2
- More storage, more upload complexity, but fast thumbnail serving

**Recommendation:** Start with Option A. The CSS already handles display sizing, and modern browsers handle downscaling well. Add Option B later if bandwidth becomes a concern.

---

## Environment Variables / Secrets Changes

| Variable | Status | Notes |
|----------|--------|-------|
| `IMAGES_KEY` | **Remove** | No longer needed (was for HMAC signing) |
| `R2_ACCESS_KEY_ID` | **Add** | R2 S3-compatible API token (for presigned URLs) |
| `R2_SECRET_ACCESS_KEY` | **Add** | R2 S3-compatible API secret (for presigned URLs) |
| `ACCOUNT_ID` | Keep | Used for KV bulk API + R2 S3 endpoint |
| `API_KEY` | Keep | Used for KV bulk API calls |
| `IMAGES_BUCKET` | **Add** | R2 bucket binding in wrangler.toml (not a secret) |

To create R2 API tokens: **Cloudflare Dashboard → R2 → Manage R2 API Tokens → Create API Token** with "Object Read & Write" permission scoped to the `wiggles-images` bucket.

---

## Summary of File Changes

| File | Action |
|------|--------|
| `api/package.json` | Add `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` |
| `api/wrangler.toml` | Add R2 bucket binding |
| `api/wrangler-dev.toml` | Add R2 bucket binding (dev) |
| `api/src/types/index.ts` | Add `IMAGES_BUCKET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`; rename `cfImageId` → `r2Key` |
| `api/src/handlers/posts.ts` | Rewrite upload to use R2 `put()`; simplify `GetPosts` |
| `api/src/db/posts.ts` | Simplify `populatePost()` — remove KV URL cache, generate presigned URL on the fly; fix deletion to use `IMAGES_BUCKET.delete()` |
| `api/src/utils/index.ts` | Rewrite `generateSignedUrl()` with S3 presigner; remove `bufferToHex`, `ImageSize`; simplify `parseFormDataRequest` |
| `web/src/types/index.ts` | Update `cfImageId` → `r2Key` in `NewPost` |
| `web/src/hooks/useInfinitePosts.ts` | Remove `imageSize` param (optional) |
| `scripts/migrate-images.ts` | **New** — bulk migration script |
