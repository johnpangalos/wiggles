import { Constants } from "@/constants";
import { Post } from "@/types";

export const addPosts = (posts: Record<string, Post>) => ({
  type: Constants.ADD_POSTS,
  payload: posts,
});

export const removePost = (id: string) => ({
  type: Constants.REMOVE_POST,
  payload: id,
});
