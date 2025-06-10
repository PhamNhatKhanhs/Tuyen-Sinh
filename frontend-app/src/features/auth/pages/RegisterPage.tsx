import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert, Select, Spin } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks';
import { loginSuccess } from '../store/authSlice'; 
import authService, { RegisterData } from '../services/authService';
import styles from './AuthPages.module.css';

const { Text } = Typography;
const { Option } = Select;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      if (values.password !== values.confirmPassword) {
        setError("Mật khẩu xác nhận không khớp!");
        return;
      }      const registerData: RegisterData = {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        role: 'candidate', // Mặc định là candidate
      };

      const response = await authService.register(registerData);
      
      if (response.success && response.token && response.user) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('authUser', JSON.stringify(response.user));
        
        dispatch(loginSuccess({ user: response.user, token: response.token }));
        
        setSuccessMessage("Đăng ký thành công! Bạn sẽ được chuyển hướng...");        setTimeout(() => {
          // Luôn chuyển về candidate dashboard vì chỉ có role candidate
          navigate('/candidate/dashboard', { replace: true });
        }, 2000);
      } else {
        setError(response.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Đang tạo tài khoản..." />
      </div>
    );
  }

  return (
    <div className={styles.authForm}>
      {error && (
        <Alert 
          message="Đăng ký thất bại" 
          description={error}
          type="error" 
          showIcon 
          className="mb-6" 
          closable
        />
      )}
      {successMessage && (
        <Alert 
          message="Đăng ký thành công!" 
          description={successMessage}
          type="success" 
          showIcon 
          className="mb-6" 
        />
      )}
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        layout="vertical"
        requiredMark="optional"
        size="large"
      >
        <Form.Item
          name="fullName"
          label="👤 Họ và Tên đầy đủ"
          rules={[
            { required: true, message: 'Vui lòng nhập họ tên đầy đủ!' },
            { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
          ]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Nhập họ và tên đầy đủ của bạn" 
            autoComplete="name"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="📧 Địa chỉ Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
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
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
            { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số!' }
          ]}
          hasFeedback
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Tạo mật khẩu mạnh (tối thiểu 6 ký tự)" 
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="🔐 Xác nhận mật khẩu"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Nhập lại mật khẩu để xác nhận" 
            autoComplete="new-password"
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
            {isLoading ? 'Đang tạo tài khoản...' : '✨ Tạo Tài Khoản'}
          </Button>
        </Form.Item>
      </Form>      <div className={styles.authFooter}>
        <Text className={styles.footerText}>Đã có tài khoản? </Text>
        <Button 
          type="link" 
          onClick={() => navigate('/login')} 
          className={styles.linkButton}
        >
          Đăng nhập ngay
        </Button>
      </div>
    </div>
  );
};

export default RegisterPage;