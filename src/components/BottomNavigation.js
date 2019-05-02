import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faCameraRetro,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import '~/components/transitions';
export const BottomNavigation = () => (
  <div className="z-10 bg-grey-darkest flex items-center justify-center w-full h-16 border-t-2 border-red-light absolute pin-b px-12">
    <div className="flex items-center justify-around flex-shrink w-full max-w-lg">
      <NavButton to="/" icon={faHome} text={'Feed'} />
      <NavButton to="/camera" icon={faCameraRetro} text={'Camera'} />
      <NavButton to="/profile" icon={faUser} text={'Profile'} />
    </div>
  </div>
);

const NavButton = ({ icon, text, to }) => (
  <NavLink
    exact
    to={to}
    activeClassName="text-red-light"
    className="flex flex-col items-center px-4 text-white border-white no-underline color-transition"
  >
    <FontAwesomeIcon className="pb-1" role="button" size="2x" icon={icon} />
    <div className="text-xs">{text}</div>
  </NavLink>
);
