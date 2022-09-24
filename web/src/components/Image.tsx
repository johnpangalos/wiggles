import { NewPost } from "@/types";

type ImageProps = {
  thumbnail?: boolean;
  loading?: "lazy" | "eager";
  post?: NewPost;
};

export function Image({
  post,
  thumbnail = false,
  loading = "lazy",
}: ImageProps) {
  if (!post) return <></>;
  return (
    <div className={thumbnail ? "h-[115px] md:h-[164px]" : "h-[424px]"}>
      <img
        className="w-full h-full bg-no-repeat object-contain object-center"
        loading={loading}
        src={post.url}
        alt={post.url}
      />
    </div>
  );
}
