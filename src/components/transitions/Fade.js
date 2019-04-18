import React from 'react';
import { Transition } from 'react-transition-group';

const defaultStyle = {
  transition: `opacity 500ms ease-in-out`,
  opacity: 0
};

const transitionStyles = {
  entering: { opacity: 1, zIndex: 2 },
  entered: { opacity: 1, zIndex: 2 },
  exiting: { opacity: 0, zIndex: 1 },
  exited: { opacity: 0, zIndex: 1 }
};

export const Fade = ({ children, show = true, className, ...rest }) => (
  <Transition
    in={show}
    timeout={{
      enter: 500,
      exit: 300
    }}
    {...rest}
  >
    {state => (
      <div
        className={`${className} absolute h-full w-full`}
        style={{
          ...defaultStyle,
          ...transitionStyles[state]
        }}
      >
        {children}
      </div>
    )}
  </Transition>
);
