import { WigglesContext } from "@/types";
import { Next } from "hono";
import { Bindings, Variables } from "hono/dist/hono";

export const getIdentity = async ({
  jwt,
  domain,
}: {
  jwt: string;
  domain: string;
}): Promise<undefined | Identity> => {
  const identityURL = new URL("/cdn-cgi/access/get-identity", domain);
  const response = await fetch(identityURL.toString(), {
    headers: { Cookie: `CF_Authorization=${jwt}` },
  });
  if (response.ok) return await response.json();
};

export const generateLoginURL = ({
  redirectURL: redirectURLInit,
  domain,
  aud,
}: {
  redirectURL: string | URL;
  domain: string;
  aud: string;
}): string => {
  const redirectURL =
    typeof redirectURLInit === "string"
      ? new URL(redirectURLInit)
      : redirectURLInit;
  const { host } = redirectURL;
  const loginPathname = `/cdn-cgi/access/login/${host}?`;
  const searchParams = new URLSearchParams({
    kid: aud,
    redirect_url: redirectURL.pathname + redirectURL.search,
  });
  return new URL(loginPathname + searchParams.toString(), domain).toString();
};

export const generateLogoutURL = ({ domain }: { domain: string }) =>
  new URL(`/cdn-cgi/access/logout`, domain).toString();

export type Identity = {
  id: string;
  name: string;
  email: string;
  groups: string[];
  amr: string[];
  idp: { id: string; type: string };
  geo: { country: string };
  user_uuid: string;
  account_id: string;
  ip: string;
  auth_status: string;
  common_name: string;
  service_token_id: string;
  service_token_status: boolean;
  is_warp: boolean;
  is_gateway: boolean;
  version: number;
  device_sessions: Record<string, { last_authenticated: number }>;
  iat: number;
};

export type JWTPayload = {
  aud: string | string[];
  common_name?: string; // Service token client ID
  country?: string;
  custom?: unknown;
  email?: string;
  exp: number;
  iat: number;
  nbf?: number;
  iss: string; // https://<domain>.cloudflareaccess.com
  type?: string; // Always just 'app'?
  identity_nonce?: string;
  sub: string; // Empty string for service tokens or user ID otherwise
};

export type PluginArgs = {
  aud: string;
  domain: string;
};

export type PluginData = {
  cloudflareAccess: {
    JWT: {
      payload: JWTPayload;
      getIdentity: () => Promise<undefined | Identity>;
    };
  };
};

// const extractJWTFromRequest = (request: Request) =>
//   request.cookie.get("Cf-Access-Jwt-Assertion");

// Adapted slightly from https://github.com/cloudflare/workers-access-external-auth-example
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

type Key = {
  kid: string;
} & JsonWebKey;

type CertsResponse = {
  keys: Key[];
  public_cert: { kid: string; cert: string };
  public_certs: { kid: string; cert: string }[];
};

const generateValidator =
  (c: WigglesContext) =>
  async (
    request: Request
  ): Promise<{
    jwt: string;
    payload: object;
  }> => {
    const jwt = request.cookie("CF_Authorization");

    if (jwt === null) throw new Error("JWT not on request");
    const parts = jwt.split(".");
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

    const certsURL = new URL("/cdn-cgi/access/certs", c.env.DOMAIN);

    const certsResponse = await fetch(certsURL.toString());
    const { keys } = (await certsResponse.json()) as CertsResponse;
    if (!keys) {
      throw new Error("Could not fetch signing keys.");
    }
    const jwk = keys.find((key) => key.kid === kid);
    if (!jwk) {
      throw new Error("Could not find matching signing key.");
    }
    if (jwk.kty !== "RSA" || jwk.alg !== "RS256") {
      throw new Error("Unknown key type of algorithm.");
    }
    // c.env.WIGGLES.put(jwkKey, JSON.stringify(jwk));
    // }

    const key = await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const unroundedSecondsSinceEpoch = Date.now() / 1000;

    const payloadObj = JSON.parse(textDecoder.decode(base64URLDecode(payload)));

    if (payloadObj.iss && payloadObj.iss !== certsURL.origin) {
      throw new Error("JWT issuer is incorrect.");
    }
    if (payloadObj.aud && payloadObj.aud[0] !== c.env.AUDIENCE) {
      throw new Error("JWT audience is incorrect.");
    }
    if (
      payloadObj.exp &&
      Math.floor(unroundedSecondsSinceEpoch) >= payloadObj.exp
    ) {
      throw new Error("JWT has expired.");
    }
    if (
      payloadObj.nbf &&
      Math.ceil(unroundedSecondsSinceEpoch) < payloadObj.nbf
    ) {
      throw new Error("JWT is not yet valid.");
    }

    const verified = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      base64URLDecode(signature),
      asciiToUint8Array(`${header}.${payload}`)
    );
    if (!verified) {
      throw new Error("Could not verify JWT.");
    }

    return { jwt, payload: payloadObj };
  };

export type Environment = {
  Bindings: Bindings;
  Variables: Variables;
};

export type MiddlewareHandler = (
  c: WigglesContext,
  next: Next
) => Promise<undefined | Response>;

export function auth(): MiddlewareHandler {
  return async (c: WigglesContext, next: Next) => {
    try {
      const validator = generateValidator(c);

      const { jwt, payload } = await validator(c.req);

      c.set("cloudflareAccess", {
        JWT: {
          payload,
          getIdentity: () => getIdentity({ jwt, domain: c.env.DOMAIN }),
        },
      });

      await next();
      return;
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }

    return c.json({ message: "Unauthorized", ok: false }, 401);
  };
}
