import type { Route } from "./+types/api.posts";
import { readPosts } from "~/lib/db/posts";
import { requireSession } from "~/lib/require-session.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const env = context.cloudflare.env;
  await requireSession(request, env.SESSION_SECRET);

  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor") ?? undefined;
  const limitStr = url.searchParams.get("limit") ?? "10";
  const limit = Number.parseInt(limitStr);
  const email = url.searchParams.get("email") ?? undefined;
  const origin = url.origin;

  try {
    const result = await readPosts(env.WIGGLES, origin, {
      cursor,
      limit,
      email,
    });
    return Response.json(result);
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
    return Response.json({ error: "Could not fetch posts." }, { status: 500 });
  }
}
