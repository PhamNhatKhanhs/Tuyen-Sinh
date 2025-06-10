import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined, BankOutlined, SolutionOutlined, UnorderedListOutlined, AppstoreAddOutlined,
  FileSearchOutlined, TeamOutlined, BarChartOutlined, UserOutlined, LogoutOutlined,
  SettingOutlined, MenuFoldOutlined, MenuUnfoldOutlined
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectUser, logout } from '../features/auth/store/authSlice';

const { Sider, Content } = Layout;

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
const SIDEBAR_WIDTH = 260;

// Modern color palette
const COLORS = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  secondary: '#f1f5f9',
  accent: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  dark: '#0f172a',
  darkSecondary: '#1e293b',
  text: '#334155',
  textLight: '#64748b',
  white: '#ffffff',
  gray50: '#f8fafc',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  red50: '#fef2f2',
};

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = menuItems.find(item => location.pathname.startsWith(item.path))?.key || 'dashboard';
  const user = useAppSelector(selectUser);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  const userMenu: MenuProps = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Hồ sơ cá nhân',
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Cài đặt',
      },
      {
        type: 'divider' as const,
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Đăng xuất',
        danger: true,
        onClick: handleLogout,
      },
    ],
  };

  return (
    <>
      <style>{`
        .modern-admin-layout {
          font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .modern-sidebar {
          background: linear-gradient(180deg, ${COLORS.dark} 0%, ${COLORS.darkSecondary} 100%) !important;
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);
          border-right: none !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }
        
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
        }
        
        .brand-logo {
          width: 40px;
          height: 40px;
          background: ${COLORS.primary};
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: white;
          font-weight: bold;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
        }
        
        .brand-text {
          color: white;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.025em;
        }
        
        .user-info-sidebar {
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
        }
        
        .user-avatar-wrapper {
          position: relative;
          display: inline-block;
        }
        
        .user-status-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: ${COLORS.accent};
          border: 2px solid white;
          border-radius: 50%;
        }
        
        .modern-menu {
          background: transparent !important;
          border: none !important;
          padding: 16px 12px;
        }
        
        .modern-menu .ant-menu-item {
          margin: 4px 0 !important;
          border-radius: 12px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          padding: 12px 16px !important;
          height: auto !important;
          line-height: 1.4 !important;
          color: rgba(255, 255, 255, 0.8) !important;
          font-weight: 500 !important;
        }
        
        .modern-menu .ant-menu-item:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          transform: translateX(4px);
        }
        
        .modern-menu .ant-menu-item-selected {
          background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark}) !important;
          color: white !important;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3) !important;
          transform: translateX(4px);
        }
        
        .modern-menu .ant-menu-item-selected::after {
          display: none !important;
        }
          .modern-header {
          background: white !important;
          box-shadow: 0 1px 24px rgba(0, 0, 0, 0.08) !important;
          border-bottom: 1px solid ${COLORS.gray200} !important;
          padding: 0 32px !important;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: fixed;
          top: 0;
          right: 0;
          left: ${SIDEBAR_WIDTH}px;
          z-index: 1001;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .collapse-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: ${COLORS.gray50};
          border: 1px solid ${COLORS.gray200};
          cursor: pointer;
          transition: all 0.2s ease;
          color: ${COLORS.text};
        }
        
        .collapse-btn:hover {
          background: ${COLORS.gray100};
          transform: scale(1.05);
        }
        
        .page-title {
          font-size: 20px;
          font-weight: 600;
          color: ${COLORS.text};
          margin: 0;
        }
          .header-right {
          display: flex !important;
          align-items: center !important;
          gap: 16px !important;
          position: relative !important;
        }
        
        .user-dropdown {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          padding: 8px 16px !important;
          border-radius: 12px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          border: 1px solid transparent !important;
          background: transparent !important;
          position: relative !important;
        }
        
        .user-dropdown:hover {
          background: ${COLORS.gray50} !important;
          border-color: ${COLORS.gray200} !important;
        }
        
        .user-name {
          font-weight: 600 !important;
          color: ${COLORS.text} !important;
          font-size: 14px !important;
          margin: 0 !important;
          line-height: 1.2 !important;
        }
        
        .user-role {
          font-size: 12px !important;
          color: ${COLORS.textLight} !important;
          margin: 0 !important;
          line-height: 1.2 !important;
        }
        
        /* Dropdown Menu Enhancements */
        .ant-dropdown {
          z-index: 2000 !important;
        }
        
        .ant-dropdown-menu {
          z-index: 2000 !important;
          box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.08), 0 9px 28px 0 rgba(0, 0, 0, 0.05), 0 3px 6px -4px rgba(0, 0, 0, 0.12) !important;
          border-radius: 12px !important;
          padding: 8px !important;
          min-width: 160px !important;
          border: 1px solid ${COLORS.gray200} !important;
        }
        
        .ant-dropdown-menu-item {
          border-radius: 8px !important;
          margin: 2px 0 !important;
          padding: 8px 12px !important;
          transition: all 0.2s ease !important;
          font-weight: 500 !important;
        }
        
        .ant-dropdown-menu-item:hover {
          background-color: ${COLORS.gray50} !important;
        }
        
        .ant-dropdown-menu-item-danger:hover {
          background-color: ${COLORS.red50} !important;
          color: ${COLORS.danger} !important;
        }
        
        .ant-dropdown-menu-divider {
          margin: 8px 0 !important;
          background-color: ${COLORS.gray200} !important;
        }
          .modern-content {
          background: ${COLORS.gray50} !important;
          min-height: 100vh;
          padding: 32px !important;
          margin-left: ${SIDEBAR_WIDTH}px;
          margin-top: ${HEADER_HEIGHT}px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @media (max-width: 768px) {
          .modern-header {
            left: 0;
            padding: 0 16px !important;
          }
          
          .modern-content {
            margin-left: 0;
            padding: 20px !important;
          }
          
          .modern-sidebar {
            position: fixed !important;
            z-index: 1002;
          }
        }
      `}</style>

      <Layout className="modern-admin-layout" style={{ minHeight: '100vh' }}>
        <Sider 
          width={SIDEBAR_WIDTH}
          collapsible={false}
          className="modern-sidebar"
          style={{ 
            height: '100vh', 
            position: 'fixed', 
            left: 0, 
            top: 0, 
            bottom: 0, 
            zIndex: 1000 
          }}
        >
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <div className="brand-logo">TS</div>
              <div className="brand-text">TuyenSinh</div>
            </div>
          </div>

          <div className="user-info-sidebar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="user-avatar-wrapper">
                <Avatar 
                  size={44} 
                  src={user?.avatarUrl} 
                  icon={<UserOutlined />}
                  style={{ 
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    background: COLORS.primary 
                  }}
                />
                <div className="user-status-indicator"></div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  color: 'white', 
                  fontWeight: 600, 
                  fontSize: '14px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {user?.fullName || user?.email || 'Admin'}
                </div>
                <div style={{ 
                  color: 'rgba(255, 255, 255, 0.6)', 
                  fontSize: '12px' 
                }}>
                  {user?.role === 'admin' ? 'Quản trị viên' : user?.role}
                </div>
              </div>
            </div>
          </div>

          <Menu 
            theme="dark" 
            mode="inline" 
            selectedKeys={[selectedKey]} 
            className="modern-menu"
            items={menuItems.map(({key, icon, label, path}) => ({
              key, 
              icon, 
              label, 
              onClick: () => navigate(path)
            }))} 
          />
        </Sider>

        <Layout>
          <div className="modern-header" style={{ height: HEADER_HEIGHT }}>
            <div className="header-left">
              <Tooltip title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}>
                <div 
                  className="collapse-btn"
                  onClick={() => setCollapsed(!collapsed)}
                >
                  {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </div>
              </Tooltip>
              <h1 className="page-title">
                {menuItems.find(item => item.key === selectedKey)?.label || 'Dashboard'}
              </h1>
            </div>            <div className="header-right">
              <Dropdown 
                menu={userMenu} 
                placement="bottomRight" 
                trigger={['click']}
                getPopupContainer={(trigger) => trigger.parentElement || document.body}
                overlayStyle={{
                  zIndex: 2000,
                  position: 'fixed'
                }}
                dropdownRender={(menu) => (
                  <div style={{ 
                    background: 'white', 
                    borderRadius: '12px',
                    boxShadow: '0 6px 16px -8px rgba(0, 0, 0, 0.08), 0 9px 28px 0 rgba(0, 0, 0, 0.05), 0 3px 6px -4px rgba(0, 0, 0, 0.12)',
                    border: `1px solid ${COLORS.gray200}`,
                    overflow: 'hidden'
                  }}>
                    {menu}
                  </div>
                )}
              >
                <div className="user-dropdown">
                  <Avatar 
                    size={36} 
                    src={user?.avatarUrl} 
                    icon={<UserOutlined />}
                    style={{ background: COLORS.primary }}
                  />
                  <div>
                    <div className="user-name">
                      {user?.fullName || user?.email || 'Admin'}
                    </div>
                    <div className="user-role">
                      {user?.role === 'admin' ? 'Quản trị viên' : user?.role}
                    </div>
                  </div>
                </div>
              </Dropdown>
            </div>
          </div>

          <Content className="modern-content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default AdminLayout;
