const functions = require("firebase-functions");
const admin = require("firebase-admin");
const uuidv4 = require("uuid/v4");
const path = require("path");

const convertImage = require("./convertImage").convertImage;

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

exports.afterImageUpload = functions.storage
  .object()
  .onFinalize(async (object) => {
    if (!object) return console.log(exitMessages.OBJECT_DOESNT_EXIST);
    if (!isObjectImage(object))
      return console.log(exitMessages.OBJECT_NOT_IMAGE);

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
      userId: object.metadata.userId,
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

    await imageRef.update({
      thumbnail,
      web,
      status: statusMessages.FINISHED,
      uploadFinished: true,
    });

    await postRef.set({
      id: postId,
      refId: id,
      timestamp,
      type: "image",
      userId: object.metadata.userId,
      media: {
        ...image,
        thumbnail,
        web,
        status: statusMessages.FINISHED,
        uploadFinished: true,
      },
    });
  });

const isObjectImage = ({ contentType }) => contentType.startsWith("image/");

const startsWithPrefix = (prefixes, fileName) =>
  prefixes.some((prefix) => fileName.startsWith(prefix));
