import React from 'react';
import { Home, Upload, User } from 'react-feather';

import { NavLink } from 'react-router-dom';
import '../components/transitions';
export const BottomNavigation = () => (
  <div className="z-10 bg-gray-100 flex items-center justify-center w-full py-3 border-t-2 border-purple-600 pin-b px-12">
    <div className="flex items-center justify-around flex-shrink w-full max-w-lg">
      <NavButton to="/" icon={Home} text={'Feed'} />
      <NavButton to="/upload" icon={Upload} text={'Upload'} />
      <NavButton to="/profile" icon={User} text={'Profile'} />
    </div>
  </div>
);

const NavButton = ({ icon: Icon, text, to }) => (
  <NavLink
    exact={to === '/'}
    to={to}
    activeClassName="text-purple-600"
    className="flex flex-col items-center px-4 text-gray-600 no-underline color-transition outline-none"
  >
    <Icon />
    <div className="text-xs">{text}</div>
  </NavLink>
);
