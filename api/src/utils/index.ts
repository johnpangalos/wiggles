import { WigglesContext } from "@/types";
import { HonoRequest } from "hono";

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
    secretKeyData.buffer as ArrayBuffer,
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

export const parseFormDataRequest = async (
  request: HonoRequest
): Promise<FormData[] | undefined> => {
  const incoming = await request.raw.formData();
  const files = incoming.getAll("file");
  if (files.length === 0) return;

  const formDataList: FormData[] = [];
  for (const entry of files) {
    if (typeof entry === "string") continue;
    const ext = entry.type?.includes("png") ? "png" : "jpeg";
    const filename = `${crypto.randomUUID()}.${ext}`;
    const formData = new FormData();
    formData.append("file", new File([entry], filename, { type: entry.type }));
    formDataList.push(formData);
  }

  return formDataList;
};
