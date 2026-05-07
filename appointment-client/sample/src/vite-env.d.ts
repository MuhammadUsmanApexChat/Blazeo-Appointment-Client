/// <reference types="vite/client" />

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BLAZEO_BASE_URL?: string;
  readonly VITE_BLAZEO_CONSUMER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
