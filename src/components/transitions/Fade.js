import React from 'react';
import { CSSTransition } from 'react-transition-group';

const classNames = {
  appear: 'opacity-0',
  appearActive: 'fadeIn an-1s',
  enterActive: 'fadeIn an-1s',
  exit: 'opacity-100',
  exitActive: 'fadeOut an-1s'
};

export const Fade = ({ children, show = true, className = '', ...rest }) => (
  <CSSTransition in={show} timeout={950} classNames={classNames} {...rest}>
    {state => <>{children}</>}
  </CSSTransition>
);
