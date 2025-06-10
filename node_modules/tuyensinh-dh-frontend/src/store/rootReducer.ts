import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
// import other feature reducers here
// ví dụ: import candidateReducer from '../features/candidate/store/candidateSlice';
// import adminReducer from '../features/admin/store/adminSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  // candidate: candidateReducer,
  // admin: adminReducer,
  // ...Thêm các reducers của features khác
});

export default rootReducer;