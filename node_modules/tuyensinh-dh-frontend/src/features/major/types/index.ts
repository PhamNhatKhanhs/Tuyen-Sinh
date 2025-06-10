export interface MajorBE {
  _id: string;
  name: string;
  code: string;
  university: string | { _id: string; name: string; code: string }; // Có thể là ID hoặc populated object
  description?: string;
  admissionQuota?: number;
  isActive?: boolean;
}
export interface MajorFE {
  id: string;
  name: string;
  code: string;
  universityId: string;
  universityName?: string; // Thêm nếu cần hiển thị
  description?: string;
  admissionQuota?: number;
  isActive?: boolean;
}