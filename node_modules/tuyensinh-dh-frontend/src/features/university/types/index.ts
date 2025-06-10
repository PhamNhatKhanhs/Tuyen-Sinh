export interface UniversityBE { // Dữ liệu trường từ Backend
  _id: string;
  name: string;
  code: string;
  address?: string;
  website?: string;
  logoUrl?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UniversityFE { // Dữ liệu trường cho Frontend (đã map _id -> id)
  id: string;
  name: string;
  code: string;
  address?: string;
  website?: string;
  logoUrl?: string;
  description?: string;
  isActive?: boolean;
}