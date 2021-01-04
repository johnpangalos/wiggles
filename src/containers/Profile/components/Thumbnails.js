import React from 'react';
import { MoreVertical } from 'react-feather';

import { ImageWrapper } from '../../ImageWrapper';
import { QuoteWrapper } from '../../QuoteWrapper';
import { Post, Loading, Menu } from '~/components';
import { constants } from '../reducer';

export const Thumbnails = ({
  loading,
  posts,
  selected,
  handleClick,
  dispatch,
  selectMode
}) => {
  return (
    <div className="flex flex-col h-full py-5">
      <div className="flex items-center h-12">
        <div className="flex-grow text-xl font-bold pb-2">Images</div>
        <div className="relative">
          {!selectMode && (
            <Menu
              id="images-menu"
              activator={() => (
                <div className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-gray-400 p-1">
                  <MoreVertical
                    role="button"
                    className={`text-xl fill-current text`}
                  />
                </div>
              )}
              items={[
                ({ onClose }) => (
                  <div
                    className="w-32 px-4 py-2 hover:bg-grey-400 cursor-pointer"
                    onClick={() => {
                      dispatch({
                        type: constants.SET_SELECT_MODE,
                        payload: true
                      });
                      onClose();
                    }}
                  >
                    Select Mode
                  </div>
                )
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
            .map((post, index) => (
              <div key={post.id} className="pb-2 w-1/3 md:w-1/4 xl:w-1/5 px-1">
                <Post
                  handleClick={() => handleClick(post.id)}
                  selectable={selectMode}
                  selected={selected[post.id]}
                  size="32"
                >
                  {post.type === 'image' && (
                    <ImageWrapper thumb id={post.refId} />
                  )}
                  {post.type === 'quote' && <QuoteWrapper id={post.refId} />}
                </Post>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
