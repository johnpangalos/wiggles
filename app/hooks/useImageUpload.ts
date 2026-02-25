import { create } from "zustand";

export type Result = string | ArrayBuffer | null;

type ImageUploadState = {
  urls: Result[];
  files: File[];
  reset: () => void;
  addUrls: (urls: Result[]) => void;
  addFiles: (files: File[]) => void;
};

const defaultState = {
  urls: [],
  files: [],
};

export const useImageUpload = create<ImageUploadState>()((set) => ({
  ...defaultState,
  reset: () => set(defaultState),
  addUrls: (urls: Result[]) => set((state) => ({ ...state, urls })),
  addFiles: (files: File[]) => set((state) => ({ ...state, files })),
}));
