import React from 'react';
import { Transition } from 'react-transition-group';

const duration = 10000;

const defaultStyle = {
  transition: `all ${duration}ms ease-in-out`,
  height: 0
};

const transitionStyles = height => ({
  entering: { height },
  entered: { height },
  exiting: { height: 0 },
  exited: { height: 0 }
});

export const SlideUp = ({
  children,
  show = true,
  height = '100%',
  ...rest
}) => (
  <Transition in={show} timeout={duration} {...rest}>
    {state => (
      <div
        className="overflow-y-hidden"
        style={{
          ...defaultStyle,
          ...transitionStyles(height)[state]
        }}
      >
        {children}
      </div>
    )}
  </Transition>
);
