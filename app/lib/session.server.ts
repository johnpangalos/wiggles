import { createCookieSessionStorage } from "react-router";

export function createSessionStorage(sessionSecret: string) {
  return createCookieSessionStorage({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
      secrets: [sessionSecret],
      secure: true,
    },
  });
}

export type SessionStorage = ReturnType<typeof createSessionStorage>;
