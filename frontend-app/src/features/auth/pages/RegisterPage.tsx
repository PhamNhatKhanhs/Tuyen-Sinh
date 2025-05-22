import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert, Select, Spin } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks'; // Bỏ useAppSelector nếu không dùng
import { loginSuccess } from '../store/authSlice'; 
import authService, { RegisterData } from '../services/authService'; 

const { Title } = Typography;
const { Option } = Select;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (values.password !== values.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      setIsLoading(false);
      return;
    }

    const registerData: RegisterData = {
        email: values.email,
        password: values.password,
        fullName: values.fullName, // Thêm fullName nếu có trong form
        role: values.role,
    };

    try {
      const response = await authService.register(registerData);
      
      if (response.success && response.token && response.user) {
        // Giả sử đăng ký thành công và tự động đăng nhập
        dispatch(loginSuccess({ user: response.user, token: response.token }));
        
        setSuccessMessage("Đăng ký thành công! Bạn sẽ được chuyển hướng...");
        setTimeout(() => {
          if (response.user.role === 'admin') {
              navigate('/admin/dashboard', { replace: true });
          } else {
              navigate('/candidate/dashboard', { replace: true });
          }
        }, 2000);
      } else {
         setError(response.message || "Đăng ký thất bại. Dữ liệu trả về không hợp lệ.");
      }

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Đăng ký thất bại. Vui lòng thử lại.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Title level={3} className="text-center mb-6">Tạo Tài Khoản Mới</Title>
      {error && <Alert message={error} type="error" showIcon className="mb-4" />}
      {successMessage && <Alert message={successMessage} type="success" showIcon className="mb-4" />}
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        layout="vertical"
        requiredMark="optional"
      >
        <Form.Item
          name="fullName"
          label="Họ và Tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Họ và Tên" size="large"/>
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" size="large"/>
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
          ]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large"/>
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu"
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
          <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" size="large"/>
        </Form.Item>

        <Form.Item
            name="role"
            label="Bạn là?"
            initialValue="candidate"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
        >
            <Select placeholder="Chọn vai trò của bạn" size="large">
                <Option value="candidate">Thí sinh</Option>
                <Option value="admin">Quản trị viên (Yêu cầu quyền)</Option>
            </Select>
        </Form.Item>
        {form.getFieldValue('role') === 'admin' && (
            <Alert message="Lưu ý: Vai trò Quản trị viên cần được tạo bởi một admin khác hoặc có mã mời đặc biệt (chức năng nâng cao)." type="info" showIcon className="mb-4 text-sm"/>
        )}


        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block size="large" className="bg-indigo-600 hover:bg-indigo-700">
            {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
          </Button>
        </Form.Item>
      </Form>
      <div className="text-center">
        <Typography.Text>Đã có tài khoản? </Typography.Text>
        <Button type="link" onClick={() => navigate('/login')} className="p-0 text-indigo-600 hover:text-indigo-500">
          Đăng nhập ngay
        </Button>
      </div>
    </>
  );
};
export default RegisterPage;