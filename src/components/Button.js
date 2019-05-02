import React from 'react';

export const Button = ({
  children,
  className,
  onClick,
  color,
  hoverColor,
  dark = false
}) => {
  let colorClasses = color
    ? `bg-${color} hover:bg-${hoverColor}`
    : 'bg-transparent hover:bg-grey-light';
  let textClass = dark ? 'text-white' : 'text-grey-darkest';
  return (
    <button
      onClick={event => onClick(event)}
      className={`${colorClasses} ${textClass} ${className} rounded py-3 px-4`}
    >
      {children}
    </button>
  );
};
