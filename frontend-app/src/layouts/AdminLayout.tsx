import React from 'react';
import { Layout, Menu, Avatar, Typography, Dropdown } from 'antd';
import {
  DashboardOutlined, BankOutlined, SolutionOutlined, UnorderedListOutlined, AppstoreAddOutlined,
  FileSearchOutlined, TeamOutlined, BarChartOutlined, UserOutlined, BellOutlined, LogoutOutlined
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectUser, logout } from '../features/auth/store/authSlice';

const { Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard', path: '/admin/dashboard' },
  { key: 'universities', icon: <BankOutlined />, label: 'QL Trường ĐH', path: '/admin/universities' },
  { key: 'majors', icon: <SolutionOutlined />, label: 'QL Ngành Học', path: '/admin/majors' },
  { key: 'admission-methods', icon: <UnorderedListOutlined />, label: 'QL Phương Thức XT', path: '/admin/admission-methods' },
  { key: 'subject-groups', icon: <AppstoreAddOutlined />, label: 'QL Tổ Hợp Môn', path: '/admin/subject-groups' },
  { key: 'applications', icon: <FileSearchOutlined />, label: 'QL Hồ Sơ', path: '/admin/applications' },
  { key: 'users', icon: <TeamOutlined />, label: 'QL Người Dùng', path: '/admin/users' },
  { key: 'stats', icon: <BarChartOutlined />, label: 'Thống Kê', path: '/admin/stats' },
];

const HEADER_HEIGHT = 64;

const NAVY = '#101828';

const AdminLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = menuItems.find(item => location.pathname.startsWith(item.path))?.key || 'dashboard';
  const user = useAppSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const logoutMenu = (
    <Menu>
      <Menu.Item key="logout" danger icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} className="flex flex-col" style={{ height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100, background: NAVY }}>
        <div className="flex items-center gap-2 px-4 py-6">
          <Avatar size={40} src={user?.avatarUrl} icon={<UserOutlined />} />
          <div>
            <Text className="text-white font-bold">{user?.fullName || user?.email || 'Admin'}</Text>
            <div className="text-xs text-gray-400">{user?.role === 'admin' ? 'Quản trị viên' : user?.role}</div>
          </div>
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} items={menuItems.map(({key, icon, label, path}) => ({key, icon, label, onClick: () => navigate(path)}))} className="border-none" style={{ background: NAVY }} />
      </Sider>
      <Layout style={{ marginLeft: 220 }}>
        {/* Top Header Bar */}
        <div style={{ height: HEADER_HEIGHT, background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', position: 'fixed', left: 220, right: 0, top: 0, zIndex: 101, borderBottom: '1px solid #23272f' }}>
          {/* Logo (left) */}
          <div className="flex items-center gap-2">
            <Link to="/">
              <img src="https://placehold.co/140x40/D8242C/FFFFFF?text=HỆ+THỐNG+TS&font=Inter" alt="Logo Hệ Thống Tuyển Sinh" style={{ height: 40, width: 140, objectFit: 'contain', borderRadius: 8, background: '#fff' }} />
            </Link>
            <span className="text-white text-lg font-bold tracking-wide">Admin Panel</span>
          </div>
          {/* Notification + User (right) */}
          <div className="flex items-center gap-6">
            <BellOutlined className="text-xl text-white cursor-pointer" />
            <Dropdown overlay={logoutMenu} placement="bottomRight" trigger={['click']}>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar size={36} src={user?.avatarUrl || undefined} icon={<UserOutlined style={{ color: '#fff' }} />} className="bg-gray-700 cursor-pointer" style={{ border: '2px solid #fff' }} />
                <span className="font-semibold" style={{ color: '#fff', fontSize: '1.08rem', letterSpacing: '0.01em' }}>{user?.fullName || user?.email || 'Admin'}</span>
              </div>
            </Dropdown>
          </div>
        </div>
        {/* Main Content */}
        <Content className="p-6 bg-neutral-50" style={{ minHeight: '100vh', paddingTop: HEADER_HEIGHT + 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 