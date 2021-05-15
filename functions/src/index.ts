import * as admin from "firebase-admin";

admin.initializeApp();

export { processSignUp } from "./auth/process-sign-up";
export { afterImageUpload } from "./storage/after-image-upload";
export { onDeleteImage } from "./database/on-image-delete";
export { onPostDelete } from "./database/on-post-delete";
export { api } from "./api";
