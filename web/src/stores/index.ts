import { create } from "zustand";

interface PostsLoadedState {
  postsLoaded: Record<string, boolean>;
  updatePost: (id: string, loaded: boolean) => void;
}

export const usePostsLoadedState = create<PostsLoadedState>()((set) => ({
  postsLoaded: {},
  updatePost: (id, loaded) =>
    set((state) => ({ postsLoaded: { ...state.postsLoaded, [id]: loaded } })),
}));
