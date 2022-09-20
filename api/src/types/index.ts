import { Context } from "hono";

export type Account = {
  displayName: string;
  email: string;
  id: string;
  photoURL: string;
};

export type Post = {
  id: string;
  contentType: string;
  timestamp: string;
  accountId: string;
  cfImageId: string;
};

export type WigglesEnv = {
  Bindings: {
    WIGGLES: KVNamespace;
    IMAGES_KEY: string;
    DOMAIN: string;
    AUDIENCE: string;
    ACCOUNT_ID: string;
    API_KEY: string;
    ENV: "development" | "production";
  };
};
export type WigglesContext = Context<string, WigglesEnv>;
