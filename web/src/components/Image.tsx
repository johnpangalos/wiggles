import { NewPost } from "@/types";

type ImageProps = {
  thumbnail?: boolean;
  loading?: "lazy" | "eager";
  post?: NewPost;
};

function resizedUrl(
  url: string,
  params: { w?: number; h?: number; fit?: string },
): string {
  const sep = url.includes("?") ? "&" : "?";
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  return qs ? `${url}${sep}${qs}` : url;
}

export function Image({
  post,
  thumbnail = false,
  loading = "lazy",
}: ImageProps) {
  if (!post) return <></>;

  const src = thumbnail
    ? resizedUrl(post.url, { w: 400, h: 400, fit: "cover" })
    : resizedUrl(post.url, { w: 1080, fit: "cover" });

  return (
    <div
      className={
        thumbnail ? "h-full w-full" : "w-full aspect-square max-h-[600px]"
      }
    >
      <img
        className="w-full h-full bg-no-repeat object-cover object-center"
        loading={loading}
        src={src}
        alt={post.url}
      />
    </div>
  );
}
