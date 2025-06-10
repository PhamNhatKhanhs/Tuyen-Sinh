export interface User {
  id: string;
  email: string;
  role: 'candidate' | 'admin';
  fullName?: string;
  isActive?: boolean;
  createdAt?: string;
  phoneNumber?: string;
  dob?: string;
  idNumber?: string;
  address?: string;
  gender?: 'male' | 'female' | 'other';
  avatarUrl?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
  error?: string;
} 