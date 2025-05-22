import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store'; 

// Định nghĩa kiểu dữ liệu cho User (khớp với Backend User model, trừ password)
export interface User {
  id: string; // Sẽ là _id từ MongoDB
  email: string;
  role: 'candidate' | 'admin';
  fullName?: string;
  isActive?: boolean;
  createdAt?: string;
  // Thêm các trường khác nếu Backend trả về và Frontend cần
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean; // Loading cho các action của auth (login, register, loadUser)
  error: string | null;
}

// Lấy user và token từ localStorage một cách an toàn
const getInitialUser = (): User | null => {
  const storedUser = localStorage.getItem('authUser');
  if (storedUser) {
    try {
      return JSON.parse(storedUser) as User;
    } catch (e) {
      localStorage.removeItem('authUser'); // Xóa nếu JSON không hợp lệ
      return null;
    }
  }
  return null;
};

const initialState: AuthState = {
  user: getInitialUser(),
  token: localStorage.getItem('authToken'),
  isAuthenticated: !!localStorage.getItem('authToken') && !!getInitialUser(),
  loading: false, // Ban đầu không loading, chỉ loading khi có action
  error: null,
};


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: any; token: string }>) => {
      // Backend trả về user có _id, cần map sang id cho Frontend
      const backendUser = action.payload.user;
      const feUser: User = {
        id: backendUser._id, // Map _id từ backend
        email: backendUser.email,
        role: backendUser.role,
        fullName: backendUser.fullName,
        isActive: backendUser.isActive,
      };
      state.user = feUser;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem('authToken', action.payload.token); 
      localStorage.setItem('authUser', JSON.stringify(feUser)); 
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    },
    loadUserFromStorage: (state) => {
        state.loading = true; // Bắt đầu loading
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');
        if (token && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser) as User;
                // Kiểm tra xem user có id không (để đảm bảo là object User hợp lệ)
                if (parsedUser && parsedUser.id) {
                    state.user = parsedUser;
                    state.token = token;
                    state.isAuthenticated = true;
                } else { // Nếu không hợp lệ, xóa khỏi localStorage
                    throw new Error("Invalid user object in storage");
                }
            } catch (e) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                console.error("Failed to load user from storage:", e);
            }
        } else { // Nếu không có token hoặc user, đảm bảo trạng thái là unauthenticated
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        }
        state.loading = false; // Kết thúc loading
    },
    setUser: (state, action: PayloadAction<User>) => { // Dùng khi đăng ký thành công và BE trả về user
        state.user = action.payload;
        // Thường thì setUser sẽ đi kèm với set token và isAuthenticated nếu tự động login
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, loadUserFromStorage, setUser, setLoading } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;