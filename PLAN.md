# Migration Plan: Cloudflare Images → R2 + Workers

## Overview

Replace Cloudflare Images (upload API + `imagedelivery.net` signed URLs) with R2 object storage served directly through the existing Hono Workers API. This eliminates the per-image pricing of Cloudflare Images and the complexity of HMAC-signed URL generation/caching.

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
- `api/src/db/posts.ts` — `populatePost()` (URL caching in KV), `createPosts()`, `deletePosts()`
- `api/src/types/index.ts` — `WigglesEnv` bindings, `Post` type
- `api/wrangler.toml` / `api/wrangler-dev.toml` — config

**Existing bugs found:**
- `db/posts.ts:152` — deletion URL uses `c.env.API_KEY` instead of `c.env.ACCOUNT_ID`
- `handlers/posts.ts:48` — references `res` instead of `response`

---

## Target Architecture

```
Upload:  Frontend → POST /api/upload → R2 bucket.put() → returns r2Key
Serve:   GET /api/images/:key → R2 bucket.get() → stream body as Response
Read:    GET /api/posts → return image URL as /api/images/:r2Key (no signing needed)
Delete:  DELETE /api/posts → R2 bucket.delete() + KV cleanup
```

The Worker itself acts as the access-control layer (auth middleware already exists), so HMAC-signed URLs and KV URL caching are no longer needed.

---

## Step-by-Step Changes

### Step 1: Add R2 bucket binding to wrangler config

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

### Step 2: Update TypeScript types

**File:** `api/src/types/index.ts`

