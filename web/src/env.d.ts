/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: "production" | "development";
  readonly VITE_API_URL: string;
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_AUTH0_AUDIENCE: string;
  readonly VITE_RELEASE: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
