import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { checkRegistration, register, unregister } from "~/lib/register-sw";
import "~/styles/index.css";

const queryClient = new QueryClient();

function ServiceWorkerRegistration() {
  useEffect(() => {
    const registerSW = async () => {
      await unregister();
      const registration = await checkRegistration();
      if (registration === undefined) await register();
    };
    registerSW();
  }, []);
  return null;
}

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#5d3e9d" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Outlet />
          <ServiceWorkerRegistration />
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
