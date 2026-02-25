import { createRequestHandler } from "react-router";

// @ts-ignore - virtual module provided by React Router at build time
import * as build from "virtual:react-router/server-build";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

interface Env {
  WIGGLES: KVNamespace;
  IMAGES_BUCKET: R2Bucket;
  AUTH0_DOMAIN: string;
  AUTH0_AUDIENCE: string;
  AUTH0_CLIENT_ID: string;
  AUTH0_CLIENT_SECRET: string;
  SESSION_SECRET: string;
  ENV: string;
}

const requestHandler = createRequestHandler(build, import.meta.env.MODE);

export default {
  fetch(request, env, ctx) {
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
