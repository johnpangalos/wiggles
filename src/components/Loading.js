import React from 'react';
import './__styles__/loading-spinner.css';

export const Loading = ({ message = '' }) => (
  <div className="flex items-center justify-center h-full w-full">
    <div className="flex flex-col items-center justify-center h-full w-full">
      {message && <div className="pb-2 text-lg">{message}</div>}
      <div className="self-center loading">
        <div />
      </div>
    </div>
  </div>
);
