import { Identity } from "@/middleware/auth";
import { Context } from "hono";

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
    WIGGLES_KV_ID: string;
    ENV: "development" | "production";
  };
  Variables: {
    JWT: {
      payload: object;
      getIdentity: () => Promise<Identity | undefined>;
    };
  };
};
export type WigglesContext = Context<string, WigglesEnv>;
