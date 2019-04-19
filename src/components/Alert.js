import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { SlideUp } from '~/components/transitions';

const typeColorMap = {
  info: 'blue',
  success: 'green',
  error: 'red',
  warning: 'yellow'
};

const colorClasses = type => {
  const color = typeColorMap[type];
  return `bg-${color}-lightest border-${color}-light text-${color}-dark`;
};

export const Alert = ({ show, children, type = 'info', onClose }) => (
  <SlideUp show={show} unmountOnExit>
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
            <FontAwesomeIcon
              onClick={onClose}
              role="button"
              className={`text-2xl fill-current text${typeColorMap[type]}-dark`}
              icon={faTimes}
            />
          )}
        </div>
      </div>
    </div>
  </SlideUp>
);
