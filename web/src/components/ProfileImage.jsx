import React from 'react';

export const ProfileImage = ({ url }) => (
  <div
    className="w-full h-full bg-cover rounded-full bg-no-repeat bg-center"
    style={{ backgroundImage: `url(${url})` }}
    alt="Profile Image"
  />
);
