import { ReactNode } from "react";

export function Modal({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <div className="z-50 h-screen w-full flex flex-col items-center justify-center absolute">
      <div className="h-screen w-full absolute flex items-center justify-center">
        <div className="w-64 bg-white rounded shadow p-3 overflow-y-scroll">
          {children}
        </div>
      </div>
    </div>
  );
}
