import { NewPost } from "@/types";

type ImageProps = {
  thumbnail?: boolean;
  loading?: "lazy" | "eager";
  post?: NewPost;
};

function resizedUrl(base: string, thumbnail: boolean): string {
  const separator = base.includes("?") ? "&" : "?";
  if (thumbnail) {
    return `${base}${separator}w=400&h=400&fit=cover`;
  }
  return `${base}${separator}w=1080&fit=scale-down`;
}

export function Image({
  post,
  thumbnail = false,
  loading = "lazy",
}: ImageProps) {
  if (!post) return <></>;
  const src = resizedUrl(post.url, thumbnail);
  return (
    <div>
      <div className={thumbnail ? "h-[115px] md:h-[164px]" : "h-[424px]"}>
        <img
          className="w-full h-full bg-no-repeat object-contain object-center"
          loading={loading}
          src={src}
          alt={post.url}
        />
      </div>
      <p className="text-xs text-gray-500 break-all mt-1">{src}</p>
    </div>
  );
}
