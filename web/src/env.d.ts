/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: "production" | "development";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
