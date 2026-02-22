import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { GetMe, GetPosts, PostUpload, DeletePosts } from "@/handlers";
import { WigglesEnv } from "@/types";
import { auth } from "@/middleware";

const app = new Hono<WigglesEnv>();

app.use(
  "/api/*",
  cors({
    origin: "*",
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);
app.use("/api/*", auth());
app.use("/api/*", logger());

app.get("/api/posts", GetPosts);
app.get("/api/me", GetMe);

app.post("/api/upload", PostUpload);
app.post("/api/bulk-delete", DeletePosts);

export default app;
