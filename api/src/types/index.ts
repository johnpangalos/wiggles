import { Identity } from "@/middleware/auth";
import { Context } from "hono";
import { Bindings, Next, Variables } from "hono/dist/hono";

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
    RELEASE: string | undefined;
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

export type Environment = {
  Bindings: Bindings;
  Variables: Variables;
};

export type MiddlewareHandler<T> = (
  c: WigglesContext,
  next: Next
) => Promise<T>;
