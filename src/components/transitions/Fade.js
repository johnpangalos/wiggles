import React from 'react';
import { CSSTransition } from 'react-transition-group';

const classNames = {
  appear: 'opacity-0',
  appearActive: 'fadeIn an-1s',
  appearDone: 'active-done opacity-100',
  enter: 'opacity-0',
  enterActive: 'fadeIn an-1s',
  enterDone: 'enter-done opacity-100',
  exit: 'opacity-100',
  exitActive: 'fadeOut an-1s',
  exitDone: 'opacity-0'
};

export const Fade = ({ children, show = true, className = '', ...rest }) => (
  <CSSTransition in={show} timeout={1000} classNames={classNames} {...rest}>
    {state => <>{children}</>}
  </CSSTransition>
);
