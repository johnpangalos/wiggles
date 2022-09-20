import React from "react";
import { CSSTransition } from "react-transition-group";
import { CSSTransitionProps } from "react-transition-group/CSSTransition";

type SlideInDown = {
  timeout?: number;
  children?: React.ReactNode;
  show?: boolean;
  className?: string;
} & CSSTransitionProps;

export function SlideInDown({
  timeout = 1000,
  children,
  show = true,
  ...rest
}: SlideInDown) {
  const classNames = {
    appear: "visible",
    appearActive: `slideInDown an-${timeout}ms`,
    enterActive: `slideInDown an-${timeout}ms`,
    enter: "visible",
    exit: "visible",
    exitActive: `slideOutUp an-${timeout}ms`,
    exitDone: "invisible",
  };

  return (
    <CSSTransition
      in={show}
      timeout={timeout}
      classNames={classNames}
      {...rest}
    >
      {() => <>{children}</>}
    </CSSTransition>
  );
}
