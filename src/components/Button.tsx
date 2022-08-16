import React, { ReactNode } from "react";

type ButtonVariant = "primary" | "link" | "secondary";
type ButtonProps = {
  children: ReactNode;
  className?: string;
  onClick: () => void;
  variant: ButtonVariant;
};

const variantClasses: Record<string, string> = {
  primary: "bg-purple-700 hover:bg-purple-800 text-white",
  link: "bg-transparent hover:bg-gray-400 text-gray-800",
};
const baseClass =
  "transition-colors duration-300 focus:outline-none text-sm rounded p-2 uppercase";

export function Button({
  children,
  className = "",
  onClick = () => null,
  variant = "primary",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={[baseClass, className, variantClasses[variant]].join(" ")}
    >
      {children}
    </button>
  );
}