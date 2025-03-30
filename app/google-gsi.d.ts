// google-gsi.d.ts
interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (config: IdConfiguration) => void;
        renderButton: (
          element: HTMLElement,
          options: GsiButtonConfiguration,
        ) => void;
        prompt: (
          momentListener?: (promptMoment: PromptMomentNotification) => void,
        ) => void;
        disableAutoSelect: () => void;
        storeCredential: (
          credential: Credential,
          callback?: () => void,
        ) => void;
        cancel: () => void;
        onGoogleLibraryLoad: () => void;
        revoke: (
          hint: string,
          callback?: (response: RevocationResponse) => void,
        ) => void;
      };
      oauth2: {
        initTokenClient: (config: TokenClientConfig) => TokenClient;
        initCodeClient: (config: CodeClientConfig) => CodeClient;
        hasGrantedAllScopes: (
          tokenResponse: TokenResponse,
          ...scopes: string[]
        ) => boolean;
        hasGrantedAnyScope: (
          tokenResponse: TokenResponse,
          ...scopes: string[]
        ) => boolean;
        revoke: (accessToken: string, callback?: () => void) => void;
      };
    };
  };
}

// Add interfaces for the configuration objects
interface IdConfiguration {
  client_id: string;
  auto_select?: boolean;
  callback?: (response: CredentialResponse) => void;
  login_uri?: string;
  native_callback?: (response: CredentialResponse) => void;
  cancel_on_tap_outside?: boolean;
  prompt_parent_id?: string;
  nonce?: string;
  context?: string;
  state_cookie_domain?: string;
  ux_mode?: "popup" | "redirect";
  allowed_parent_origin?: string | string[];
  intermediate_iframe_close_callback?: () => void;
}
