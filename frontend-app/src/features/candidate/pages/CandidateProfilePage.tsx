import React, { useState, useEffect } from 'react';
import { Card, Typography, Descriptions, Avatar, Button, Spin, message, Tabs, Form, Input, DatePicker, Select, Row, Col, Badge, Progress } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined, MailOutlined, PhoneOutlined, IdcardOutlined, HomeOutlined, CameraOutlined, StarOutlined, CheckCircleOutlined, CalendarOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../features/auth/store/authSlice';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;

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
      console.log('Updating profile with values:', values);
      
      message.success('Cập nhật thông tin thành công!');
      setEditMode(false);
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật thông tin.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!user) return 0;
    const fields = [user.fullName, user.phoneNumber, user.dob, user.idNumber, user.address, user.gender];
    const completedFields = fields.filter(field => field && field !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  const profileCompletion = calculateProfileCompletion();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-blue-300/20 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-purple-300/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-pink-300/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-teal-300/20 rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-yellow-300/20 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-10 h-10 bg-green-300/20 rounded-full animate-float" style={{animationDelay: '2.5s'}}></div>
      </div>
      
      <div className="container mx-auto py-8 px-4 max-w-6xl relative z-10">{/* Header Section with Enhanced Gradient */}
        <div className="text-center mb-12 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-gradient-to-r from-pink-200/30 via-purple-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute w-64 h-64 bg-gradient-to-r from-yellow-200/20 via-orange-200/20 to-red-200/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute w-80 h-80 bg-gradient-to-r from-teal-200/25 via-cyan-200/25 to-blue-200/25 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
          
          
        </div>{/* Profile Header Card */}
       
     

        {/* Main Content Card */}
        <Card 
          className="shadow-2xl rounded-3xl overflow-hidden border-0 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
          extra={
            <div className="flex space-x-3">
              {!editMode ? (
                <Button 
                  type="primary" 
                  size="large"
                  icon={<EditOutlined />} 
                  onClick={() => setEditMode(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                >
                  Chỉnh sửa hồ sơ
                </Button>
              ) : (
                <>
                  <Button 
                    size="large"
                    icon={<CloseOutlined />} 
                    onClick={() => {
                      setEditMode(false);
                      form.resetFields();
                    }}
                    className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Hủy bỏ
                  </Button>
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<SaveOutlined />} 
                    onClick={() => form.submit()}
                    loading={loading}
                    className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                  >
                    Lưu thay đổi
                  </Button>
                </>
              )}
            </div>
          }
        >          <Tabs 
            defaultActiveKey="basic" 
            size="large"
            className="profile-tabs"
            items={[
              {
                key: 'basic',
                label: (
                  <span className="flex items-center font-medium">
                    <UserOutlined className="mr-2" />
                    Thông tin cơ bản
                  </span>
                ),
                children: (
                  <div className="p-6">
                {!editMode ? (
                  // View Mode - Enhanced Display
                  <div className="space-y-8">                    {/* Profile completion banner */}
                    {profileCompletion < 100 && (
                      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              Hoàn thiện hồ sơ của bạn
                            </h3>
                            <p className="text-gray-600">
                              Hồ sơ đã hoàn thành {profileCompletion}%. Hãy cập nhật đầy đủ thông tin để tăng cơ hội được chấp nhận!
                            </p>
                          </div>
                          <Progress 
                            percent={profileCompletion} 
                            strokeColor={{
                              '0%': '#f97316',
                              '100%': '#dc2626',
                            }}
                            className="w-24"
                          />
                        </div>
                      </div>
                    )}

                    {/* Personal Information */}                    <Descriptions 
                      bordered 
                      column={1}
                      size="middle"
                      className="modern-descriptions rounded-2xl overflow-hidden shadow-lg"
                      labelStyle={{
                        backgroundColor: '#f8fafc',
                        fontWeight: 600,
                        color: '#374151',
                        padding: '20px',
                        width: '200px',
                        borderRight: '3px solid #e5e7eb'
                      }}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        padding: '20px',
                        color: '#1f2937'
                      }}
                    >
                      <Descriptions.Item 
                        label={
                          <span className="flex items-center">
                            <UserOutlined className="mr-2 text-blue-500" />
                            Họ và tên
                          </span>
                        }
                      >
                        <span className="font-semibold text-lg">
                          {user.fullName || (
                            <span className="text-gray-400 italic">Chưa cập nhật</span>
                          )}
                        </span>
                      </Descriptions.Item>
                      
                      <Descriptions.Item 
                        label={
                          <span className="flex items-center">
                            <MailOutlined className="mr-2 text-red-500" />
                            Email
                          </span>
                        }
                      >
                        <span className="text-blue-600 font-medium">{user.email}</span>
                      </Descriptions.Item>
                      
                      <Descriptions.Item 
                        label={
                          <span className="flex items-center">
                            <PhoneOutlined className="mr-2 text-green-500" />
                            Số điện thoại
                          </span>
                        }
                      >
                        <span className="font-semibold">
                          {user.phoneNumber || (
                            <span className="text-gray-400 italic">Chưa cập nhật</span>
                          )}
                        </span>
                      </Descriptions.Item>
                      
                      <Descriptions.Item 
                        label={
                          <span className="flex items-center">
                            <CalendarOutlined className="mr-2 text-purple-500" />
                            Ngày sinh
                          </span>
                        }
                      >
                        <span className="font-semibold">
                          {user.dob ? dayjs(user.dob).format('DD/MM/YYYY') : (
                            <span className="text-gray-400 italic">Chưa cập nhật</span>
                          )}
                        </span>
                      </Descriptions.Item>
                      
                      <Descriptions.Item 
                        label={
                          <span className="flex items-center">
                            <IdcardOutlined className="mr-2 text-yellow-600" />
                            CCCD/CMND
                          </span>
                        }
                      >
                        <span className="font-semibold">
                          {user.idNumber || (
                            <span className="text-gray-400 italic">Chưa cập nhật</span>
                          )}
                        </span>
                      </Descriptions.Item>
                      
                      <Descriptions.Item 
                        label={
                          <span className="flex items-center">
                            <UserOutlined className="mr-2 text-pink-500" />
                            Giới tính
                          </span>
                        }
                      >
                        <span className="font-semibold">
                          {user.gender === 'male' ? 'Nam' : 
                           user.gender === 'female' ? 'Nữ' : 
                           user.gender === 'other' ? 'Khác' : (
                            <span className="text-gray-400 italic">Chưa cập nhật</span>
                          )}
                        </span>
                      </Descriptions.Item>
                      
                      <Descriptions.Item 
                        label={
                          <span className="flex items-center">
                            <HomeOutlined className="mr-2 text-teal-500" />
                            Địa chỉ
                          </span>
                        }
                      >
                        <span className="font-semibold">
                          {user.address || (
                            <span className="text-gray-400 italic">Chưa cập nhật</span>
                          )}
                        </span>
                      </Descriptions.Item>
                      
                      <Descriptions.Item 
                        label={
                          <span className="flex items-center">
                            <CheckCircleOutlined className="mr-2 text-gray-500" />
                            Ngày tham gia
                          </span>
                        }
                      >
                        <span className="font-medium text-gray-600">
                          {dayjs(user.createdAt).format('DD/MM/YYYY HH:mm')}
                        </span>
                      </Descriptions.Item>
                      
                      <Descriptions.Item 
                        label={
                          <span className="flex items-center">
                            <StarOutlined className="mr-2 text-orange-500" />
                            Trạng thái
                          </span>
                        }
                      >
                        <Badge 
                          status="success" 
                          text={<span className="font-semibold text-green-600">Đang hoạt động</span>} 
                        />
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                ) : (
                  // Edit Mode - Enhanced Form
                  <div className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl shadow-inner">
                    <div className="text-center mb-8">
                      <Title level={3} className="text-gray-700 font-bold mb-2">
                        ✏️ Cập nhật thông tin cá nhân
                      </Title>
                      <p className="text-gray-600">Vui lòng điền đầy đủ thông tin để hoàn thiện hồ sơ</p>
                    </div>
                    
                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={handleSaveProfile}
                      disabled={loading}
                      className="max-w-4xl mx-auto"
                    >
                      <Row gutter={[32, 24]}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="fullName"
                            label={
                              <span className="font-semibold text-gray-700 flex items-center text-base">
                                <UserOutlined className="mr-2 text-blue-500" />
                                Họ và tên
                              </span>
                            }
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                          >
                            <Input 
                              prefix={<UserOutlined className="text-gray-400" />}
                              placeholder="Ví dụ: Nguyễn Văn A" 
                              size="large"
                              className="rounded-xl border-2 hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="email"
                            label={
                              <span className="font-semibold text-gray-700 flex items-center text-base">
                                <MailOutlined className="mr-2 text-red-500" />
                                Email
                              </span>
                            }
                            rules={[
                              { required: true, message: 'Vui lòng nhập email' },
                              { type: 'email', message: 'Email không hợp lệ' }
                            ]}
                          >
                            <Input 
                              prefix={<MailOutlined className="text-gray-400" />}
                              placeholder="your.email@example.com" 
                              disabled 
                              size="large"
                              className="rounded-xl"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      
                      <Row gutter={[32, 24]}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="phoneNumber"
                            label={
                              <span className="font-semibold text-gray-700 flex items-center text-base">
                                <PhoneOutlined className="mr-2 text-green-500" />
                                Số điện thoại
                              </span>
                            }
                            rules={[
                              { required: true, message: 'Vui lòng nhập số điện thoại' },
                              { pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/, message: 'Số điện thoại không hợp lệ' }
                            ]}
                          >
                            <Input 
                              prefix={<PhoneOutlined className="text-gray-400" />}
                              placeholder="Ví dụ: 0912345678" 
                              size="large"
                              className="rounded-xl border-2 hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="dob"
                            label={
                              <span className="font-semibold text-gray-700 flex items-center text-base">
                                <CalendarOutlined className="mr-2 text-purple-500" />
                                Ngày sinh
                              </span>
                            }
                            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                          >
                            <DatePicker 
                              className="w-full rounded-xl border-2 hover:border-blue-400 focus:border-blue-500 transition-all duration-300" 
                              placeholder="Chọn ngày sinh"
                              format="DD/MM/YYYY" 
                              size="large"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      
                      <Row gutter={[32, 24]}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="idNumber"
                            label={
                              <span className="font-semibold text-gray-700 flex items-center text-base">
                                <IdcardOutlined className="mr-2 text-yellow-600" />
                                CCCD/CMND
                              </span>
                            }
                            rules={[
                              { required: true, message: 'Vui lòng nhập CCCD/CMND' },
                              { pattern: /^[0-9]{9,12}$/, message: 'CCCD/CMND không hợp lệ' }
                            ]}
                          >
                            <Input 
                              prefix={<IdcardOutlined className="text-gray-400" />}
                              placeholder="Nhập số CCCD hoặc CMND" 
                              size="large"
                              className="rounded-xl border-2 hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="gender"
                            label={
                              <span className="font-semibold text-gray-700 flex items-center text-base">
                                <UserOutlined className="mr-2 text-pink-500" />
                                Giới tính
                              </span>
                            }
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                          >
                            <Select 
                              placeholder="Chọn giới tính" 
                              size="large"
                              className="rounded-xl"
                            >
                              <Select.Option value="male">Nam</Select.Option>
                              <Select.Option value="female">Nữ</Select.Option>
                              <Select.Option value="other">Khác</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      
                      <Form.Item
                        name="address"
                        label={
                          <span className="font-semibold text-gray-700 flex items-center text-base">
                            <HomeOutlined className="mr-2 text-teal-500" />
                            Địa chỉ
                          </span>
                        }
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                      >
                        <Input.TextArea 
                          placeholder="Nhập địa chỉ chi tiết (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)" 
                          rows={4} 
                          className="rounded-xl border-2 hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                        />
                      </Form.Item>
                    </Form>
                  </div>
                )}              </div>
                )
              },
              {
                key: 'security',
                label: (
                  <span className="flex items-center font-medium">
                    <SafetyCertificateOutlined className="mr-2" />
                    Bảo mật
                  </span>
                ),
                children: (
              <div className="p-6">
                <div className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl shadow-inner max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <Title level={3} className="text-gray-700 font-bold mb-2">
                      🔒 Thay đổi mật khẩu
                    </Title>
                    <p className="text-gray-600">Đảm bảo tài khoản của bạn được bảo mật</p>
                  </div>
                  
                  <Form layout="vertical">
                    <Form.Item
                      name="currentPassword"
                      label={<span className="font-semibold text-gray-700 text-base">Mật khẩu hiện tại</span>}
                      rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                    >
                      <Input.Password 
                        placeholder="Nhập mật khẩu hiện tại" 
                        size="large"
                        className="rounded-xl border-2 hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                      />
                    </Form.Item>
                    
                    <Form.Item
                      name="newPassword"
                      label={<span className="font-semibold text-gray-700 text-base">Mật khẩu mới</span>}
                      rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                        { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' }
                      ]}
                    >
                      <Input.Password 
                        placeholder="Ít nhất 8 ký tự" 
                        size="large"
                        className="rounded-xl border-2 hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                      />
                    </Form.Item>
                    
                    <Form.Item
                      name="confirmPassword"
                      label={<span className="font-semibold text-gray-700 text-base">Xác nhận mật khẩu mới</span>}
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
                        placeholder="Nhập lại mật khẩu mới" 
                        size="large"
                        className="rounded-xl border-2 hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                      />
                    </Form.Item>
                    
                    <Form.Item className="mt-8">
                      <Button 
                        type="primary" 
                        size="large"
                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium h-12"
                      >
                        Đổi mật khẩu
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>                )
              }
            ]}
          />
        </Card>
      </div>
        {/* Custom CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes shimmer {
            0% { background-position: -200px 0; }
            100% { background-position: calc(200px + 100%) 0; }
          }
          
          .animate-fade-in {
            animation: fadeIn 0.8s ease-out;
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            background-size: 200px 100%;
            animation: shimmer 2s infinite;
          }
          
          .profile-tabs .ant-tabs-tab {
            padding: 16px 24px !important;
            font-size: 16px !important;
            border-radius: 12px 12px 0 0 !important;
            transition: all 0.3s ease !important;
          }
          
          .profile-tabs .ant-tabs-tab:hover {
            background: linear-gradient(135deg, #f8fafc, #e2e8f0) !important;
            transform: translateY(-2px) !important;
          }
          
          .profile-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #2563eb !important;
            font-weight: 600 !important;
          }
          
          .profile-tabs .ant-tabs-ink-bar {
            background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899) !important;
            height: 4px !important;
            border-radius: 2px !important;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4) !important;
          }
          
          .modern-descriptions .ant-descriptions-item-label {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
            transition: all 0.3s ease !important;
          }
          
          .modern-descriptions .ant-descriptions-item-content {
            background: #ffffff !important;
            transition: all 0.3s ease !important;
          }
          
          .modern-descriptions .ant-descriptions-item:hover .ant-descriptions-item-label {
            background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%) !important;
          }
          
          .modern-descriptions .ant-descriptions-item:hover .ant-descriptions-item-content {
            background: #f8fafc !important;
          }
          
          .ant-select-selector {
            border-radius: 12px !important;
            border-width: 2px !important;
            transition: all 0.3s ease !important;
          }
          
          .ant-select-focused .ant-select-selector,
          .ant-select-selector:hover {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
          }
          
          .ant-picker {
            border-radius: 12px !important;
            border-width: 2px !important;
            transition: all 0.3s ease !important;
          }
          
          .ant-picker-focused,
          .ant-picker:hover {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
          }
          
          .ant-input {
            transition: all 0.3s ease !important;
          }
          
          .ant-input:hover,
          .ant-input:focus {
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
          }
          
          .ant-card {
            transition: all 0.3s ease !important;
          }
          
          .ant-progress-circle {
            transition: all 0.3s ease !important;
          }
          
          .ant-progress-circle:hover {
            filter: drop-shadow(0 8px 16px rgba(59, 130, 246, 0.2)) !important;
          }
        `
      }} />
    </div>
  );
};

export default CandidateProfilePage;
