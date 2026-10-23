/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** `1` in the static build for GitHub Pages / any host without the Express API. */
  readonly VITE_STATIC_BUILD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
