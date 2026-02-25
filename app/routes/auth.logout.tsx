import type { Route } from "./+types/auth.logout";
import { redirect } from "react-router";
import { getLogoutUrl } from "~/lib/auth.server";
import { createSessionStorage } from "~/lib/session.server";

export async function action({ request, context }: Route.ActionArgs) {
  const env = context.cloudflare.env;
  const url = new URL(request.url);

  const sessionStorage = createSessionStorage(env.SESSION_SECRET);
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  const logoutUrl = getLogoutUrl(
    env.AUTH0_DOMAIN,
    env.AUTH0_CLIENT_ID,
    `${url.origin}/login`,
  );

  throw redirect(logoutUrl, {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export default function AuthLogout() {
  return null;
}
