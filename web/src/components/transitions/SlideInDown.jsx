import React from 'react';
import { CSSTransition } from 'react-transition-group';

export const SlideInDown = ({
  timeout = 1000,
  children,
  show = true,
  className = '',
  ...rest
}) => {
  const classNames = {
    appear: 'visible',
    appearActive: `slideInDown an-${timeout}ms`,
    enterActive: `slideInDown an-${timeout}ms`,
    enter: 'visible',
    exit: 'visible',
    exitActive: `slideOutUp an-${timeout}ms`,
    exitDone: 'invisible'
  };

  return (
    <CSSTransition
      in={show}
      timeout={timeout}
      classNames={classNames}
      {...rest}
    >
      {state => <>{children}</>}
    </CSSTransition>
  );
};
