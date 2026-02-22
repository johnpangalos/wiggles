import React, { ReactNode, MouseEvent } from "react";

type CircleButtonProps = {
  children: ReactNode;
  className?: string;
  onClick: (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void;
};

const defaultClasses =
  "focus:outline-none flex items-center justify-center rounded-full h-16 w-16 bg-purple-600 hover:bg-purple-700 text-white";

export function CircleButton({
  children,
  className = "",
  onClick,
}: CircleButtonProps): React.JSX.Element {
  return (
    <button
      onClick={(event) => onClick(event)}
      className={[defaultClasses, className].join(" ")}
    >
      {children}
    </button>
  );
}
