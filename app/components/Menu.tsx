import { Component, useState, useEffect, createRef, ReactNode } from "react";

type MenuProps = {
  id: string;
  activator: ReactNode;
  items: (typeof Component)[];
};
export function Menu({ activator, id, items }: MenuProps) {
  const menu = createRef<HTMLDivElement>();
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    function clickHandler(event: MouseEvent) {
      const isValidRef = menu && menu.current;
      if (!isValidRef || isValidRef.contains(event.target as Node)) return;

      setShowing(false);
    }

    document.addEventListener("mousedown", clickHandler);

    return () => {
      document.removeEventListener("mousedown", clickHandler);
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
          {items.map((Item, index) => (
            <Item onClose={() => setShowing(false)} key={`${id}-${index}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
