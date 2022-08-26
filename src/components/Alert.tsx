import { ReactNode } from "react";
import { SlideUp } from "../components/transitions";
import { X } from "react-feather";

enum ColorMap {
  INFO,
  SUCCESS,
  ERROR,
  WARNING,
}

function colorClasses(type: ColorMap): string {
  switch (type) {
    case ColorMap.INFO:
      return `bg-blue-100 border-blue-400 text-blue-600`;
    case ColorMap.SUCCESS:
      return `bg-green-100 border-gren-400 text-gren-600`;
    case ColorMap.ERROR:
      return `bg-red-100 border-red-400 text-red-600`;
    case ColorMap.WARNING:
      return `bg-yellow-100 border-yellow-400 text-yellow-600`;
    default:
      return "";
  }
}

type AlertProps = {
  children: ReactNode;
  show: boolean;
  onClose: () => void;
  type: ColorMap;
};

export function Alert({
  show,
  children,
  type = ColorMap.INFO,
  onClose,
}: AlertProps) {
  return (
    <SlideUp show={show} unmountOnExit addEndListener={() => null}>
      <div className="pt-4 px-3 w-full">
        <div
          className={`border ${colorClasses(
            type
          )} px-4 py-3 rounded h-full w-full`}
          role="alert"
        >
          <div className="flex items-center">
            <div className="flex-grow">{children}</div>

            {onClose && (
              <X
                onClick={onClose}
                role="button"
                className={`text-2xl fill-current text${ColorMap[type]}-600`}
              />
            )}
          </div>
        </div>
      </div>
    </SlideUp>
  );
}
