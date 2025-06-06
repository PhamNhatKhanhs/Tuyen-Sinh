/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  // Thêm các biến môi trường khác nếu cần
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
} 