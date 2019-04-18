import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import './__styles__/fade.css';

export const Fade = ({
  children,
  appear = false,
  enter = false,
  leave = false
}) => (
  <CSSTransitionGroup
    transitionName="fade"
    transitionAppear={appear}
    transitionAppearTimeout={500}
    transitionEnter={enter}
    transitionEnterTimeout={500}
    transitionLeave={leave}
    transitionLeaveTimeout={300}
  >
    {children}
  </CSSTransitionGroup>
);
