import { ReactNode } from "react";

export function Modal({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-64 bg-white rounded shadow p-3 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
