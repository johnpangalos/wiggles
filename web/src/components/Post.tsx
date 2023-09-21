import { ProfileImage } from "@/components";
import { NewPost } from "@/types";
import { usePostsLoadedState } from "@/stores";

type PostProps = {
  thumbnail?: boolean;
  selected?: boolean;
  selectable?: boolean;
  handleClick?: () => void;
  post: NewPost;
};

export const Post = ({
  thumbnail,
  post,
  selectable,
  selected,
  handleClick,
}: PostProps): JSX.Element => {
  const date = new Date(Number(post.timestamp));
  const { updatePost } = usePostsLoadedState();

  return (
    <div
      className={`
          w-full m-auto  max-w-xl
          ${thumbnail ? "bg-gray-100 border border-gray-200 p-1 rounded" : ""}
          ${selectable ? " cursor-pointer" : ""}
          ${selected ? " border-purple-600 border-2" : ""}`}
      onClick={() => {
        if (!selectable) return;
        handleClick?.();
      }}
    >
      <div
        className={
          thumbnail
            ? "h-[115px] md:h-[164px]"
            : "h-full flex flex-grow justify-center items-center"
        }
      >
        <img
          className="w-full h-full bg-no-repeat object-contain object-center"
          src={post.url}
          alt={post.url}
          onLoad={() => {
            updatePost(post.id, true);
          }}
        />
      </div>
      {!thumbnail && (
        <div className="flex pt-3 items-start">
          <div className="h-10 w-10">
            <ProfileImage url={post.account.photoURL} />
          </div>
          <div className="flex-grow pl-3">
            <div className="text-xl font-bold">{post.account.displayName}</div>
            <div className="text-sm">Uploaded: {date.toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  );
};
