import React from "react";

export function ProfileImage({ url }: { url: string | null }) {
  return (
    <div
      className="w-full h-full bg-cover rounded-full bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${url})` }}
    />
  );
}
