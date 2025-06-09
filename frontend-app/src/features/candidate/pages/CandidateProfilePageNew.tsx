import React, { useState, useEffect } from 'react';
import { Card, Typography, Descriptions, Avatar, Button, Spin, message, Tabs, Form, Input, DatePicker, Select, Row, Col, Badge, Progress, Space, Divider, Tooltip } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined, MailOutlined, PhoneOutlined, IdcardOutlined, CalendarOutlined, HomeOutlined, SafetyOutlined, CheckCircleOutlined, CrownOutlined, StarOutlined, CameraOutlined, FileTextOutlined, TrophyOutlined, FireOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { selectUser, loginSuccess } from '../../../features/auth/store/authSlice';
import profileService from '../services/profileService';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;

const CandidateProfilePage: React.FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
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
      // Format date properly for API
      const profileData = {
        ...values,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : undefined,
      };
      
      // Remove email from profile data as it shouldn't be updated via profile
      delete profileData.email;
      
      // Call API to update profile
      const response = await profileService.updateProfile(profileData);
      
      if (response.success) {
        message.success('Cập nhật thông tin thành công!');
        
        // Update user data in Redux store
        if (user) {
          const updatedUser = {
            ...user,
            ...profileData,
            dob: profileData.dob,
          };
          dispatch(loginSuccess({ user: updatedUser, token: localStorage.getItem('token') || '' }));
        }
        
        setEditMode(false);
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi cập nhật thông tin.');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật thông tin.');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!user) return 0;
    const fields = ['fullName', 'email', 'phoneNumber', 'dob', 'idNumber', 'address', 'gender'];
    const completed = fields.filter(field => user[field as keyof typeof user]).length;
    return Math.round((completed / fields.length) * 100);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full -translate-x-36 -translate-y-36"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-48 translate-y-48"></div>
        </div>
        
        <div className="relative container mx-auto py-16 px-4">
          <div className="text-center text-white">
            <div className="relative inline-block mb-6">
              <Avatar 
                size={150} 
                icon={<UserOutlined />} 
                src={user.avatarUrl} 
                className="border-4 border-white shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                <CheckCircleOutlined className="text-white text-xl" />
              </div>
              {!editMode && (
                <Tooltip title="Chỉnh sửa ảnh đại diện">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<CameraOutlined />}
                    className="absolute top-2 right-2 bg-white/20 border-white/30 backdrop-blur-sm hover:bg-white/30"
                    size="large"
                  />
                </Tooltip>
              )}
            </div>
            
            <Title level={1} className="text-white mb-2 text-4xl font-bold">
              {user.fullName || 'Chưa cập nhật tên'}
            </Title>
            
            <div className="flex items-center justify-center space-x-6 mb-6">
              <Space className="text-white/90 text-lg">
                <CrownOutlined className="text-yellow-300" />
                <span>Thí sinh</span>
              </Space>
              <Divider type="vertical" className="border-white/40 h-6" />
              <Space className="text-white/90 text-lg">
                <CheckCircleOutlined className="text-green-300" />
                <span>Đang hoạt động</span>
              </Space>
              <Divider type="vertical" className="border-white/40 h-6" />
              <Space className="text-white/90 text-lg">
                <CalendarOutlined />
                <span>Tham gia {dayjs(user.createdAt).format('MM/YYYY')}</span>
              </Space>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/90 font-medium">Độ hoàn thiện hồ sơ</span>
                <span className="text-white font-bold text-xl">{profileCompletion}%</span>
              </div>
              <Progress 
                percent={profileCompletion} 
                strokeColor={{
                  '0%': '#fbbf24',
                  '50%': '#3b82f6',
                  '100%': '#10b981',
                }}
                trailColor="rgba(255,255,255,0.3)"
                strokeWidth={8}
                className="mb-2"
              />
              <p className="text-white/80 text-sm">
                {profileCompletion < 100 ? 'Hoàn thiện thông tin để tăng cơ hội được chấp nhận!' : 'Hồ sơ của bạn đã hoàn thiện!'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4 max-w-7xl -mt-16 relative z-10">
        <Card 
          className="shadow-2xl rounded-3xl overflow-hidden border-0 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
        >
          <div className="flex justify-between items-center mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 -m-6 mb-6">
            <div>
              <Title level={2} className="mb-2 text-gray-800">
                <FileTextOutlined className="mr-3 text-blue-500" />
                Thông Tin Cá Nhân
              </Title>
              <p className="text-gray-600 text-lg">Quản lý và cập nhật thông tin cá nhân của bạn</p>
            </div>
            
            {!editMode ? (
              <Button 
                type="primary" 
                size="large"
                icon={<EditOutlined />} 
                onClick={() => setEditMode(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 rounded-xl shadow-lg hover:shadow-xl transition-all h-12 px-8"
              >
                Chỉnh sửa thông tin
              </Button>
            ) : (
              <Space>
                <Button 
                  size="large"
                  icon={<CloseOutlined />} 
                  onClick={() => {
                    setEditMode(false);
                    form.resetFields();
                  }}
                  className="rounded-xl h-12 px-6"
                >
                  Hủy bỏ
                </Button>
              </Space>
            )}
          </div>

          <Tabs 
            defaultActiveKey="basic" 
            size="large"
            className="profile-tabs"
            items={[
              {
                key: 'basic',
                label: (
                  <span className="flex items-center text-lg">
                    <UserOutlined className="mr-2" />
                    Thông tin cơ bản
                  </span>
                ),
                children: (
                  <div className="p-6">
                    {!editMode ? (
                      // View Mode - Beautiful display
                      <Row gutter={[32, 32]}>
                        <Col xs={24} lg={10}>
                          {/* Quick Info Cards */}
                          <div className="space-y-4">
                            <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100">
                              <div className="flex items-center">
                                <div className="bg-blue-500 rounded-full p-3 mr-4">
                                  <MailOutlined className="text-white text-xl" />
                                </div>
                                <div>
                                  <p className="text-gray-500 text-sm mb-1">Email</p>
                                  <p className="font-semibold text-gray-800">{user.email}</p>
                                </div>
                              </div>
                            </Card>

                            <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-green-50 to-green-100">
                              <div className="flex items-center">
                                <div className="bg-green-500 rounded-full p-3 mr-4">
                                  <PhoneOutlined className="text-white text-xl" />
                                </div>
                                <div>
                                  <p className="text-gray-500 text-sm mb-1">Số điện thoại</p>
                                  <p className="font-semibold text-gray-800">{user.phoneNumber || 'Chưa cập nhật'}</p>
                                </div>
                              </div>
                            </Card>

                            <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100">
                              <div className="flex items-center">
                                <div className="bg-purple-500 rounded-full p-3 mr-4">
                                  <CalendarOutlined className="text-white text-xl" />
                                </div>
                                <div>
                                  <p className="text-gray-500 text-sm mb-1">Ngày sinh</p>
                                  <p className="font-semibold text-gray-800">
                                    {user.dob ? dayjs(user.dob).format('DD/MM/YYYY') : 'Chưa cập nhật'}
                                  </p>
                                </div>
                              </div>
                            </Card>

                            <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100">
                              <div className="flex items-center">
                                <div className="bg-orange-500 rounded-full p-3 mr-4">
                                  <TrophyOutlined className="text-white text-xl" />
                                </div>
                                <div>
                                  <p className="text-gray-500 text-sm mb-1">Thành tích</p>
                                  <p className="font-semibold text-gray-800">Thí sinh xuất sắc</p>
                                </div>
                              </div>
                            </Card>
                          </div>
                        </Col>
                        
                        <Col xs={24} lg={14}>
                          <div className="space-y-6">
                            <Card className="border-0 shadow-lg rounded-2xl">
                              <Title level={4} className="mb-6 text-gray-800 flex items-center">
                                <FileTextOutlined className="mr-3 text-blue-500" />
                                Thông tin chi tiết
                              </Title>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div className="flex items-start">
                                    <div className="bg-blue-100 rounded-lg p-2 mr-3 mt-1">
                                      <UserOutlined className="text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-sm">Họ và tên</p>
                                      <p className="font-semibold text-gray-800 text-lg">{user.fullName || 'Chưa cập nhật'}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-start">
                                    <div className="bg-green-100 rounded-lg p-2 mr-3 mt-1">
                                      <PhoneOutlined className="text-green-600" />
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-sm">Số điện thoại</p>
                                      <p className="font-semibold text-gray-800">{user.phoneNumber || 'Chưa cập nhật'}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-start">
                                    <div className="bg-purple-100 rounded-lg p-2 mr-3 mt-1">
                                      <IdcardOutlined className="text-purple-600" />
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-sm">CCCD/CMND</p>
                                      <p className="font-semibold text-gray-800">{user.idNumber || 'Chưa cập nhật'}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <div className="flex items-start">
                                    <div className="bg-orange-100 rounded-lg p-2 mr-3 mt-1">
                                      <CalendarOutlined className="text-orange-600" />
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-sm">Ngày sinh</p>
                                      <p className="font-semibold text-gray-800">
                                        {user.dob ? dayjs(user.dob).format('DD/MM/YYYY') : 'Chưa cập nhật'}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-start">
                                    <div className="bg-pink-100 rounded-lg p-2 mr-3 mt-1">
                                      <UserOutlined className="text-pink-600" />
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-sm">Giới tính</p>
                                      <p className="font-semibold text-gray-800">
                                        {user.gender === 'male' ? '👨 Nam' : user.gender === 'female' ? '👩 Nữ' : 'Chưa cập nhật'}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-start">
                                    <div className="bg-indigo-100 rounded-lg p-2 mr-3 mt-1">
                                      <CheckCircleOutlined className="text-indigo-600" />
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-sm">Trạng thái</p>
                                      <Badge status="success" text="Đang hoạt động" className="font-semibold" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <Divider />
                              
                              <div className="flex items-start">
                                <div className="bg-red-100 rounded-lg p-2 mr-3 mt-1">
                                  <HomeOutlined className="text-red-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-gray-500 text-sm">Địa chỉ</p>
                                  <p className="font-semibold text-gray-800">{user.address || 'Chưa cập nhật'}</p>
                                </div>
                              </div>
                            </Card>
                            
                            {/* Statistics Cards */}
                            <Row gutter={16}>
                              <Col span={12}>
                                <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-cyan-50 to-cyan-100 text-center">
                                  <div className="bg-cyan-500 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                                    <FireOutlined className="text-white text-2xl" />
                                  </div>
                                  <Title level={4} className="mb-1">120</Title>
                                  <p className="text-gray-600">Ngày hoạt động</p>
                                </Card>
                              </Col>
                              <Col span={12}>
                                <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 text-center">
                                  <div className="bg-yellow-500 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                                    <StarOutlined className="text-white text-2xl" />
                                  </div>
                                  <Title level={4} className="mb-1">4.8</Title>
                                  <p className="text-gray-600">Đánh giá</p>
                                </Card>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    ) : (
                      // Edit Mode - Beautiful form
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
                        <div className="text-center mb-8">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <EditOutlined className="text-white text-3xl" />
                          </div>
                          <Title level={3} className="text-gray-800 mb-2">
                            Chỉnh sửa thông tin cá nhân
                          </Title>
                          <p className="text-gray-600">Cập nhật thông tin của bạn để có trải nghiệm tốt nhất</p>
                        </div>

                        <Form
                          form={form}
                          layout="vertical"
                          onFinish={handleSaveProfile}
                          disabled={loading}
                          className="max-w-4xl mx-auto"
                        >
                          <Row gutter={[24, 20]}>
                            <Col xs={24} md={12}>
                              <Form.Item
                                name="fullName"
                                label={<span className="font-semibold text-gray-700 text-base">👤 Họ và tên</span>}
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                              >
                                <Input 
                                  prefix={<UserOutlined className="text-blue-500" />} 
                                  placeholder="Nhập họ và tên" 
                                  size="large"
                                  className="rounded-xl shadow-sm border-2 hover:border-blue-400 focus:border-blue-500"
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                              <Form.Item
                                name="email"
                                label={<span className="font-semibold text-gray-700 text-base">📧 Email</span>}
                                rules={[
                                  { required: true, message: 'Vui lòng nhập email' },
                                  { type: 'email', message: 'Email không hợp lệ' }
                                ]}
                              >
                                <Input 
                                  prefix={<MailOutlined className="text-blue-500" />} 
                                  placeholder="Nhập email" 
                                  disabled 
                                  size="large"
                                  className="rounded-xl shadow-sm"
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          
                          <Row gutter={[24, 20]}>
                            <Col xs={24} md={12}>
                              <Form.Item
                                name="phoneNumber"
                                label={<span className="font-semibold text-gray-700 text-base">📱 Số điện thoại</span>}
                                rules={[
                                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                                ]}
                              >
                                <Input 
                                  prefix={<PhoneOutlined className="text-blue-500" />} 
                                  placeholder="Nhập số điện thoại" 
                                  size="large"
                                  className="rounded-xl shadow-sm border-2 hover:border-blue-400 focus:border-blue-500"
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                              <Form.Item
                                name="dob"
                                label={<span className="font-semibold text-gray-700 text-base">🎂 Ngày sinh</span>}
                                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                              >
                                <DatePicker 
                                  className="w-full rounded-xl shadow-sm border-2 hover:border-blue-400 focus:border-blue-500" 
                                  placeholder="Chọn ngày sinh"
                                  format="DD/MM/YYYY" 
                                  size="large"
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          
                          <Row gutter={[24, 20]}>
                            <Col xs={24} md={12}>
                              <Form.Item
                                name="idNumber"
                                label={<span className="font-semibold text-gray-700 text-base">🆔 CCCD/CMND</span>}
                                rules={[
                                  { required: true, message: 'Vui lòng nhập CCCD/CMND' },
                                  { pattern: /^[0-9]{9,12}$/, message: 'CCCD/CMND không hợp lệ' }
                                ]}
                              >
                                <Input 
                                  prefix={<IdcardOutlined className="text-blue-500" />} 
                                  placeholder="Nhập CCCD/CMND" 
                                  size="large"
                                  className="rounded-xl shadow-sm border-2 hover:border-blue-400 focus:border-blue-500"
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                              <Form.Item
                                name="gender"
                                label={<span className="font-semibold text-gray-700 text-base">⚧ Giới tính</span>}
                                rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                              >
                                <Select 
                                  placeholder="Chọn giới tính" 
                                  size="large"
                                  className="rounded-xl"
                                >
                                  <Select.Option value="male">👨 Nam</Select.Option>
                                  <Select.Option value="female">👩 Nữ</Select.Option>
                                  <Select.Option value="other">🤷 Khác</Select.Option>
                                </Select>
                              </Form.Item>
                            </Col>
                          </Row>
                          
                          <Form.Item
                            name="address"
                            label={<span className="font-semibold text-gray-700 text-base">🏠 Địa chỉ</span>}
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                          >
                            <Input.TextArea 
                              placeholder="Nhập địa chỉ chi tiết" 
                              rows={4} 
                              className="rounded-xl shadow-sm border-2 hover:border-blue-400 focus:border-blue-500"
                            />
                          </Form.Item>
                          
                          <Form.Item className="text-center mt-8">
                            <Button 
                              type="primary" 
                              htmlType="submit" 
                              icon={<SaveOutlined />} 
                              loading={loading}
                              size="large"
                              className="bg-gradient-to-r from-green-500 to-blue-600 border-0 rounded-xl shadow-lg hover:shadow-2xl transition-all px-12 py-3 h-14 text-lg font-semibold"
                            >
                              💾 Lưu thông tin
                            </Button>
                          </Form.Item>
                        </Form>
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: 'security',
                label: (
                  <span className="flex items-center text-lg">
                    <SafetyOutlined className="mr-2" />
                    Bảo mật
                  </span>
                ),
                children: (
                  <div className="p-6">
                    <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-red-50 to-pink-50">
                      <div className="text-center mb-6">
                        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                          <SafetyOutlined className="text-white text-3xl" />
                        </div>
                        <Title level={3} className="text-gray-800 mb-2">Bảo mật tài khoản</Title>
                        <p className="text-gray-600">Thay đổi mật khẩu để bảo vệ tài khoản của bạn</p>
                      </div>
                      
                      <Form layout="vertical" className="max-w-md mx-auto">
                        <Form.Item
                          name="currentPassword"
                          label={<span className="font-semibold text-gray-700">🔒 Mật khẩu hiện tại</span>}
                          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                        >
                          <Input.Password 
                            placeholder="Nhập mật khẩu hiện tại" 
                            size="large"
                            className="rounded-xl shadow-sm border-2 hover:border-red-400 focus:border-red-500"
                          />
                        </Form.Item>
                        
                        <Form.Item
                          name="newPassword"
                          label={<span className="font-semibold text-gray-700">🔑 Mật khẩu mới</span>}
                          rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' }
                          ]}
                        >
                          <Input.Password 
                            placeholder="Nhập mật khẩu mới" 
                            size="large"
                            className="rounded-xl shadow-sm border-2 hover:border-red-400 focus:border-red-500"
                          />
                        </Form.Item>
                        
                        <Form.Item
                          name="confirmPassword"
                          label={<span className="font-semibold text-gray-700">✅ Xác nhận mật khẩu mới</span>}
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
                          <Input.Password 
                            placeholder="Xác nhận mật khẩu mới" 
                            size="large"
                            className="rounded-xl shadow-sm border-2 hover:border-red-400 focus:border-red-500"
                          />
                        </Form.Item>
                        
                        <Form.Item className="text-center">
                          <Button 
                            type="primary" 
                            size="large"
                            className="bg-gradient-to-r from-red-500 to-pink-600 border-0 rounded-xl shadow-lg hover:shadow-xl transition-all px-8 py-3 h-12"
                          >
                            🔄 Đổi mật khẩu
                          </Button>
                        </Form.Item>
                      </Form>
                    </Card>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

export default CandidateProfilePage;
