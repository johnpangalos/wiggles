import React, { Dispatch } from "react";
import { MoreVertical } from "react-feather";

import { ImageWrapper } from "../../ImageWrapper";
import { Post, Loading, Menu } from "../../../components";
import { Post as PostType } from "@/types";
import { Constants } from "@/constants";

type ThumbnailsProps = {
  loading: boolean;
  posts: PostType[];
  selected: Record<string, PostType>;
  handleClick: (id: string) => void;
  dispatch: Dispatch<{ type: Constants; payload?: any }>;
  selectMode: boolean;
};

export const Thumbnails = ({
  loading,
  posts,
  selected,
  handleClick,
  dispatch,
  selectMode,
}: ThumbnailsProps) => {
  return (
    <div className="flex flex-col h-full py-5">
      <div className="flex items-center h-12">
        <div className="flex-grow text-xl font-bold pb-2">Images</div>
        <div className="relative">
          {!selectMode && (
            <Menu
              id="images-menu"
              activator={
                <div className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-gray-400 p-1">
                  <MoreVertical
                    role="button"
                    className={`text-xl fill-current text`}
                  />
                </div>
              }
              items={[
                ({ onClose, key }: { onClose: () => void; key: string }) => (
                  <div
                    key={key}
                    className="w-32 px-4 py-2 hover:bg-grey-400 cursor-pointer"
                    onClick={() => {
                      dispatch({
                        type: Constants.SET_SELECT_MODE,
                        payload: true,
                      });
                      onClose();
                    }}
                  >
                    Select Mode
                  </div>
                ),
              ]}
            />
          )}
        </div>
      </div>
      {loading && (
        <div className="flex h-full items-center justify-center">
          <Loading />
        </div>
      )}
      {!loading && (
        <div className="flex flex-wrap">
          {Object.values(posts)
            .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
            .slice(0, 101)
            .map((post, index) => (
              <div
                key={post.id}
                className="pb-2 w-1/3 md:w-1/4 xl:w-1/5 px-1 h-44 md:h-44 xl:h-32"
              >
                <Post
                  handleClick={() => handleClick(post.id)}
                  selectable={selectMode}
                  selected={selected[post.id]}
                >
                  {post.type === "image" && (
                    <ImageWrapper thumb id={post.refId} />
                  )}
                </Post>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
