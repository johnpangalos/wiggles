import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { Button } from "../components";

const classNames = {
  appear: "visible",
  appearActive: "zoomIn an-250ms",
  enterActive: "zoomIn an-250ms",
  enter: "visible",
  exit: "visible",
  exitActive: "fadeOut an-250s",
  exitDone: "invisible",
};

type SnackBarProps = {
  show: boolean;
  text: string;
  action: () => void;
  actionText: string;
};

export function SnackBar({
  show,
  text,
  action,
  actionText,
}: SnackBarProps): JSX.Element {
  const [timedout, setTimedout] = useState(false);
  useEffect(() => {
    if (!show) return;
    const timeoutFunc = window.setTimeout(() => {
      setTimedout(true);
    }, 4000);
    return () => {
      setTimedout(false);
      window.clearTimeout(timeoutFunc);
    };
  }, [show]);
  return (
    <div className="w-full p-2 absolute pin-b">
      <CSSTransition
        unmountOnExit
        in={show && !timedout}
        timeout={250}
        classNames={classNames}
      >
        <div className="w-full h-full py-2 bg-grey-800 text-white rounded">
          <div className="flex items-center w-full h-full">
            <div className="flex-grow pl-4">{text}</div>
            {actionText && (
              <div className="pr-4">
                <Button onClick={() => action()} variant="link">
                  actionText
                </Button>
              </div>
            )}
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}
