import React from 'react';
import cn from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, User } from 'react-feather';

export const BottomNav = () => (
  <div className="z-10 bg-secondary flex items-center justify-center w-full py-3 border-t-2 border-primary pin-b px-12">
    <div className="flex items-center justify-around flex-shrink w-full max-w-lg">
      <NavButton to="/" icon={Home} text={'Feed'} />
      <NavButton to="/upload" icon={Upload} text={'Upload'} />
      <NavButton to="/profile" icon={User} text={'Profile'} />
    </div>
  </div>
);

const NavButton = ({ icon: Icon, text, to }) => {
  let location = useLocation();
  return (
    <Link
      to={to}
      className={cn(
        `flex flex-col items-center px-4 
      no-underline outline-none`,
        {
          'text-primary': to === location.pathname,
          'text-tertiary': to !== location.pathname
        }
      )}
    >
      <Icon />
      <div className="text-xs">{text}</div>
    </Link>
  );
};
