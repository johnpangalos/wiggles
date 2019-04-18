import React from 'react';
import { Transition } from 'react-transition-group';

const duration = 300;

const defaultStyle = {
  transition: `all ${duration}ms ease-in-out`,
  height: 0
};

const transitionStyles = {
  entering: { height: '100%' },
  entered: { height: '100%' },
  exiting: { height: 0 },
  exited: { height: 0 }
};

export const SlideUp = ({ children, show = true, ...rest }) => (
  <Transition in={show} timeout={duration} {...rest}>
    {state => (
      <div
        className="overflow-y-hidden"
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
