import { constants } from "@/constants";
import { Quote } from "@/types";

export const addQuotes = (payload: Record<string, Quote>) => ({
  type: constants.ADD_QUOTES,
  payload,
});

export const addQuote = (quote: Quote) => ({
  type: constants.ADD_QUOTES,
  payload: { [quote.id]: quote },
});

export const removeQuote = (id: string) => ({
  type: constants.REMOVE_QUOTE,
  payload: id,
});
