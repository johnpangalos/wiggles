export type ImageResizeOptions = {
  w?: number;
  h?: number;
  fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
  q?: number;
};

export function imageUrl(
  origin: string,
  r2Key: string,
  resize?: ImageResizeOptions,
): string {
  const base = `${origin}/api/images/${r2Key}`;

  if (!resize) return base;

  const params = new URLSearchParams();
  if (resize.w) params.set("w", resize.w.toString());
  if (resize.h) params.set("h", resize.h.toString());
  if (resize.fit) params.set("fit", resize.fit);
  if (resize.q) params.set("q", resize.q.toString());

  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export const parseFormData = async (
  request: Request,
): Promise<{ file: File; key: string }[] | undefined> => {
  const incoming = await request.formData();
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
