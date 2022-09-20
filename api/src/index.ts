import { Hono } from "hono";
import { cors } from "hono/cors";
import { etag } from "hono/etag";
import { GetPosts } from "@/handlers";
import { WigglesEnv } from "@/types";
import { auth } from "@/middleware";

const app = new Hono<WigglesEnv>();

app.use(
  "/api/*",
  cors({
    origin: "*",
    allowMethods: ["*"],
    exposeHeaders: ["*"],
    maxAge: 600,
    credentials: true,
  })
);
app.use("/api/posts", auth());
app.use("/api/posts", etag({ weak: true }));

app.get("/api/posts", GetPosts);
export default app;
