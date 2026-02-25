import type { Route } from "./+types/api.upload";
import { createPosts } from "~/lib/db/posts";
import { ensureAccount } from "~/lib/db/accounts";
import { parseFormData } from "~/lib/utils.server";
import { requireSession } from "~/lib/require-session.server";
import type { Post } from "~/types";

export async function action({ request, context }: Route.ActionArgs) {
  const env = context.cloudflare.env;
  const user = await requireSession(request, env.SESSION_SECRET);

  try {
    const files = await parseFormData(request);
    if (!files) return new Response(null, { status: 204 });

    const r2Keys = await Promise.all(
      files.map(async ({ file, key }) => {
        const data = await file.arrayBuffer();
        await env.IMAGES_BUCKET.put(key, data, {
          httpMetadata: { contentType: file.type },
        });
        return key;
      }),
    );

    const timestamp = +new Date();

    await ensureAccount(env.WIGGLES, user);

    const postList: Post[] = r2Keys.map((r2Key, idx) => ({
      id: crypto.randomUUID(),
      contentType: "image/*",
      r2Key,
      timestamp: (timestamp + idx).toString(),
      accountId: user.email,
    }));

    await createPosts(env.WIGGLES, postList);
    return Response.json({ message: "success" });
  } catch (e) {
    console.error({
      level: "error",
      handler: "PostUpload",
      message: e instanceof Error ? e.message : "Unknown error",
      stack: e instanceof Error ? e.stack : undefined,
    });
    return Response.json({ error: "Could not upload image." }, { status: 500 });
  }
}
