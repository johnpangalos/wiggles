import { redirect } from "react-router";
import { createSessionStorage } from "~/lib/session.server";

type SessionUser = {
  email: string;
  name: string;
  picture: string;
};

export async function requireSession(
  request: Request,
  sessionSecret: string,
): Promise<SessionUser> {
  const sessionStorage = createSessionStorage(sessionSecret);
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  const email = session.get("email") as string | undefined;
  const name = session.get("name") as string | undefined;
  const picture = session.get("picture") as string | undefined;

  if (!email) {
    // For API routes, return 401; for page routes, redirect
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      throw new Response("Unauthorized", { status: 401 });
    }
    throw redirect("/login");
  }

  return { email, name: name ?? "", picture: picture ?? "" };
}
