import { storage } from "firebase-functions";
import * as admin from "firebase-admin";
import mkdirp from "mkdirp";
import { spawn } from "child-process-promise";
import * as os from "os";
import * as fs from "fs";
import * as path from "path";
//
// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;

const WEB_MAX_HEIGHT = 1080;
const WEB_MAX_WIDTH = 1080;

export const convertImage = async (
  object: storage.ObjectMetadata,
  prefix: string,
  thumbnail = false
): Promise<string> => {
  // File and directory paths.
  if (object.name === undefined) throw new Error("File requires a name");
  const filePath = object.name;
  const contentType = object.contentType; // This is the image MIME type
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const convertFilePath = path.normalize(
    path.join(fileDir, `${prefix}${fileName}`)
  );
  const tempLocalFile = path.join(os.tmpdir(), `base_${prefix}${filePath}`);
  const tempLocalDir = path.dirname(tempLocalFile);
  const tempLocalConvertFile = path.join(os.tmpdir(), convertFilePath);

  const bucket = admin.storage().bucket(object.bucket);
  const file = bucket.file(filePath);

  const metadata = {
    contentType: contentType,
    cacheControl: "public,max-age=31536000",
  };

  // Create the temp directory where the storage file will be downloaded.
  await mkdirp(tempLocalDir);

  // Download file from bucket.
  await file.download({ destination: tempLocalFile });
  console.log("The file has been downloaded to", tempLocalFile);

  const args = thumbnail
    ? [
        tempLocalFile,
        "-thumbnail",
        `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`,
        "-auto-orient",
        tempLocalConvertFile,
      ]
    : [
        tempLocalFile,
        "-resize",
        `${WEB_MAX_WIDTH}x${WEB_MAX_HEIGHT}>`,
        "-auto-orient",
        tempLocalConvertFile,
      ];

  // Generate a thumbnail using ImageMagick.
  await spawn("convert", args, { capture: ["stdout", "stderr"] });
  console.log("Thumbnail created at", tempLocalConvertFile);

  // Uploading the Thumbnail.
  await bucket.upload(tempLocalConvertFile, {
    destination: convertFilePath,
    metadata: metadata,
  });
  console.log("Thumbnail uploaded to Storage at", convertFilePath);

  // Once the image has been uploaded delete the local files to free up disk space.
  fs.unlinkSync(tempLocalFile);
  fs.unlinkSync(tempLocalConvertFile);

  return convertFilePath;
};
