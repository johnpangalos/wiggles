export function getAuthorizationUrl(
  domain: string,
  clientId: string,
  redirectUri: string,
  state: string,
): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "openid profile email",
    state,
  });
  return `https://${domain}/authorize?${params.toString()}`;
}

export async function exchangeCodeForTokens(
  domain: string,
  clientId: string,
  clientSecret: string,
  code: string,
  redirectUri: string,
): Promise<{ id_token: string; access_token: string }> {
  const res = await fetch(`https://${domain}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${text}`);
  }

  return (await res.json()) as { id_token: string; access_token: string };
}

export function decodeIdToken(idToken: string): {
  email: string;
  name: string;
  picture: string;
} {
  const parts = idToken.split(".");
  if (parts.length !== 3) throw new Error("Invalid ID token");
  const payload = JSON.parse(
    atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
  );
  return {
    email: payload.email ?? "",
    name: payload.name ?? "",
    picture: payload.picture ?? "",
  };
}

export function getLogoutUrl(
  domain: string,
  clientId: string,
  returnTo: string,
): string {
  const params = new URLSearchParams({
    client_id: clientId,
    returnTo,
  });
  return `https://${domain}/v2/logout?${params.toString()}`;
}
