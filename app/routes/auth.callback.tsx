import type { Route } from "./+types/auth.callback";
import { redirect } from "react-router";
import { exchangeCodeForTokens, decodeIdToken } from "~/lib/auth.server";
import { createSessionStorage } from "~/lib/session.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const env = context.cloudflare.env;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    throw redirect("/login");
  }

  const redirectUri = `${url.origin}/auth/callback`;

  const tokens = await exchangeCodeForTokens(
    env.AUTH0_DOMAIN,
    env.AUTH0_CLIENT_ID,
    env.AUTH0_CLIENT_SECRET,
    code,
    redirectUri,
  );

  const user = decodeIdToken(tokens.id_token);

  const sessionStorage = createSessionStorage(env.SESSION_SECRET);
  const session = await sessionStorage.getSession();
  session.set("email", user.email);
  session.set("name", user.name);
  session.set("picture", user.picture);

  throw redirect("/feed", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export default function AuthCallback() {
  return (
    <div className="h-full flex items-center justify-center">
      <div>Completing login...</div>
    </div>
  );
}
