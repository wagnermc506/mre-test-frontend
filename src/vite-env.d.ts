/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VIACEP_URL?: string
  readonly VITE_NOTICIAS_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}