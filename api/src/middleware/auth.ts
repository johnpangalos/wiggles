import { MiddlewareHandler, WigglesContext } from "@/types";
import { Next } from "hono";

export type GoogleJWTPayload = {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
  hd?: string;
};

type GoogleJWK = {
  kid: string;
  kty: string;
  alg: string;
} & JsonWebKey;

type GoogleJWKSResponse = {
  keys: GoogleJWK[];
};

const base64URLDecode = (s: string) => {
  s = s.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  return new Uint8Array(
    Array.prototype.map.call(atob(s), (c: string) =>
      c.charCodeAt(0)
    ) as unknown as ArrayBufferLike
  );
};

const asciiToUint8Array = (s: string) => {
  const chars = [];
  for (let i = 0; i < s.length; ++i) {
    chars.push(s.charCodeAt(i));
  }
  return new Uint8Array(chars);
};

async function validateGoogleToken(
  token: string,
  clientId: string
): Promise<GoogleJWTPayload> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("JWT does not have three parts.");
  }
  const [header, payload, signature] = parts;

  const textDecoder = new TextDecoder("utf-8");
  const { kid, alg } = JSON.parse(
    textDecoder.decode(base64URLDecode(header))
  );
  if (alg !== "RS256") {
    throw new Error("Unknown JWT type or algorithm.");
  }

  const certsResponse = await fetch(
    "https://www.googleapis.com/oauth2/v3/certs",
    {
      cf: {
        cacheTtl: 5 * 60,
        cacheEverything: true,
      },
    }
  );
  const { keys } = (await certsResponse.json()) as GoogleJWKSResponse;
  if (!keys) {
    throw new Error("Could not fetch Google signing keys.");
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
    ["verify"]
  );

  const verified = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    base64URLDecode(signature),
    asciiToUint8Array(`${header}.${payload}`)
  );
  if (!verified) {
    throw new Error("Could not verify JWT.");
  }

  const payloadObj = JSON.parse(
    textDecoder.decode(base64URLDecode(payload))
  ) as GoogleJWTPayload;

  if (
    payloadObj.iss !== "https://accounts.google.com" &&
    payloadObj.iss !== "accounts.google.com"
  ) {
    throw new Error("JWT issuer is incorrect.");
  }
  if (payloadObj.aud !== clientId) {
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

      const payload = await validateGoogleToken(token, c.env.GOOGLE_CLIENT_ID);

      c.set("JWT", { payload });

      await next();
      return;
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }

    return c.json({ message: "Unauthorized", ok: false }, 401);
  };
}
