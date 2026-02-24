import { createPosts, deletePosts, readPosts } from "@/db";
import { getEmailFromPayload } from "@/middleware/auth";
import { Post, WigglesContext } from "@/types";
import { parseFormDataRequest } from "@/utils";

export async function GetPosts(c: WigglesContext) {
  const cursor: string | undefined = c.req.query("cursor");

  let limitStr: string | undefined = c.req.query("limit");
  if (limitStr === undefined) limitStr = "10";
  const limit = Number.parseInt(limitStr);

  const email: string | undefined = c.req.query("email");

  try {
    return c.json(await readPosts(c, { cursor, limit, email }));
  } catch (e) {
    console.error({
      level: "error",
      handler: "GetPosts",
      cursor,
      limit,
      email,
      message: e instanceof Error ? e.message : "Unknown error",
      stack: e instanceof Error ? e.stack : undefined,
    });
    return c.json({ error: "Could not fetch posts." }, 500);
  }
}

export async function PostUpload(c: WigglesContext) {
  try {
    const files = await parseFormDataRequest(c.req);
    if (!files) return c.body(null, 204);

    const r2Keys = await Promise.all(
      files.map(async ({ file, key }) => {
        const data = await file.arrayBuffer();
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

    await createPosts(c, postList);
    return c.json({ message: "success" });
  } catch (e) {
    console.error({
      level: "error",
      handler: "PostUpload",
      message: e instanceof Error ? e.message : "Unknown error",
      stack: e instanceof Error ? e.stack : undefined,
    });
    return c.json({ error: "Could not upload image." }, 500);
  }
}

export async function DeletePosts(c: WigglesContext) {
  const orderKeys: string[] = await c.req.json();
  try {
    await deletePosts(c, orderKeys);
    return c.json({ message: "OK" });
  } catch (e) {
    console.error({
      level: "error",
      handler: "DeletePosts",
      orderKeys,
      message: e instanceof Error ? e.message : "Unknown error",
      stack: e instanceof Error ? e.stack : undefined,
    });
    return c.json(
      {
        error: "Could not delete images...",
      },
      500,
    );
  }
}
