import React from 'react';
import './__styles__/loading-spinner.css';
import { Fade } from '~/components/transitions';

export const Loading = () => (
  <div className="flex items-center justify-center h-full w-full">
    <Fade appear={true}>
      <div className="self-center loading">
        <div />
      </div>
    </Fade>
  </div>
);
