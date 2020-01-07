import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUpload, faUser } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import 'components/transitions';
export const BottomNavigation = () => (
  <div className="z-10 bg-secondary flex items-center justify-center w-full py-3 border-t-2 border-primary pin-b px-12">
    <div className="flex items-center justify-around flex-shrink w-full max-w-lg">
      <NavButton to="/" icon={faHome} text={'Feed'} />
      <NavButton to="/upload" icon={faUpload} text={'Upload'} />
      <NavButton to="/profile" icon={faUser} text={'Profile'} />
    </div>
  </div>
);

const NavButton = ({ icon, text, to }) => (
  <NavLink
    exact={to === '/'}
    to={to}
    activeClassName="text-primary"
    className="flex flex-col items-center px-4 text-tertiary no-underline color-transition outline-none"
  >
    <FontAwesomeIcon className="pb-1" role="button" size="2x" icon={icon} />
    <div className="text-xs">{text}</div>
  </NavLink>
);
