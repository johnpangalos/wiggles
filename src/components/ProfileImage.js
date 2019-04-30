import React from 'react';

export const ProfileImage = ({ url }) => (
  <div
    className="w-full h-full bg-contain rounded-full"
    style={{ backgroundImage: `url(${url})` }}
    alt="Profile Image"
  />
);
