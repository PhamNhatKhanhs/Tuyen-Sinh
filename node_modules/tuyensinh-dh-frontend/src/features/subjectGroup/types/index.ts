export interface SubjectGroupBE {
  _id: string;
  code: string;
  name: string;
  subjects: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface SubjectGroupFE {
  id: string;
  code: string;
  name: string;
  subjects: string[]; // Mảng các tên môn, ví dụ: ["Toán", "Vật Lý", "Hóa Học"]
  isActive?: boolean;
}