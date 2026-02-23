import { MiddlewareHandler, WigglesContext } from "@/types";
import { Next } from "hono";

export type Auth0JWTPayload = {
  iss: string;
  sub: string;
  aud: string | string[];
  exp: number;
  iat: number;
  azp?: string;
  scope?: string;
  "https://wiggle-room.xyz/email": string;
  "https://wiggle-room.xyz/name": string;
  "https://wiggle-room.xyz/picture": string;
};

type JWK = {
  kid: string;
  kty: string;
  alg: string;
} & JsonWebKey;

type JWKSResponse = {
  keys: JWK[];
};

export function getEmailFromPayload(payload: Auth0JWTPayload): string {
  return payload["https://wiggle-room.xyz/email"];
}

export function getNameFromPayload(payload: Auth0JWTPayload): string {
  return payload["https://wiggle-room.xyz/name"];
}

export function getPictureFromPayload(payload: Auth0JWTPayload): string {
  return payload["https://wiggle-room.xyz/picture"];
}

const base64URLDecode = (s: string) => {
  s = s.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  return new Uint8Array(
    Array.prototype.map.call(atob(s), (c: string) =>
      c.charCodeAt(0),
    ) as unknown as ArrayBufferLike,
  );
};

const asciiToUint8Array = (s: string) => {
  const chars = [];
  for (let i = 0; i < s.length; ++i) {
    chars.push(s.charCodeAt(i));
  }
  return new Uint8Array(chars);
};

async function validateAuth0Token(
  token: string,
  auth0Domain: string,
  audience: string,
): Promise<Auth0JWTPayload> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("JWT does not have three parts.");
  }
  const [header, payload, signature] = parts;

  const textDecoder = new TextDecoder("utf-8");
  const { kid, alg } = JSON.parse(textDecoder.decode(base64URLDecode(header)));
  if (alg !== "RS256") {
    throw new Error("Unknown JWT type or algorithm.");
  }

  const certsResponse = await fetch(
    `https://${auth0Domain}/.well-known/jwks.json`,
    {
      cf: {
        cacheTtl: 5 * 60,
        cacheEverything: true,
      },
    },
  );
  const { keys } = (await certsResponse.json()) as JWKSResponse;
  if (!keys) {
    throw new Error("Could not fetch Auth0 signing keys.");
  }
  const jwk = keys.find((key) => key.kid === kid);
  if (!jwk) {
    throw new Error("Could not find matching signing key.");
  }
  if (jwk.kty !== "RSA" || jwk.alg !== "RS256") {
    throw new Error("Unknown key type or algorithm.");
  }

  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const verified = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    base64URLDecode(signature),
    asciiToUint8Array(`${header}.${payload}`),
  );
  if (!verified) {
    throw new Error("Could not verify JWT.");
  }

  const payloadObj = JSON.parse(
    textDecoder.decode(base64URLDecode(payload)),
  ) as Auth0JWTPayload;

  const expectedIssuer = `https://${auth0Domain}/`;
  if (payloadObj.iss !== expectedIssuer) {
    throw new Error("JWT issuer is incorrect.");
  }

  const aud = Array.isArray(payloadObj.aud) ? payloadObj.aud : [payloadObj.aud];
  if (!aud.includes(audience)) {
    throw new Error("JWT audience is incorrect.");
  }

  const now = Math.floor(Date.now() / 1000);
  if (payloadObj.exp && now >= payloadObj.exp) {
    throw new Error("JWT has expired.");
  }

  return payloadObj;
}

export function auth(): MiddlewareHandler<Response | undefined> {
  return async (c: WigglesContext, next: Next) => {
    try {
      const authHeader = c.req.header("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Missing or invalid Authorization header");
      }
      const token = authHeader.slice(7);

      const payload = await validateAuth0Token(
        token,
        c.env.AUTH0_DOMAIN,
        c.env.AUTH0_AUDIENCE,
      );

      c.set("JWT", { payload });

      await next();
      return;
    } catch (e) {
      console.error({
        level: "error",
        handler: "auth",
        method: c.req.method,
        path: c.req.path,
        message: e instanceof Error ? e.message : "Unknown auth error",
        stack: e instanceof Error ? e.stack : undefined,
      });
    }

    return c.json({ message: "Unauthorized", ok: false }, 401);
  };
}
