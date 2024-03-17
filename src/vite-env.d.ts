/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_API_KEY: string
  readonly VITE_APP_AUTH_DOMAIN: string
  readonly VITE_APP_PROJECT_ID: string
  readonly VITE_APP_STORAGE_BUCKER: string
  readonly VITE_APP_MESSAGING_SENDER_ID: string
  readonly VITE_APP_APP_ID: string
  readonly VITE_APP_MEASUREMENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
