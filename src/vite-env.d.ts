/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_API_KEY: string
  readonly VITE_PRODUCTS_SHEET_ID: string
  readonly VITE_SALES_SHEET_ID: string
  readonly VITE_PRODUCTS_RANGE?: string
  readonly VITE_SALES_RANGE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
