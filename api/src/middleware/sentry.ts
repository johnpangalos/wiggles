import { MiddlewareHandler } from "@/types";
import { Toucan, Options as ToucanOptions } from "toucan-js";

declare module "hono" {
  interface ContextVariableMap {
    sentry: Toucan;
  }
}

export function sentry(
  options?: Partial<ToucanOptions>
): MiddlewareHandler<void> {
  return async (c, next) => {
    if (c.env.ENV !== "production") return await next();

    const sentry = new Toucan({
      request: c.req.raw,
      context: c.executionCtx,
      release: c.env.RELEASE,
      environment: c.env.ENV,
      ...options,
    });
    c.set("sentry", sentry);

    try {
      await next();
    } catch (error) {
      sentry.captureException(error);
      throw error;
    }
  };
}
