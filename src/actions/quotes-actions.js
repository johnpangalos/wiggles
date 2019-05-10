import { constants } from '~/constants';

export const addQuote = quote => ({
  type: constants.ADD_QUOTES,
  payload: { [quote.id]: quote }
});

export const removeQuote = id => ({
  type: constants.REMOVE_QUOTE,
  payload: id
});
