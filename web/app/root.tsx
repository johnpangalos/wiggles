import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from "react-router";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { setTokenAccessor, setUserEmail } from "@/utils";

import "@/styles/index.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#f3f4f6" />
        <link
          rel="manifest"
          href="/manifest.json"
          crossOrigin="use-credentials"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function TokenAccessorSetup() {
  const { getAccessTokenSilently, user } = useAuth0();
  useEffect(() => {
    setTokenAccessor(getAccessTokenSilently);
  }, [getAccessTokenSilently]);
  useEffect(() => {
    setUserEmail(user?.email);
  }, [user?.email]);
  return null;
}

export default function Root() {
  const navigate = useNavigate();

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri:
          typeof window !== "undefined"
            ? window.location.origin + "/feed"
            : undefined,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
      cacheLocation="localstorage"
      useRefreshTokens
      onRedirectCallback={(appState) => {
        navigate(appState?.returnTo || "/feed");
      }}
    >
      <TokenAccessorSetup />
      <div id="App" className="h-[100svh] overflow-hidden text-gray-800">
        <Outlet />
      </div>
    </Auth0Provider>
  );
}
