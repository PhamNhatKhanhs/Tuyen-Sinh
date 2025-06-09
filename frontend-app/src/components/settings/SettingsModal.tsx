import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Tabs, 
  Form, 
  Input, 
  Button, 
  Select, 
  Switch, 
  Row, 
  Col, 
  Card, 
  Avatar, 
  Space, 
  Typography, 
  message, 
  DatePicker
} from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LockOutlined,
  SaveOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../features/auth/store/authSlice';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Option } = Select;

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const user = useAppSelector(selectUser);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profileForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [preferencesForm] = Form.useForm();

  // Profile settings state
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dob: null as dayjs.Dayjs | null,
    idNumber: '',
    address: '',
    gender: '',
    avatarUrl: ''
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'vi',
    emailNotifications: true,
    pushNotifications: true,
    applicationNotifications: true,
    systemNotifications: false,
    autoSave: true,
    compactView: false
  });

  // Security state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginAlerts: true
  });

  useEffect(() => {
    if (user && visible) {
      const initialProfileData = {
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dob: user.dob ? dayjs(user.dob) : null,
        idNumber: user.idNumber || '',
        address: user.address || '',
        gender: user.gender || '',
        avatarUrl: user.avatarUrl || ''
      };
      
      setProfileData(initialProfileData);
      profileForm.setFieldsValue(initialProfileData);
      
      // Load preferences from localStorage or API
      const savedPreferences = localStorage.getItem('userPreferences');
      if (savedPreferences) {
        try {
          const parsed = JSON.parse(savedPreferences);
          setPreferences({ ...preferences, ...parsed });
          preferencesForm.setFieldsValue({ ...preferences, ...parsed });
        } catch (error) {
          console.error('Error parsing saved preferences:', error);
        }
      } else {
        preferencesForm.setFieldsValue(preferences);
      }

      securityForm.setFieldsValue(securitySettings);
    }
  }, [user, visible, profileForm, preferencesForm, securityForm]);

  const handleProfileSave = async (values: any) => {
    setLoading(true);
    try {
      // Format date if exists
      if (values.dob) {
        values.dob = values.dob.format('YYYY-MM-DD');
      }

      // Here you would call the actual API to update user profile
      // await userService.updateProfile(values);
      
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfileData({ ...profileData, ...values });
      message.success('Cập nhật thông tin cá nhân thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật thông tin.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSave = async (values: any) => {
    setLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(values));
      
      // Here you would also call API to save preferences
      // await userService.updatePreferences(values);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPreferences({ ...preferences, ...values });
      
      // Apply theme change immediately if needed
      if (values.theme !== preferences.theme) {
        document.documentElement.setAttribute('data-theme', values.theme);
      }
      
      message.success('Cập nhật cài đặt thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật cài đặt.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySave = async (values: any) => {
    setLoading(true);
    try {
      // Here you would call the actual API to update security settings
      // await userService.updateSecuritySettings(values);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSecuritySettings({ ...securitySettings, ...values });
      message.success('Cập nhật cài đặt bảo mật thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật cài đặt bảo mật.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    try {
      // Here you would call the actual API to change password
      // await authService.changePassword({
      //   currentPassword: values.currentPassword,
      //   newPassword: values.newPassword
      // });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      securityForm.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
      message.success('Đổi mật khẩu thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra khi đổi mật khẩu.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderProfileTab = () => (
    <div className="p-4">
      <div className="text-center mb-6">
        <Avatar
          size={100}
          src={profileData.avatarUrl}
          icon={<UserOutlined />}
          className="mb-4"
        />
        <Title level={4} className="mb-2">{profileData.fullName || user?.fullName}</Title>
        <Text type="secondary">{user?.role === 'admin' ? 'Quản trị viên' : 'Thí sinh'}</Text>
      </div>

      <Form
        form={profileForm}
        layout="vertical"
        onFinish={handleProfileSave}
        disabled={loading}
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
                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
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
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
                <Option value="other">Khác</Option>
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
            placeholder="Nhập địa chỉ" 
            rows={3} 
          />
        </Form.Item>

        <Form.Item className="text-right mb-0">
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
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="p-4">
      <Form
        form={preferencesForm}
        layout="vertical"
        onFinish={handlePreferencesSave}
        disabled={loading}
        initialValues={preferences}
      >
        <Card title="Giao diện" className="mb-4" size="small">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="theme"
                label="Chủ đề"
              >
                <Select>
                  <Option value="light">Sáng</Option>
                  <Option value="dark">Tối</Option>
                  <Option value="auto">Tự động</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="language"
                label="Ngôn ngữ"
              >
                <Select>
                  <Option value="vi">Tiếng Việt</Option>
                  <Option value="en">English</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="compactView"
                label="Chế độ hiển thị"
                valuePropName="checked"
              >
                <Switch checkedChildren="Gọn" unCheckedChildren="Mở rộng" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="autoSave"
                label="Tự động lưu"
                valuePropName="checked"
              >
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Thông báo" size="small">
          <Form.Item
            name="emailNotifications"
            label="Thông báo qua email"
            valuePropName="checked"
          >
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
          
          <Form.Item
            name="pushNotifications"
            label="Thông báo đẩy"
            valuePropName="checked"
          >
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
          
          <Form.Item
            name="applicationNotifications"
            label="Thông báo về hồ sơ"
            valuePropName="checked"
          >
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
          
          <Form.Item
            name="systemNotifications"
            label="Thông báo hệ thống"
            valuePropName="checked"
            className="mb-6"
          >
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
        </Card>

        <Form.Item className="text-right mb-0">
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SaveOutlined />} 
            loading={loading}
          >
            Lưu cài đặt
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="p-4">
      <Card title="Đổi mật khẩu" className="mb-4" size="small">
        <Form
          form={securityForm}
          layout="vertical"
          onFinish={handlePasswordChange}
          disabled={loading}
        >
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu hiện tại" />
          </Form.Item>
          
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>

          <Form.Item className="text-right">
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<LockOutlined />} 
              loading={loading}
            >
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Cài đặt bảo mật" size="small">
        <Form
          layout="vertical"
          onFinish={handleSecuritySave}
          disabled={loading}
          initialValues={securitySettings}
        >
          <Form.Item
            name="twoFactorEnabled"
            label="Xác thực hai yếu tố"
            valuePropName="checked"
          >
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
          
          <Form.Item
            name="sessionTimeout"
            label="Thời gian hết phiên (phút)"
          >
            <Select>
              <Option value={15}>15 phút</Option>
              <Option value={30}>30 phút</Option>
              <Option value={60}>1 giờ</Option>
              <Option value={120}>2 giờ</Option>
              <Option value={0}>Không giới hạn</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="loginAlerts"
            label="Cảnh báo đăng nhập"
            valuePropName="checked"
            className="mb-6"
          >
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>

          <Form.Item className="text-right mb-0">
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />} 
              loading={loading}
            >
              Lưu cài đặt
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );

  return (
    <Modal
      title={
        <Space>
          <SettingOutlined />
          <span>Cài đặt</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
      className="settings-modal"
    >
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        size="large"
        tabPosition="left"
        style={{ minHeight: 500 }}
      >
        <TabPane 
          tab={
            <Space>
              <UserOutlined />
              <span>Thông tin cá nhân</span>
            </Space>
          } 
          key="profile"
        >
          {renderProfileTab()}
        </TabPane>
        
        <TabPane 
          tab={
            <Space>
              <SettingOutlined />
              <span>Tùy chọn</span>
            </Space>
          } 
          key="preferences"
        >
          {renderPreferencesTab()}
        </TabPane>
        
        <TabPane 
          tab={
            <Space>
              <LockOutlined />
              <span>Bảo mật</span>
            </Space>
          } 
          key="security"
        >
          {renderSecurityTab()}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default SettingsModal;