- Add `IMAGES_BUCKET: R2Bucket` to `Bindings`
- Remove `IMAGES_KEY` (no longer needed for HMAC signing)
- Remove `ACCOUNT_ID` and `API_KEY` if no longer used elsewhere (they're also used for KV bulk API calls, so keep for now)
- Rename `cfImageId` to `r2Key` in the `Post` type (or keep `cfImageId` as a legacy alias during migration)

### Step 3: Rewrite image upload handler

**File:** `api/src/handlers/posts.ts`

Replace the Cloudflare Images API call with R2 `put()`:

```typescript
// Instead of POSTing to CF Images API:
const key = `${crypto.randomUUID()}.${ext}`;
await c.env.IMAGES_BUCKET.put(key, file.stream(), {
  httpMetadata: { contentType: file.type },
});
```

Changes:
- Remove `ImageUploadResponse` type
- Remove the `fetch()` call to `api.cloudflare.com/.../images/v1`
- Remove `requireSignedURLs` form data field
- Use `c.env.IMAGES_BUCKET.put()` to store the file directly
- The R2 key becomes the image identifier stored in KV (replaces `cfImageId`)

### Step 4: Add image serving endpoint

**File:** `api/src/handlers/images.ts` (new file)

Add a new route `GET /api/images/:key` that streams images from R2:

```typescript
export async function GetImage(c: WigglesContext) {
  const key = c.req.param("key");
  const object = await c.env.IMAGES_BUCKET.get(key);
  if (!object) return c.notFound();

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");

  return new Response(object.body, { headers });
}
```

Register this route in the Hono app. This endpoint should be **public** (no auth) so image URLs work in `<img>` tags, or alternatively keep auth and have the frontend pass tokens. Given images are displayed via `<img src=...>`, making this endpoint public is simpler. Apply rate limiting or a simple token-in-query approach if needed.

### Step 5: Update post population (remove signed URL logic)

**File:** `api/src/db/posts.ts`

The `populatePost()` function currently:
1. Checks KV for a cached signed URL
2. If missing, generates an HMAC-signed `imagedelivery.net` URL
3. Caches it in KV

Replace this with a simple URL construction:

```typescript
// Before (signed URL + KV cache):
const imageKey = `image-${post.cfImageId}-size-${size}`;
let url = await c.env.WIGGLES.get(imageKey);
if (url === null) {
  url = await generateSignedUrl(c, post.cfImageId, expiration, size);
  c.env.WIGGLES.put(imageKey, url, { expirationTtl: expiration });
}

// After (direct URL):
const baseUrl = c.req.url.split("/api/")[0];
const url = `${baseUrl}/api/images/${post.r2Key}`;
```

This eliminates:
- All KV reads/writes for image URLs (`image-{id}-size-{size}` keys)
- The `generateSignedUrl()` function entirely
- The `IMAGES_KEY` secret

### Step 6: Update image deletion

**File:** `api/src/db/posts.ts`

Replace the Cloudflare Images API delete call with R2 delete:

```typescript
// Before:
await fetch(`https://api.cloudflare.com/.../images/v1/${post.cfImageId}`, { method: "DELETE", ... });

// After:
await c.env.IMAGES_BUCKET.delete(post.r2Key);
```

This also fixes the existing bug where `c.env.API_KEY` was used instead of `c.env.ACCOUNT_ID` in the URL.

### Step 7: Clean up utilities

**File:** `api/src/utils/index.ts`

- Remove `generateSignedUrl()` function
- Remove `ImageSize` type (no longer needed — R2 serves the original image)
- Remove `bufferToHex()` helper
- Keep `parseFormDataRequest()` (still needed for multipart parsing) but simplify it
- Keep `DAY` and `unixTime()` if used elsewhere

### Step 8: Update `parseFormDataRequest` utility

**File:** `api/src/utils/index.ts`

Simplify to return file objects directly instead of wrapping in new FormData (which was needed for the CF Images API):

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

### Step 9: Update `GetPosts` handler

**File:** `api/src/handlers/posts.ts`

- Remove the `size` query parameter validation (`WRPost` / `WRThumbnail`) since R2 serves original images
- Simplify `readPosts` call to not pass size
- OR: keep the `size` parameter for now and ignore it (backwards compatible)

### Step 10: Update frontend types

**File:** `web/src/types/index.ts`

- The `NewPost` type's `cfImageId` field should become `r2Key` (or keep both during transition)
- The `url` field will now point to `/api/images/:key` instead of `imagedelivery.net`

### Step 11: Update frontend data fetching

**File:** `web/src/hooks/useInfinitePosts.ts`

- Remove the `imageSize` query parameter from the fetch URL (or keep sending it — API will ignore it)
- The `url` field in the response already contains the full image URL, so `Image.tsx` needs no changes

### Step 12: Register the new route

**File:** `api/src/index.ts`

Add the image serving route:

```typescript
app.get("/api/images/:key", GetImage);
```

This should be placed **before** the auth middleware or excluded from it, since `<img>` tags can't send Authorization headers.

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
| `ACCOUNT_ID` | Keep | Still used for KV bulk API calls |
| `API_KEY` | Keep | Still used for KV bulk API calls |
| `IMAGES_BUCKET` | **Add** | R2 bucket binding in wrangler.toml |

---

## Migration of Existing Images

Existing images stored in Cloudflare Images won't automatically move to R2. Options:

1. **No migration** — if the app can tolerate losing old images, just switch over
2. **Gradual migration** — keep old `cfImageId` references working by falling back to the old signed-URL logic for posts that don't have an `r2Key`
3. **Bulk migration** — write a script to download all images from CF Images and re-upload to R2, then update KV metadata

For a clean cutover, option 1 or 3 is simplest. For zero downtime, option 2 with a fallback path is safest.

---

## Summary of File Changes

| File | Action |
|------|--------|
| `api/wrangler.toml` | Add R2 bucket binding |
| `api/wrangler-dev.toml` | Add R2 bucket binding (dev) |
| `api/src/types/index.ts` | Add `IMAGES_BUCKET: R2Bucket`, rename `cfImageId` → `r2Key` |
| `api/src/handlers/posts.ts` | Rewrite upload to use R2 `put()` |
| `api/src/handlers/images.ts` | **New** — image serving endpoint |
| `api/src/index.ts` | Register `/api/images/:key` route |
| `api/src/db/posts.ts` | Remove signed URL logic, simplify `populatePost()`, fix deletion |
| `api/src/utils/index.ts` | Remove `generateSignedUrl`, `ImageSize`, `bufferToHex` |
| `web/src/types/index.ts` | Update `cfImageId` → `r2Key` in `NewPost` |
| `web/src/hooks/useInfinitePosts.ts` | Remove `imageSize` param (optional) |
