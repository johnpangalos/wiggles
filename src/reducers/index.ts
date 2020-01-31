import { configureStore } from '@reduxjs/toolkit';
import { posts } from './posts';
import { user } from './user';
import { combineReducers } from 'redux';

const reducer = combineReducers({
  posts: posts.reducer,
  user: user.reducer
});

export const store = configureStore({ reducer });
export { posts, user };
