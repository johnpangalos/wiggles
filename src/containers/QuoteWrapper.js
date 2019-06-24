import React, { useEffect, useCallback } from 'react';
import { addQuote } from '~/actions';
import { useDispatch, useMappedState } from 'redux-react-hook';

export const QuoteWrapper = ({ id }) => {
  const mapState = useCallback(
    state => ({
      quote: state.quotes[id]
    }),
    []
  );

  const dispatch = useDispatch();

  const { quote } = useMappedState(mapState);

  useEffect(() => {
    if (quote) return;
    let didCancel = false;

    const fetchPosts = async () => {
      const quote = await window.db
        .collection('quotes')
        .doc(id)
        .get();
      if (!didCancel) dispatch(addQuote(quote.data()));
    };

    fetchPosts();
    return () => {
      didCancel = true;
    };
  }, [id]);

  return (
    !!quote && (
      <div className="flex items-center justify-center hypens p-2 text-3xl h-full w-full overflow-y-auto">
        {quote.text}
      </div>
    )
  );
};
