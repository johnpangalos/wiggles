import React from 'react';
import { SlideUp } from '~/components/transitions';
import { Button } from '~/components';

export const SnackBar = ({ show, text, action, actionText }) => (
  <div className="w-full p-2">
    <SlideUp height="60px" show={show} appear>
      <div className="w-full h-full bg-grey-darkest text-white rounded">
        <div className="flex items-center w-full h-full">
          <div className="flex-grow pl-4">{text}</div>
          {actionText && (
            <div className="pr-4">
              <Button onClick={() => action()} dark hoverColor="grey-darker">
                <span className="text-red-light">{actionText}</span>
              </Button>
            </div>
          )}
        </div>
        )}
      </div>
    </SlideUp>
  </div>
);
