import { Post } from "@/types";

type ImageProps = {
  thumbnail?: boolean;
  loading?: "lazy" | "eager";
  post?: Post;
};

export function Image({ post, thumbnail = false, loading }: ImageProps) {
  if (!post) return <></>;
  const url = thumbnail ? post.media.thumbnailUrl : post.media.webUrl;
  return (
    <div className={thumbnail ? "h-[115px] md:h-[164px]" : "h-[424px]"}>
      <img
        className="w-full h-full bg-no-repeat object-contain object-center"
        loading={loading}
        src={url}
        alt={url}
      />
    </div>
  );
}
