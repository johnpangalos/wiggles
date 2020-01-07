import { constants } from 'constants/index';

export const addPosts = posts => ({
  type: constants.ADD_POSTS,
  payload: posts
});

export const removePost = id => ({
  type: constants.REMOVE_POST,
  payload: id
});
