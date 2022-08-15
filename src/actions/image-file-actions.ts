import { constants } from "@/constants";

type SetFileOptions = {
  orientation: string;
  imagePreview: string;
  file: File;
};
export const setFile = ({
  orientation,
  imagePreview,
  file,
}: SetFileOptions) => ({
  type: constants.SET_FILE,
  orientation,
  imagePreview,
  file,
});
