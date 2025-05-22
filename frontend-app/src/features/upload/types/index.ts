export interface UploadedFileResponse {
  documentId: string;
  fileName: string; // Tên file trên server
  filePath: string; // Đường dẫn file trên server (có thể dùng để hiển thị/download)
  originalName: string; // Tên file gốc
  documentType: string; // Loại minh chứng
}