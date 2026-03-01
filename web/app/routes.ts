import {
  type RouteConfig,
  route,
  layout,
  index,
} from "@react-router/dev/routes";

export default [
  layout("layouts/main.tsx", [
    route("login", "routes/login.tsx"),
    layout("routes/require-auth.tsx", [
      route("feed", "routes/feed.tsx"),
      route("upload", "routes/upload.tsx"),
      route("profile", "routes/profile.tsx"),
    ]),
    index("routes/home.tsx"),
    route("*", "routes/catchall.tsx"),
  ]),
] satisfies RouteConfig;
