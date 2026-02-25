import { WigglesContext } from "@/types";

const EXT_TO_CONTENT_TYPE: Record<string, string> = {
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
};

function contentTypeFromKey(key: string): string {
  const ext = key.split(".").pop()?.toLowerCase();
  return (ext && EXT_TO_CONTENT_TYPE[ext]) || "image/jpeg";
}

const VALID_FIT = new Set([
  "scale-down",
  "contain",
  "cover",
  "crop",
  "pad",
] as const);

type Fit = "scale-down" | "contain" | "cover" | "crop" | "pad";

type ImageFormat = "avif" | "webp" | "jpeg" | "png";

function parseFit(value: string | undefined): Fit {
  if (value && VALID_FIT.has(value as Fit)) return value as Fit;
  return "scale-down";
}

function negotiateFormat(accept: string | undefined): ImageFormat {
  if (!accept) return "jpeg";
  if (accept.includes("image/webp")) return "webp";
  if (accept.includes("image/avif")) return "avif";
  return "jpeg";
}

export async function GetImage(c: WigglesContext) {
  const key = c.req.param("key");

  const w = c.req.query("w");
  const h = c.req.query("h");

  // When resize params are present, use Cloudflare Image Resizing.
  // fetch() with cf.image fetches the original URL (without query params),
  // which re-enters this handler and falls through to the R2 path below.
  if (w || h) {
    const options: RequestInitCfPropertiesImage = {
      ...(w && { width: Number.parseInt(w) }),
      ...(h && { height: Number.parseInt(h) }),
      fit: parseFit(c.req.query("fit")),
      quality: Number.parseInt(c.req.query("q") ?? "85"),
      format: negotiateFormat(c.req.header("Accept")),
    };

    const originUrl = new URL(c.req.url);
    originUrl.search = "";

    const response = await fetch(originUrl.toString(), {
      cf: { image: options },
    });

    if (!response.ok) {
      console.error("[GetImage] resize failed", {
        key,
        status: response.status,
        contentType: response.headers.get("Content-Type"),
        cfResized: response.headers.get("cf-resized"),
        originUrl: originUrl.toString(),
        options,
      });
    }

    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "public, max-age=86400");

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  }

  // No transformation — serve original from R2.
  const object = await c.env.IMAGES_BUCKET.get(key);

  if (!object) {
    console.log("[GetImage] R2 object not found", { key });
    return c.notFound();
  }

  const r2Headers = new Headers();
  object.writeHttpMetadata(r2Headers);

  // Ensure Content-Type is always set so Cloudflare Image Resizing (cf.image)
  // can identify the response as an image on its origin sub-request.
  if (!r2Headers.has("Content-Type")) {
    r2Headers.set("Content-Type", contentTypeFromKey(key));
  }

  const headers = new Headers(r2Headers);
  headers.set("Cache-Control", "public, max-age=86400");

  return new Response(object.body, { headers });
}
