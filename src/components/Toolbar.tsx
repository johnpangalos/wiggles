import React, { ReactNode } from "react";
import { SlideInDown } from "../components/transitions";

export const Toolbar = ({
  showing,
  children,
}: {
  showing: boolean;
  children: ReactNode | ReactNode[];
}) => {
  return (
    <>
      <SlideInDown timeout={250} mountOnEnter unmountOnExit show={showing}>
        <div className="h-16" />
      </SlideInDown>
      <SlideInDown timeout={300} mountOnEnter unmountOnExit show={showing}>
        <div className="w-full py-3 bg-gray-500 absolute text-white">
          <div className="max-w-lg m-auto">{children}</div>
        </div>
      </SlideInDown>
    </>
  );
};
