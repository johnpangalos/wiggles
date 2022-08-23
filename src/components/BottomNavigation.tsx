import React from "react";
import { Home, Icon, Upload, User } from "react-feather";

import { NavLink } from "react-router-dom";
import "../components/transitions";

export function BottomNavigation() {
  return (
    <div className="z-10 bg-gray-100 flex items-center justify-center w-full py-3 border-t-2 border-purple-600 pin-b px-12">
      <div className="flex items-center justify-around flex-shrink w-full max-w-lg">
        <NavButton to="/feed" icon={Home} text={"Feed"} />
        <NavButton to="/upload" icon={Upload} text={"Upload"} />
        <NavButton to="/profile" icon={User} text={"Profile"} />
      </div>
    </div>
  );
}

type NavButtonProps = {
  icon: Icon;
  text: string;
  to: string;
};

function NavButton({ icon: Icon, text, to }: NavButtonProps) {
  return (
    <NavLink
      to={to}
      className="flex flex-col items-center px-4 text-gray-600 no-underline color-transition outline-none"
    >
      <Icon />
      <div className="text-xs">{text}</div>
    </NavLink>
  );
}

// activeClassName="text-purple-600"
