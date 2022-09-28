/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: "production" | "development";
  readonly VITE_API_URL: string;
  readonly VITE_REDIRECT_URL: string;
  readonly VITE_AUDIENCE: string;
  readonly VITE_RELEASE: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
