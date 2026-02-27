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

  const height = thumbnail ? "h-[115px] md:h-[164px]" : "h-[424px]";

  if (post.pending) {
    return (
      <div
        className={`${height} w-full flex items-center justify-center animate-pulse bg-gray-200 rounded`}
      >
        <svg
          className="w-8 h-8 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 19.5V4.5a2.25 2.25 0 0 0-2.25-2.25H3.75A2.25 2.25 0 0 0 1.5 4.5v15a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      </div>
    );
  }

  const src = resizedUrl(post.url, thumbnail);
  return (
    <div className={height}>
      <img
        className="w-full h-full bg-no-repeat object-contain object-center"
        loading={loading}
        src={src}
        alt={post.url}
      />
    </div>
  );
}
