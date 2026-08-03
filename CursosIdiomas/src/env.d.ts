/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_PAGE_SIZE: string;
  readonly VITE_PAYPAL_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}