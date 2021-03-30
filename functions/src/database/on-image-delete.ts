import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const onDeleteImage = functions.firestore
  .document("/images/{imageId}")
  .onDelete(async (snap) => {
    const imageObj = snap.data();
    console.log("Deleting images for: ", imageObj.path);

    const bucket = admin.storage().bucket("wiggles-f0bd9.appspot.com");
    const mainFile = bucket.file(imageObj.path);
    const webFile = bucket.file(imageObj.web);
    const thumbnailFile = bucket.file(imageObj.thumbnail);

    await Promise.all([
      mainFile.delete(),
      webFile.delete(),
      thumbnailFile.delete(),
    ]);

    return;
  });
