import { constants } from "@/constants";
import { Post } from "@/types";

export const addPosts = (posts: Record<string, Post>) => ({
  type: constants.ADD_POSTS,
  payload: posts,
});

export const removePost = (id: string) => ({
  type: constants.REMOVE_POST,
  payload: id,
});
