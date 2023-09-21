import { NewPost } from "@/types";

type ImageProps = {
  thumbnail?: boolean;
  loading?: "lazy" | "eager";
  post: NewPost;
};

export function Image({
  post,
} // thumbnail = false,
: ImageProps) {
  return (
    <img
      className="w-full h-full bg-no-repeat object-contain object-center"
      src={post.url}
      alt={post.url}
    />
  );
}
