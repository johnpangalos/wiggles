import React from 'react';
import cn from 'classnames';


export const Button = ({
  children,
  className='',
  onClick = (string) => null,
  color = 'transparent',
  hoverColor = 'grey-light',
  dark = false
}) => {
  return (
    <button
      onClick={event => onClick(event)}
      className={
        cn(
          "focus:outline-none", "text-sm", "rounded", "p-2", "uppercase", {
            [`bg-${color}`]: color,
            [`hover:bg-${hoverColor}`]:hoverColor,
            className: className,
            ['text-white']: dark,
            ['text-grey-darkest']: !dark,
          
          }
        )
      }
    >
      {children}
    </button>
  );
};
