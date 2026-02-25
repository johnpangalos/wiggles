import type { Route } from "./+types/api.bulk-delete";
import { deletePosts } from "~/lib/db/posts";
import { requireSession } from "~/lib/require-session.server";

export async function action({ request, context }: Route.ActionArgs) {
  const env = context.cloudflare.env;
  const user = await requireSession(request, env.SESSION_SECRET);

  const orderKeys: string[] = await request.json();
  try {
    await deletePosts(env.WIGGLES, env.IMAGES_BUCKET, user.email, orderKeys);
    return Response.json({ message: "OK" });
  } catch (e) {
    console.error({
      level: "error",
      handler: "DeletePosts",
      orderKeys,
      message: e instanceof Error ? e.message : "Unknown error",
      stack: e instanceof Error ? e.stack : undefined,
    });
    return Response.json(
      { error: "Could not delete images..." },
      { status: 500 },
    );
  }
}
