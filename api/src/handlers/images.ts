import { WigglesContext } from "@/types";

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

  console.log("[GetImage] request", {
    key,
    w,
    h,
    url: c.req.url,
  });

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

    console.log("[GetImage] resize", {
      originUrl: originUrl.toString(),
      options,
    });

    const response = await fetch(originUrl.toString(), {
      cf: { image: options },
    });

    console.log("[GetImage] resize response", {
      status: response.status,
      contentType: response.headers.get("Content-Type"),
      headers: Object.fromEntries(response.headers.entries()),
    });

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

  console.log("[GetImage] R2 origin response", {
    key,
    httpMetadata: object.httpMetadata,
    contentType: r2Headers.get("Content-Type"),
    size: object.size,
  });

  const headers = new Headers(r2Headers);
  headers.set("Cache-Control", "public, max-age=86400");

  return new Response(object.body, { headers });
}
