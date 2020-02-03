import { configureStore } from '@reduxjs/toolkit';
import { posts, Post } from './posts';
import { images, Image } from './images';
import { user } from './user';
import { combineReducers } from 'redux';

const reducer = combineReducers({
  posts: posts.reducer,
  user: user.reducer,
  images: images.reducer
});

export const store = configureStore({ reducer });
export { posts, user, Post, images, Image };
