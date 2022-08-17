import { Constants } from "@/constants";

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
  type: Constants.SET_FILE,
  orientation,
  imagePreview,
  file,
});
