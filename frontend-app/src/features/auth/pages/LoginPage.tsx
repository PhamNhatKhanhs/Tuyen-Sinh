import React, { useEffect } from 'react'; // Bỏ useState nếu không dùng error cục bộ
import { Form, Input, Button, Typography, Alert, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loginStart, loginSuccess, loginFailure, selectAuthLoading, selectAuthError, User as AuthUserType } from '../store/authSlice'; // Đổi tên User để tránh xung đột
import authService from '../services/authService'; 

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);


  const [form] = Form.useForm();
  const from = location.state?.from?.pathname || "/"; 

  // Chuyển hướng nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      const user = store.getState().auth.user as AuthUserType | null; // Lấy user từ store
      if (user?.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
         navigate(from === '/login' || from === '/register' ? '/candidate/dashboard' : from, { replace: true });
      }
    }
  }, [isAuthenticated, navigate, from]);


  const onFinish = async (values: any) => {
    dispatch(loginStart());
    try {
      const response = await authService.login(values.email, values.password);
      // Backend trả về { success: true, token, user }
      if (response.success && response.token && response.user) {
        dispatch(loginSuccess({ user: response.user, token: response.token }));
        // Việc chuyển hướng sẽ được xử lý bởi useEffect ở trên sau khi isAuthenticated thay đổi
      } else {
        // Trường hợp response.success là false hoặc thiếu dữ liệu
        dispatch(loginFailure(response.message || "Đăng nhập thất bại. Dữ liệu trả về không hợp lệ."));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <>
      <Title level={3} className="text-center mb-6">Đăng Nhập Tài Khoản</Title>
      {authError && <Alert message={authError} type="error" showIcon className="mb-4" />}
      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        layout="vertical"
        requiredMark="optional"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block size="large" className="bg-indigo-600 hover:bg-indigo-700">
            {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
          </Button>
        </Form.Item>
      </Form>
      <div className="text-center">
        <Typography.Text>Chưa có tài khoản? </Typography.Text>
        <Button type="link" onClick={() => navigate('/register')} className="p-0 text-indigo-600 hover:text-indigo-500">
          Đăng ký ngay
        </Button>
      </div>
    </>
  );
};
export default LoginPage;