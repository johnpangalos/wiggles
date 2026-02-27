import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import {
  GetMe,
  GetPost,
  GetPosts,
  PostUpload,
  DeletePosts,
  GetImage,
} from "@/handlers";
import { WigglesEnv } from "@/types";
import { auth } from "@/middleware";

const app = new Hono<WigglesEnv>();

app.onError((err, c) => {
  console.error({
    level: "error",
    handler: "global",
    method: c.req.method,
    path: c.req.path,
    message: err.message,
    stack: err.stack,
  });
  return c.json({ error: "Internal Server Error" }, 500);
});

app.use(
  "/api/*",
  cors({
    origin: "*",
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

// Registered before auth — Hono dispatches in registration order, so the
// route handler returns a response without calling next(), skipping auth.
// img tags can't send Authorization headers, and the R2 keys are UUIDs.
app.get("/api/images/:key", GetImage);

app.use("/api/*", auth());
app.use("/api/*", logger());

app.get("/api/posts/:orderKey", GetPost);
app.get("/api/posts", GetPosts);
app.get("/api/me", GetMe);

app.post("/api/upload", PostUpload);
app.post("/api/bulk-delete", DeletePosts);

export default app;
