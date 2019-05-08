import React from 'react';
import { CSSTransition } from 'react-transition-group';

const classNames = {
  appear: 'visible',
  appearActive: 'fadeIn an-1s',
  enterActive: 'fadeIn an-1s',
  enter: 'visible',
  exit: 'visible',
  exitActive: 'fadeOut an-1s',
  exitDone: 'invisible'
};

export const Fade = ({ children, show = true, className = '', ...rest }) => (
  <CSSTransition in={show} timeout={950} classNames={classNames} {...rest}>
    {state => <>{children}</>}
  </CSSTransition>
);
