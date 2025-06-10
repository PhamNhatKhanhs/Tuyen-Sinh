import React, { useEffect } from 'react';
import { Form, Input, Button, Typography, Alert, Spin } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loginStart, loginSuccess, loginFailure, selectAuthLoading, selectAuthError, selectIsAuthenticated, selectUser, selectToken } from '../store/authSlice';
import authService from '../services/authService';
import styles from './AuthPages.module.css';

const { Text } = Typography;

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
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Đang xử lý đăng nhập..." />
      </div>
    );
  }

  return (
    <div className={styles.authForm}>
      {authError && (
        <Alert 
          message="Đăng nhập thất bại" 
          description={authError}
          type="error" 
          showIcon 
          className="mb-6" 
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
          label="📧 Địa chỉ Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email của bạn!' },
            { type: 'email', message: 'Định dạng email không hợp lệ!' }
          ]}
        >
          <Input
            prefix={<MailOutlined />} 
            placeholder="Nhập địa chỉ email của bạn" 
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="🔒 Mật khẩu"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Nhập mật khẩu của bạn" 
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item className="mb-6">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isLoading} 
            block 
            className={styles.primaryButton}
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng nhập...' : '🚀 Đăng Nhập'}
          </Button>
        </Form.Item>
      </Form>      <div className={styles.authFooter}>
        <Text className={styles.footerText}>Chưa có tài khoản? </Text>
        <Button 
          type="link" 
          onClick={() => navigate('/register')} 
          className={styles.linkButton}
        >
          Đăng ký ngay
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;