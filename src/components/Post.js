import React from 'react';
import { ProfileImage } from '~/components';
import { Fade } from '~/components/transitions';

export const Post = ({
  children,
  timestamp = 0,
  size,
  selected = false,
  selectable = false,
  handleClick = () => null,
  account
}) => {
  const date = new Date(Number(timestamp));

  return (
    <Fade show={true} appear>
      <div
        className={`flex flex-col bg-white shadow-md rounded px-2 pt-3 pb-4 w-full h-${size} max-w-${size}${
          selectable ? ' cursor-pointer' : ''
        }${selected ? ' border-primary border-2' : ''}`}
      >
        <div
          className="flex flex-grow bg-secondary-dark p-1 rounded justify-center items-center h-full"
          onClick={() => handleClick()}
        >
          {children}
        </div>
        {account && (
          <div className="flex pt-3 items-start">
            <div className="h-10 w-10">
              <ProfileImage url={account.photoURL} />
            </div>
            <div className="pl-3">
              <div className="text-xl font-bold">{account.displayName}</div>
              <div className="text-sm">Uploaded: {date.toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>
    </Fade>
  );
};
