import React, { ReactNode } from 'react';
import cn from 'classnames';

interface Props {
  children: ReactNode;
  className?: string;
  color?: string;
  onClick?: (string) => null;
  hoverColor?: string;
  dark?: boolean;
}

export const Button = ({
  children,
  className = '',
  onClick = string => null,
  color = 'transparent',
  hoverColor = 'gray-300',
  dark = false
}: Props) => {
  return (
    <button
      onClick={event => onClick(event)}
      className={cn(
        'focus:outline-none',
        'text-sm',
        'rounded',
        'p-2',
        'uppercase',
        {
          [`bg-${color}`]: color,
          [`hover:bg-${hoverColor}`]: hoverColor,
          className: className,
          'text-white': dark,
          'text-grey-darkest': !dark
        }
      )}
    >
      {children}
    </button>
  );
};
