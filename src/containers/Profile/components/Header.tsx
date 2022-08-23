import React from "react";
import { ProfileImage, Button } from "@/components";
import { Account } from "@/types";
import { useAuth } from "@/hooks";

type HeaderProps = {
  signOut: () => void;
};

export function Header({ signOut }: HeaderProps) {
  const { user } = useAuth();
  if (!user) return <></>;
  return (
    <div className="flex w-full">
      <div className="pr-6">
        <div className="h-12 w-12">
          <ProfileImage url={user.photoURL} />
        </div>
      </div>

      <div className="flex flex-grow flex-col pt-1 overflow-hidden pr-2">
        <div className="text-xl font-bold truncate">{user.displayName}</div>
        <div className="text-sm truncate">{user.email}</div>
      </div>

      <div className="pt-1">
        <Button onClick={() => signOut()}>Logout</Button>
      </div>
    </div>
  );
}
