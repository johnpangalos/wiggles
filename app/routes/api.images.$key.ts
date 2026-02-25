import type { Route } from "./+types/api.images.$key";

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

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const key = params.key;
  const env = context.cloudflare.env;
  const url = new URL(request.url);

  const w = url.searchParams.get("w");
  const h = url.searchParams.get("h");

  // When resize params are present, use Cloudflare Image Resizing.
  if (w || h) {
    const options: RequestInitCfPropertiesImage = {
      ...(w && { width: Number.parseInt(w) }),
      ...(h && { height: Number.parseInt(h) }),
      fit: parseFit(url.searchParams.get("fit") ?? undefined),
      quality: Number.parseInt(url.searchParams.get("q") ?? "85"),
      format: negotiateFormat(request.headers.get("Accept") ?? undefined),
    };

    const originUrl = new URL(request.url);
    originUrl.search = "";

    const response = await fetch(originUrl.toString(), {
      cf: { image: options },
    });

    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "public, max-age=86400");

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  }

  // No transformation — serve original from R2.
  const object = await env.IMAGES_BUCKET.get(key);

  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=86400");

  return new Response(object.body, { headers });
}
