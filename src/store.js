import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import * as reducers from '~/reducers';

const rootReducer = combineReducers({
  ...reducers
});

export const store = createStore(rootReducer, {}, applyMiddleware(logger));
