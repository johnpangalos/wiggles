import React from 'react';

export const CircleButton = ({
  children,
  className,
  onClick,
  color,
  dark = false
}) => {
  let colorClasses = color
    ? `bg-${color} hover:bg-${color}-dark`
    : 'bg-transparent hover:bg-grey-light';
  let textClass = dark ? 'text-white' : 'text-grey-darkest';
  return (
    <button
      onClick={event => onClick(event)}
      className={`${colorClasses} ${textClass} ${className} flex items-center justify-center rounded-full h-16 w-16`}
    >
      {children}
    </button>
  );
};
