import { WigglesContext } from "@/types";
import { parseMultipart } from "@ssttevee/multipart-parser";

export type ImageSize = "WRPost" | "WRThumbnail";
export const DAY = 60 * 60 * 24;

export function unixTime(offset: number) {
  return Math.floor(Date.now() / 1000) + offset;
}

const bufferToHex = (buffer: ArrayBufferLike) =>
  [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");

export async function generateSignedUrl(
  c: WigglesContext,
  imageId: string,
  expiration: number,
  size: ImageSize
) {
  const url = new URL(
    `https://imagedelivery.net/rU-SUfJIowrXlhOg19NLsQ/${imageId}/${size}`
  );
  const encoder = new TextEncoder();
  const secretKeyData = encoder.encode(c.env.IMAGES_KEY);
  const key = await crypto.subtle.importKey(
    "raw",
    secretKeyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const expiry = Math.floor(Date.now() / 1000) + expiration;
  url.searchParams.set("exp", expiry.toString());

  const stringToSign = url.pathname + "?" + url.searchParams.toString();

  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(stringToSign)
  );
  const sig = bufferToHex(new Uint8Array(mac).buffer);

  url.searchParams.set("sig", sig);

  return url.toString();
}

const RE_MULTIPART =
  /^multipart\/form-data(?:;\s*boundary=(?:"((?:[^"]|\\")+)"|([^\s;]+)))$/;

const getBoundary = (request: Request): string | undefined => {
  const contentType = request.headers.get("Content-Type");
  if (!contentType) return;

  const matches = RE_MULTIPART.exec(contentType);
  if (!matches) return;

  return matches[1] || matches[2];
};

export const parseFormDataRequest = async (
  request: Request
): Promise<FormData | undefined> => {
  const boundary = getBoundary(request);
  if (!boundary || !request.body) return;

  const parts = await parseMultipart(request.body, boundary);

  const formData = new FormData();

  for (const { name, data, filename, contentType } of parts) {
    if (filename !== undefined) {
      formData.append(
        name,
        new File([data], filename, { type: contentType }) as Blob
      );
    } else {
      formData.append(name, new TextDecoder().decode(data));
    }
  }

  return formData;
};
