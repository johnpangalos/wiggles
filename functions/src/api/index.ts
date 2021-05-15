import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors from "cors";
import express, { Request, Response } from "express";
import { validateToken } from "./validate-token";

const app = express();
const BUCKET_NAME = "gs://wiggles-f0bd9.appspot.com/";
const corsWrapper = cors({ origin: true });

export type Post = {
  id: string;
  media: {
    contentType: string;
    id: string;
    path: string;
    status: string;
    thumbnail: string;
    timestamp: string;
    uploadFinished: boolean;
    userId: string;
    web: string;
    webUrl?: string;
    thumbnailUrl?: string;
  };
  refId: string;
  timestamp: string;
  type: string;
  userId: string;
};

async function getPosts(req: Request, res: Response) {
  const last = req.query.last;
  const limit = Number(req.query.limit) || 12;
  // const thumbnail = req.query.thumbnail === "true";
  const db = admin.firestore();
  const postCol = db.collection("posts");
  let lastSnap;

  if (last !== undefined)
    lastSnap = await postCol.where("id", "==", last).get();

  let postRef = postCol.orderBy("timestamp", "desc").limit(limit);

  if (lastSnap !== undefined) postRef = postRef.startAt(lastSnap.docs[0]);

  const snaps = await postRef.get();
  const posts: Post[] = [];
  snaps.forEach((doc) => {
    return posts.push(doc.data() as Post);
  });

  const storage = admin.storage();
  const bucket = storage.bucket(BUCKET_NAME);

  const webUrlPromises = posts.map(async (post) => {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    const file = bucket.file(post.media.web);

    const [webUrl] = await file.getSignedUrl({
      action: "read",
      expires: date.toString(),
    });
    return {
      ...post,
      media: {
        ...post.media,
        webUrl,
      },
    };
  });

  res.json({
    data: await Promise.all(webUrlPromises),
  });
}

app.use(corsWrapper);
app.use(validateToken);
app.get("/posts", getPosts);

export const api = functions.https.onRequest(app);
