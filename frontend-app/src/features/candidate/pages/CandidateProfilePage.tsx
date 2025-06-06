import React, { useState, useEffect } from 'react';
import { Card, Typography, Descriptions, Avatar, Button, Spin, message, Tabs, Form, Input, DatePicker, Select, Row, Col, Divider } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined, MailOutlined, PhoneOutlined, IdcardOutlined, HomeOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../features/auth/store/authSlice';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const CandidateProfilePage: React.FC = () => {
  const user = useAppSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dob: user.dob ? dayjs(user.dob) : null,
        idNumber: user.idNumber || '',
        address: user.address || '',
        gender: user.gender || '',
      });
    }
  }, [user, form]);

  const handleSaveProfile = async (values: any) => {
    setLoading(true);
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Thực tế sẽ gọi API cập nhật thông tin
      // await userService.updateProfile(values);
      
      message.success('Cập nhật thông tin thành công!');
      setEditMode(false);
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật thông tin.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Title level={2} className="mb-6">Thông Tin Cá Nhân</Title>
      
      <Card 
        className="shadow-md rounded-lg overflow-hidden"
        extra={
          !editMode ? (
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={() => setEditMode(true)}
            >
              Chỉnh sửa
            </Button>
          ) : (
            <Button 
              type="default" 
              icon={<CloseOutlined />} 
              onClick={() => {
                setEditMode(false);
                form.resetFields();
              }}
            >
              Hủy
            </Button>
          )
        }
      >
        <Tabs defaultActiveKey="basic">
          <TabPane tab="Thông tin cơ bản" key="basic">
            {!editMode ? (
              <div className="flex flex-col md:flex-row">
                <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-8">
                  <Avatar 
                    size={120} 
                    icon={<UserOutlined />} 
                    src={user.avatarUrl} 
                    className="mb-4 bg-blue-500"
                  />
                  <Title level={4}>{user.fullName || 'Chưa cập nhật'}</Title>
                  <Paragraph className="text-gray-500">{user.role === 'candidate' ? 'Thí sinh' : 'Quản trị viên'}</Paragraph>
                </div>
                
                <div className="flex-1">
                  <Descriptions 
                    bordered 
                    column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                    className="bg-white rounded-lg overflow-hidden"
                  >
                    <Descriptions.Item label="Họ và tên">{user.fullName || 'Chưa cập nhật'}</Descriptions.Item>
                    <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{user.phoneNumber || 'Chưa cập nhật'}</Descriptions.Item>
                    <Descriptions.Item label="Ngày sinh">{user.dob ? dayjs(user.dob).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Descriptions.Item>
                    <Descriptions.Item label="CCCD/CMND">{user.idNumber || 'Chưa cập nhật'}</Descriptions.Item>
                    <Descriptions.Item label="Giới tính">
                      {user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Chưa cập nhật'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ" span={2}>{user.address || 'Chưa cập nhật'}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tham gia">{dayjs(user.createdAt).format('DD/MM/YYYY')}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái tài khoản">
                      <span className="text-green-500 font-medium">Đang hoạt động</span>
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </div>
            ) : (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSaveProfile}
                disabled={loading}
                className="max-w-3xl mx-auto"
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="fullName"
                      label="Họ và tên"
                      rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' }
                      ]}
                    >
                      <Input prefix={<MailOutlined />} placeholder="Nhập email" disabled />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="phoneNumber"
                      label="Số điện thoại"
                      rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại' },
                        { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                      ]}
                    >
                      <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="dob"
                      label="Ngày sinh"
                      rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                    >
                      <DatePicker 
                        className="w-full" 
                        placeholder="Chọn ngày sinh"
                        format="DD/MM/YYYY" 
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="idNumber"
                      label="CCCD/CMND"
                      rules={[
                        { required: true, message: 'Vui lòng nhập CCCD/CMND' },
                        { pattern: /^[0-9]{9,12}$/, message: 'CCCD/CMND không hợp lệ' }
                      ]}
                    >
                      <Input prefix={<IdcardOutlined />} placeholder="Nhập CCCD/CMND" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="gender"
                      label="Giới tính"
                      rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                    >
                      <Select placeholder="Chọn giới tính">
                        <Select.Option value="male">Nam</Select.Option>
                        <Select.Option value="female">Nữ</Select.Option>
                        <Select.Option value="other">Khác</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                
                <Form.Item
                  name="address"
                  label="Địa chỉ"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                >
                  <Input.TextArea 
                    prefix={<HomeOutlined />} 
                    placeholder="Nhập địa chỉ" 
                    rows={3} 
                  />
                </Form.Item>
                
                <Form.Item className="text-right">
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SaveOutlined />} 
                    loading={loading}
                  >
                    Lưu thông tin
                  </Button>
                </Form.Item>
              </Form>
            )}
          </TabPane>
          
          <TabPane tab="Lịch sử hoạt động" key="activity">
            <div className="p-6 bg-gray-50 rounded-lg">
              <Paragraph className="text-center text-gray-500 italic">
                Chức năng đang được phát triển...
              </Paragraph>
            </div>
          </TabPane>
          
          <TabPane tab="Bảo mật" key="security">
            <div className="p-6 bg-gray-50 rounded-lg">
              <Title level={4} className="mb-4">Đổi mật khẩu</Title>
              <Form layout="vertical" className="max-w-md">
                <Form.Item
                  name="currentPassword"
                  label="Mật khẩu hiện tại"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                >
                  <Input.Password placeholder="Nhập mật khẩu hiện tại" />
                </Form.Item>
                
                <Form.Item
                  name="newPassword"
                  label="Mật khẩu mới"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' }
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu mới" />
                </Form.Item>
                
                <Form.Item
                  name="confirmPassword"
                  label="Xác nhận mật khẩu mới"
                  dependencies={['newPassword']}
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Xác nhận mật khẩu mới" />
                </Form.Item>
                
                <Form.Item>
                  <Button type="primary">Đổi mật khẩu</Button>
                </Form.Item>
              </Form>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default CandidateProfilePage;
