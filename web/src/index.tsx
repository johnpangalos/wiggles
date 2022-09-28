import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@/styles/index.css";
import App from "@/App";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from "react-router-dom";

console.log(import.meta.env.PROD);

Sentry.init({
  dsn: "https://645ca46ead98408a94482c3f2bb4dcac@o343924.ingest.sentry.io/1890426",
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
  ],
  environment: import.meta.env.MODE,
  enabled: import.meta.env.PROD,
  tracesSampleRate: 1.0,
  release: import.meta.env.VITE_RELEASE,
});

const queryClient = new QueryClient();

const container = document.getElementById("root");

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

root.render(
  <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </Sentry.ErrorBoundary>
);
