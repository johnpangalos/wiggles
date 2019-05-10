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
      const quoteRef = window.firebase.database().ref(`quotes/${id}`);
      const snap = await quoteRef.once('value');
      const val = snap.val();
      if (!didCancel && val) dispatch(addQuote(val));
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
