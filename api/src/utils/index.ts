import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { WigglesContext } from "@/types";
import { HonoRequest } from "hono";

export const DAY = 60 * 60 * 24;

export async function generateSignedUrl(
  c: WigglesContext,
  r2Key: string,
  expiresIn: number,
): Promise<string> {
  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${c.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: c.env.R2_ACCESS_KEY_ID,
      secretAccessKey: c.env.R2_SECRET_ACCESS_KEY,
    },
  });

  return await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: "wiggles-images",
      Key: r2Key,
    }),
    { expiresIn },
  );
}

export const parseFormDataRequest = async (
  request: HonoRequest,
): Promise<{ file: File; key: string }[] | undefined> => {
  const incoming = await request.raw.formData();
  const files = incoming.getAll("file");
  if (files.length === 0) return;

  return files
    .filter((entry): entry is File => typeof entry !== "string")
    .map((file) => {
      const ext = file.type?.includes("png") ? "png" : "jpeg";
      const key = `${crypto.randomUUID()}.${ext}`;
      return { file, key };
    });
};
