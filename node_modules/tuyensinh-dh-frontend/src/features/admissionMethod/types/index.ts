export interface AdmissionMethodBE {
  _id: string;
  name: string;
  code?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface AdmissionMethodFE {
  id: string;
  name: string;
  code?: string;
  description?: string;
  isActive?: boolean;
}