
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types'; // Đảm bảo đường dẫn này đúng

// Interface cho state, bao gồm cả trạng thái tải lần đầu và trạng thái đăng nhập
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  initialLoadStatus: 'loading' | 'succeeded' | 'failed'; // Theo dõi lần tải đầu tiên của ứng dụng
  loginStatus: 'idle' | 'loading' | 'failed'; // Theo dõi quá trình đăng nhập trên form
  error: string | null; // Lưu lỗi đăng nhập
}

// Trạng thái ban đầu
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  initialLoadStatus: 'loading',
  loginStatus: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action để kiểm tra localStorage lúc khởi động
    loadUserFromStorage: (state) => {
      try {
        const userJson = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (userJson && token) {
          state.user = JSON.parse(userJson);
          state.token = token;
          state.isAuthenticated = true;
        }
      } catch (e) {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.clear();
      }
      state.initialLoadStatus = 'succeeded';
    },

    // Actions cho quá trình đăng nhập của form
    loginStart: (state) => {
      state.loginStatus = 'loading';
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loginStatus = 'succeeded';
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loginStatus = 'failed';
      state.error = action.payload;
    },

    // Action đăng xuất
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loginStatus = 'idle';
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

// Export các actions mà LoginPage.tsx cần
export const { 
  loadUserFromStorage, 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout 
} = authSlice.actions;

// Export các selectors mà các component khác cần
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.initialLoadStatus; // Selector cho "cổng chờ"
export const selectToken = (state: { auth: AuthState }) => state.auth.token;

// Selectors cho form đăng nhập
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loginStatus === 'loading';
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;
