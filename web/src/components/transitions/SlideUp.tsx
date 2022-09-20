import React from "react";
import { Transition, TransitionStatus } from "react-transition-group";
import { CSSTransitionProps } from "react-transition-group/CSSTransition";

type SlideUpProps = {
  children?: React.ReactNode;
  show?: boolean;
  className?: string;
} & CSSTransitionProps;

const duration = 10000;

const defaultStyle = {
  transition: `all ${duration}ms ease-in-out`,
  height: 0,
};

export function SlideUp({
  children,
  show = true,
  height = "100%",
  ...rest
}: SlideUpProps) {
  return (
    <Transition in={show} timeout={duration} {...rest}>
      {(state: TransitionStatus) => (
        <div
          className="overflow-y-hidden"
          style={{
            ...defaultStyle,
            height: ["entering", "entered"].includes(state) ? height : 0,
          }}
        >
          {children}
        </div>
      )}
    </Transition>
  );
}
