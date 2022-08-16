import React, { useState, useEffect, createRef, ReactNode } from "react";

type MenuProps = {
  id: string;
  activator: ReactNode;
  items: any[];
};
export const Menu = ({ activator, id, items }: MenuProps) => {
  let menu = createRef<HTMLDivElement>();
  const [showing, setShowing] = useState(false);
  const preventClickaway = (event: any) =>
    !event.target.dataset && event.target.dataset.preventClickaway !== id;

  useEffect(() => {
    const eventListener = document.addEventListener("mousedown", (event) => {
      if (preventClickaway(event)) return;

      const isValidRef = menu && menu.current;
      if (!isValidRef || isValidRef.contains(event.target as Node)) return;

      setShowing(false);
    });

    return () => {
      document.removeEventListener("mousedown", eventListener as any);
    };
  });

  return (
    <div ref={menu} className="flex items-center py-1">
      <div
        onClick={() => {
          setShowing(!showing);
        }}
      >
        {activator}
      </div>
      <div
        className={`items-center absolute bg-white pin-t pin-r ${
          showing ? "visible" : "invisible"
        }`}
      >
        <div className="rounded overflow-hidden shadow-lg py-2">
          {items.map((item, index) =>
            item({ onClose: () => setShowing(false), key: `${id}-${index}` })
          )}
        </div>
      </div>
    </div>
  );
};
