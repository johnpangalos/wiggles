import React from 'react';

export const Button = ({
  children,
  className = '',
  onClick = () => null,
  color = 'transparent',
  hoverColor = 'grey-light',
  dark = false
}) => {
  let textClass = dark ? 'text-white' : 'text-grey-darkest';
  return (
    <button
      onClick={event => onClick(event)}
      className={`focus:outline-none bg-${color} hover:bg-${hoverColor} ${textClass}${className} text-sm rounded p-2 uppercase`}
    >
      {children}
    </button>
  );
};
