import { Auth0JWTPayload } from "@/middleware/auth";
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
  imageId: string;
};

export type WigglesEnv = {
  Bindings: {
    WIGGLES: KVNamespace;
    IMAGES_BUCKET: R2Bucket;
    AUTH0_DOMAIN: string;
    AUTH0_AUDIENCE: string;
    ACCOUNT_ID: string;
    API_KEY: string;
    WIGGLES_KV_ID: string;
  };
  Variables: {
    JWT: {
      payload: Auth0JWTPayload;
    };
  };
};
export type WigglesContext = Context<WigglesEnv>;

export type MiddlewareHandler<T> = (
  c: WigglesContext,
  next: () => Promise<void>,
) => Promise<T>;
