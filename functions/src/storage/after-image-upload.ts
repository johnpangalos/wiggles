import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";

import { convertImage } from "./convert-image";

const exitMessages = {
  OBJECT_DOESNT_EXIST: "Image object does not exist, exiting early.",
  OBJECT_NOT_IMAGE: "Object is not an image, ignoring.",
  IMAGE_NOT_ORIGINAL: "Image is not an original, skipping.",
};

const statusMessages = {
  GENERATING_IMAGES: "Generating display images",
  FINISHED: "Finished",
};

// Prefixes.
const THUMB_PREFIX = "thumb_";
const WEB_PREFIX = "web_";

export const afterImageUpload = functions.storage
  .object()
  .onFinalize(async (object) => {
    if (!object) return console.log(exitMessages.OBJECT_DOESNT_EXIST);
    if (!isObjectImage(object))
      return console.log(exitMessages.OBJECT_NOT_IMAGE);

    if (object.name === undefined) throw new Error("File requires a name");
    const fileName = path.basename(object.name);

    if (startsWithPrefix([THUMB_PREFIX, WEB_PREFIX], fileName)) {
      console.log(exitMessages.IMAGE_NOT_ORIGINAL);
      return;
    }

    const id = uuidv4();
    const postId = uuidv4();
    const timestamp = path.basename(object.name, path.extname(object.name));

    const db = admin.firestore();
    const imageRef = db.collection("images").doc(id);
    const postRef = db.collection("posts").doc(postId);

    const image = {
      id,
      path: object.name,
      contentType: object.contentType,
      userId: object.metadata?.userId,
      timestamp,
      uploadFinished: false,
    };

    await imageRef.set(image);

    await imageRef.update({
      status: statusMessages.GENERATING_IMAGES,
    });

    const [web, thumbnail] = await Promise.all([
      convertImage(object, WEB_PREFIX),
      convertImage(object, THUMB_PREFIX, true),
    ]);

    if (!thumbnail || !web) return;

    const finishedUpdate = {
      thumbnail,
      web,
      status: statusMessages.FINISHED,
      uploadFinished: true,
    };

    await imageRef.update(finishedUpdate);

    await postRef.set({
      id: postId,
      refId: id,
      timestamp,
      type: "image",
      userId: object.metadata?.userId,
      media: Object.assign(image, finishedUpdate),
    });
  });

const isObjectImage = ({ contentType }: functions.storage.ObjectMetadata) =>
  contentType?.startsWith("image/");

const startsWithPrefix = (prefixes: string[], fileName: string) =>
  prefixes.some((prefix) => fileName.startsWith(prefix));
