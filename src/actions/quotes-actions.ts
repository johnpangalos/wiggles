import { constants } from 'constants/index';

export const addQuotes = payload => ({
  type: constants.ADD_QUOTES,
  payload
});

export const addQuote = quote => ({
  type: constants.ADD_QUOTES,
  payload: { [quote.id]: quote }
});

export const removeQuote = id => ({
  type: constants.REMOVE_QUOTE,
  payload: id
});
