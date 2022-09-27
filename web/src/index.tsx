import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@/styles/index.css";
import App from "@/App";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

console.log(import.meta.env.PROD);
// Sentry.init({
//   dsn: "https://645ca46ead98408a94482c3f2bb4dcac@o343924.ingest.sentry.io/1890426",
//   integrations: [new Integrations.BrowserTracing()],
//   environment: import.meta.env.MODE,
//   enabled: import.meta.env.PROD,
// });

const queryClient = new QueryClient();

const container = document.getElementById("root");

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
