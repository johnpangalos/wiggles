/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: "production" | "development";
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_RELEASE: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace google.accounts.id {
  interface CredentialResponse {
    credential: string;
    select_by: string;
  }

  interface GsiButtonConfiguration {
    type?: "standard" | "icon";
    theme?: "outline" | "filled_blue" | "filled_black";
    size?: "large" | "medium" | "small";
    text?: "signin_with" | "signup_with" | "continue_with" | "signin";
    shape?: "rectangular" | "pill" | "circle" | "square";
    logo_alignment?: "left" | "center";
    width?: string;
  }

  function initialize(config: {
    client_id: string;
    callback: (response: CredentialResponse) => void;
    auto_select?: boolean;
  }): void;

  function renderButton(
    parent: HTMLElement,
    options: GsiButtonConfiguration
  ): void;

  function disableAutoSelect(): void;
}
