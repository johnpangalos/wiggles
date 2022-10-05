import { Hono } from "hono";
import { cache } from "hono/cache";
import { GetMe, GetPosts, PostUpload, DeletePosts } from "@/handlers";
import { WigglesEnv } from "@/types";
import { auth } from "@/middleware";

const app = new Hono<WigglesEnv>();

app.use("/api/*", auth());
app.use("/api/posts", cache({ cacheName: "wr" }));

app.get("/api/posts", GetPosts);
app.get("/api/me", GetMe);

app.post("/api/upload", PostUpload);
app.post("/api/bulk-delete", DeletePosts);

export default app;
