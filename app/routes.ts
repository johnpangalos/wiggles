import { type RouteConfig, route, layout } from "@react-router/dev/routes";

export default [
  // Auth routes
  route("login", "routes/login.tsx"),
  route("auth/callback", "routes/auth.callback.tsx"),
  route("auth/logout", "routes/auth.logout.tsx"),

  // Resource routes (API replacements)
  route("api/images/:key", "routes/api.images.$key.ts"),
  route("api/posts", "routes/api.posts.ts"),
  route("api/upload", "routes/api.upload.ts"),
  route("api/bulk-delete", "routes/api.bulk-delete.ts"),

  // Page routes (protected by auth loader in _main layout)
  layout("routes/_main.tsx", { id: "main-layout" }, [
    route("/", "routes/_main._index.tsx", { id: "main-index" }),
    route("feed", "routes/_main.feed.tsx"),
    route("upload", "routes/_main.upload.tsx"),
    route("profile", "routes/_main.profile.tsx"),
  ]),

  // Catch-all redirect to /feed
  route("*", "routes/catchall.tsx"),
] satisfies RouteConfig;
