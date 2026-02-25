import { ReactNode } from "react";

export const Toolbar = ({
  children,
}: {
  showing: boolean;
  children: ReactNode | ReactNode[];
}) => {
  return (
    <>
      <div className="h-16" />
      <div className="w-full py-3 bg-gray-500 absolute text-white">
        <div className="max-w-lg m-auto">{children}</div>
      </div>
    </>
  );
};
