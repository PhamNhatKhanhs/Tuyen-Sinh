import React, { useEffect } from 'react';
import { Form, Input, Button, Typography, Alert, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loginStart, loginSuccess, loginFailure, selectAuthLoading, selectAuthError, selectIsAuthenticated, selectUser, selectToken } from '../store/authSlice';
import authService from '../services/authService'; 

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);

  const [form] = Form.useForm();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    // Kiểm tra nếu đã đăng nhập
    if (isAuthenticated && user && token) {
      // Chuyển hướng dựa vào role
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from === '/login' || from === '/register' ? '/candidate/dashboard' : from, { replace: true });
      }
    }
  }, [isAuthenticated, navigate, from, user, token]);

  const onFinish = async (values: any) => {
    try {
      dispatch(loginStart());
      
      const response = await authService.login(values.email, values.password);
      
      if (response.success && response.token && response.user) {
        // Lưu token và user vào localStorage
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('authUser', JSON.stringify(response.user));
        
        // Dispatch action để cập nhật Redux store
        dispatch(loginSuccess({ user: response.user, token: response.token }));
      } else {
        dispatch(loginFailure(response.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu."));
      }
    } catch (error: any) {
      // Xử lý lỗi token hết hạn
      if (error.response?.status === 401 && error.response?.data?.message?.includes('Token đã hết hạn')) {
        // Xóa token cũ
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        dispatch(loginFailure('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'));
      } else {
        dispatch(loginFailure(error.message || "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại."));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" tip="Đang xử lý..." />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Title level={3} className="text-center mb-6">Đăng Nhập Tài Khoản</Title>
      {authError && (
        <Alert 
          message={authError} 
          type="error" 
          showIcon 
          className="mb-4" 
          closable
        />
      )}
      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        layout="vertical"
        requiredMark="optional"
        size="large"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input 
            prefix={<UserOutlined className="text-gray-400" />} 
            placeholder="Email" 
            size="large"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password 
            prefix={<LockOutlined className="text-gray-400" />} 
            placeholder="Mật khẩu" 
            size="large"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isLoading} 
            block 
            size="large" 
            className="bg-indigo-600 hover:bg-indigo-700 h-12 text-base"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
          </Button>
        </Form.Item>
      </Form>
      <div className="text-center mt-4">
        <Typography.Text className="text-gray-600">Chưa có tài khoản? </Typography.Text>
        <Button 
          type="link" 
          onClick={() => navigate('/register')} 
          className="p-0 text-indigo-600 hover:text-indigo-500"
        >
          Đăng ký ngay
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;