import type { Route } from "./+types/login";
import { redirect } from "react-router";
import { getAuthorizationUrl } from "~/lib/auth.server";

export function loader({ request, context }: Route.LoaderArgs) {
  const env = context.cloudflare.env;
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/auth/callback`;
  const state = crypto.randomUUID();

  const authUrl = getAuthorizationUrl(
    env.AUTH0_DOMAIN,
    env.AUTH0_CLIENT_ID,
    redirectUri,
    state,
  );

  throw redirect(authUrl);
}

export default function Login() {
  return (
    <div className="h-full flex items-center justify-center">
      <div>Redirecting to login...</div>
    </div>
  );
}
