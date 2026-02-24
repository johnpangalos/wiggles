import { NewPost } from "@/types";

type ImageProps = {
  thumbnail?: boolean;
  loading?: "lazy" | "eager";
  post?: NewPost;
};

function resizedUrl(
  base: string,
  params: Record<string, string | number>,
): string {
  const separator = base.includes("?") ? "&" : "?";
  const qs = Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  return `${base}${separator}${qs}`;
}

export function Image({
  post,
  thumbnail = false,
  loading = "lazy",
}: ImageProps) {
  if (!post) return <></>;

  const src = thumbnail
    ? resizedUrl(post.url, { w: 200, fit: "cover" })
    : resizedUrl(post.url, { w: 640, fit: "scale-down" });

  return (
    <div className={thumbnail ? "h-[115px] md:h-[164px]" : "h-[424px]"}>
      <img
        className="w-full h-full bg-no-repeat object-contain object-center"
        loading={loading}
        src={src}
        alt={post.url}
      />
    </div>
  );
}
