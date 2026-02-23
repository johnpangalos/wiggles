import { WigglesContext } from "@/types";
import { HonoRequest } from "hono";

export function imageUrl(c: WigglesContext, r2Key: string): string {
  const url = new URL(c.req.url);
  return `${url.origin}/images/${r2Key}`;
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
