import React, { useState, useEffect, createRef } from 'react';

export const Menu = ({ activator: Activator, id, items }) => {
  let menu = createRef(null);
  const [showing, setShowing] = useState(false);
  const preventClickaway = event =>
    !event.target.dataset && !event.target.dataset.preventClickaway === id;

  useEffect(() => {
    const eventListener = document.addEventListener('mousedown', event => {
      if (preventClickaway(event)) return;

      const isValidRef = menu && menu.current;
      if (!isValidRef || isValidRef.contains(event.target)) return;

      setShowing(false);
    });

    return () => {
      document.removeEventListener('mousedown', eventListener);
    };
  });

  return (
    <div ref={menu} className="flex items-center py-1">
      <div
        onClick={() => {
          setShowing(!showing);
        }}
      >
        <Activator />
      </div>
      <div
        className={`items-center absolute bg-white pin-t pin-r mt-6 ${
          showing ? 'visible' : 'invisible'
        }`}
      >
        <div className="rounded overflow-hidden shadow-lg py-2">
          {items.map((Item, index) => (
            <Item key={`${id}-${index}`} onClose={() => setShowing(false)} />
          ))}
        </div>
      </div>
    </div>
  );
};
