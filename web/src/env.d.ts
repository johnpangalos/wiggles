/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: "production" | "development";
  readonly VITE_API_URL: string;
  readonly VITE_REDIRECT_URL: string;
  readonly VITE_AUDIENCE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
