export type Account = {
  displayName: string;
  email: string;
  id?: string;
  photoURL: string;
};

export type Post = {
  id: string;
  contentType: string;
  timestamp: string;
  accountId: string;
  r2Key: string;
};

export type NewPost = {
  url: string;
  account: Account;
  id: string;
  contentType: string;
  timestamp: string;
  accountId: string;
  r2Key: string;
  orderKey: string;
};

export interface Env {
  WIGGLES: KVNamespace;
  IMAGES_BUCKET: R2Bucket;
  AUTH0_DOMAIN: string;
  AUTH0_AUDIENCE: string;
  AUTH0_CLIENT_ID: string;
  AUTH0_CLIENT_SECRET: string;
  SESSION_SECRET: string;
  ENV: string;
}
