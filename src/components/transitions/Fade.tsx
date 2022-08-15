import React from "react";
import { CSSTransition } from "react-transition-group";
import { CSSTransitionProps } from "react-transition-group/CSSTransition";

const classNames = {
  appear: "visible",
  appearActive: "fadeIn an-1s",
  enterActive: "fadeIn an-1s",
  enter: "visible",
  exit: "visible",
  exitActive: "fadeOut an-1s",
  exitDone: "invisible",
};

type FadeProps = {
  children?: React.ReactNode;
  show?: boolean;
  className?: string;
} & CSSTransitionProps;

export function Fade({
  children,
  show = true,
  className = "",
  ...rest
}: FadeProps) {
  return (
    <CSSTransition in={show} timeout={950} classNames={classNames} {...rest}>
      {() => <>{children}</>}
    </CSSTransition>
  );
}
