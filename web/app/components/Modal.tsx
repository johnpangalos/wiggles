import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
};

export function Modal({ children, open, onClose }: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center">
        <DialogPanel className="w-64 bg-white rounded shadow p-3 overflow-y-auto">
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
