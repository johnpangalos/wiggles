import { WigglesContext } from "@/types";

export async function GetImage(c: WigglesContext) {
  const key = c.req.param("key");
  const object = await c.env.IMAGES_BUCKET.get(key);

  if (!object) {
    return c.notFound();
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=86400");

  return new Response(object.body, { headers });
}
