import { Hono } from "hono";
import { logger } from "hono/logger";
import { GetMe, GetPosts, PostUpload, DeletePosts } from "@/handlers";
import { WigglesEnv } from "@/types";
import { auth, sentry } from "@/middleware";

const app = new Hono<WigglesEnv>();

app.use("/api/*", auth());
app.use("/api/*", logger());
app.use(
  "/api/*",
  sentry({
    dsn: "https://340d03a71aae4b4a99b7d3d36906c21d@o343924.ingest.sentry.io/6779820",
    tracesSampleRate: 1.0,
  })
);

app.get("/api/posts", GetPosts);
app.get("/api/me", GetMe);

app.post("/api/upload", PostUpload);
app.post("/api/bulk-delete", DeletePosts);

// Fallback route for static assets - serves React SPA
app.get("*", async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
