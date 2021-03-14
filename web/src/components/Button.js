import React from 'react';

export const Button = ({
  children,
  className = '',
  onClick = () => null,
  color = 'transparent',
  hoverColor = 'gray-400',
  dark = false,
  primary = true
}) => {
  let textClass = dark ? 'text-white' : 'text-gray-800';
  let baseClass =
    'transition-colors duration-300 focus:outline-none text-sm rounded p-2 uppercase';
  let colorClass = `bg-${color} hover:bg-${hoverColor} ${textClass}`;
  let primaryClass = 'bg-purple-700 hover:bg-purple-800 text-white';
  return (
    <button
      onClick={event => onClick(event)}
      className={`${baseClass} ${className} ${
        primary ? primaryClass : colorClass
      }`}
    >
      {children}
    </button>
  );
};
