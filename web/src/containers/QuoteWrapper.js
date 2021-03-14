import React, { useCallback } from 'react';
import { useMappedState } from 'redux-react-hook';

export const QuoteWrapper = ({ id }) => {
  const mapState = useCallback(
    state => ({
      quote: state.quotes[id]
    }),
    [id]
  );

  const { quote } = useMappedState(mapState);

  return (
    !!quote && (
      <div className="flex items-center justify-center hypens p-2 text-3xl h-full w-full overflow-y-auto">
        {quote.text}
      </div>
    )
  );
};
