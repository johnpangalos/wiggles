import React from 'react';
import { ProfileImage, Button } from '~/components';

export const Header = ({ account, signOut }) => (
  <div className="flex w-full">
    <div className="pr-6">
      <div className="h-12 w-12">
        <ProfileImage url={account.photoURL} />
      </div>
    </div>

    <div className="flex flex-grow flex-col pt-1 overflow-hidden pr-2">
      <div className="text-xl font-bold truncate">{account.displayName}</div>
      <div className="text-sm truncate">{account.email}</div>
    </div>

    <div>
      <Button color="red-light" hoverColor="red" dark onClick={() => signOut()}>
        Logout
      </Button>
    </div>
  </div>
);
