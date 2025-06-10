import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layout, Menu, Button, Avatar, Dropdown, Badge, List, Typography, Spin, Empty, message, Drawer
} from 'antd';
import type { MenuProps } from 'antd';
import {
  HomeOutlined, UserOutlined, LoginOutlined, LogoutOutlined, DashboardOutlined,
  FormOutlined, SolutionOutlined, SettingOutlined, BuildOutlined,
  FileSearchOutlined, ReadOutlined, UnorderedListOutlined, AppstoreAddOutlined,
  LinkOutlined, BarChartOutlined, TeamOutlined, BellOutlined,
  MailOutlined, MenuOutlined, CloseOutlined, DownOutlined
} from '@ant-design/icons';
import { Briefcase } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout, selectUser, selectIsAuthenticated } from '../../features/auth/store/authSlice';
import notificationService from '../../features/notification/services/notificationService';
import { NotificationFE } from '../../features/notification/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import './AppHeader.css';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Header } = Layout;
const { Text, Paragraph } = Typography;
const MAX_NOTIFICATIONS_IN_DROPDOWN = 7;

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser) as any;
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [notifications, setNotifications] = useState<NotificationFE[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationDropdownVisible, setNotificationDropdownVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const fetchNotifications = useCallback(async (showLoading = true) => {
    if (!isAuthenticated) return;
    
    if (showLoading) setLoadingNotifications(true);
    
    try {
      const response = await notificationService.getMyNotifications({ 
        limit: MAX_NOTIFICATIONS_IN_DROPDOWN, 
        page: 1 
      });
      
      if (response.success && response.data) {
        setNotifications(response.data);
        setUnreadCount(response.data.filter(n => !n.isRead).length);
      } else {
        console.error('Failed to fetch notifications:', response.message);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      if (showLoading) setLoadingNotifications(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    
    if (isClient && isAuthenticated) {
      // Initial fetch
      fetchNotifications();
      
      // Set up polling interval
      intervalId = setInterval(() => {
        fetchNotifications(false);
      }, 60000); // Poll every minute
    } else {
      // Clear notifications when user logs out
      setNotifications([]);
      setUnreadCount(0);
    }

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAuthenticated, fetchNotifications, isClient]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setMobileMenuVisible(false);
  };

  const handleNavigation = (path: string) => {
    // Sử dụng replace: true để giữ nguyên trạng thái khi điều hướng đến trang chủ
    if (path === '/') {
      navigate(path, { replace: true });
    } else {
      navigate(path);
    }
    setMobileMenuVisible(false);
  };

  const userDropdownItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <div className="dropdown-item">
          <UserOutlined />
          <span>Trang của tôi</span>
        </div>
      ),
      onClick: () => navigate(user?.role === 'admin' ? '/admin/dashboard' : '/candidate/profile')
    },
    {
      key: 'settings',
      label: (
        <div className="dropdown-item">
          <SettingOutlined />
          <span>Cài đặt</span>
        </div>
      ),
      onClick: () => message.info('Chức năng cài đặt chưa có!')
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: (
        <div className="dropdown-item danger">
          <LogoutOutlined />
          <span>Đăng xuất</span>
        </div>
      ),
      onClick: handleLogout
    },
  ];

  const getMenuItems = (isClient: boolean): MenuProps['items'] => {
    const items: MenuProps['items'] = [
      { key: 'home', icon: <HomeOutlined />, label: 'Trang Chủ', onClick: () => handleNavigation('/') },
      { key: 'universities', icon: <ReadOutlined />, label: 'Các Trường ĐH', onClick: () => handleNavigation('/universities') },
    ];
    if (isClient && isAuthenticated && user) {
      if (user.role === 'admin') {
        items.push(
          { key: 'admin-dashboard', icon: <DashboardOutlined />, label: 'Bảng Điều Khiển', onClick: () => handleNavigation('/admin/dashboard') },
          { key: 'admin-management', icon: <SettingOutlined />, label: 'Quản Lý Hệ Thống', children: [
              { key: 'admin-universities-mng', icon: <BuildOutlined />, label: 'QL Trường ĐH', onClick: () => handleNavigation('/admin/universities') },
              { key: 'admin-majors-mng', icon: <SolutionOutlined />, label: 'QL Ngành Học', onClick: () => handleNavigation('/admin/majors') },
              { key: 'admin-admission-methods-mng', icon: <UnorderedListOutlined />, label: 'QL Phương Thức XT', onClick: () => handleNavigation('/admin/admission-methods') },
              { key: 'admin-subject-groups-mng', icon: <AppstoreAddOutlined />, label: 'QL Tổ Hợp Môn', onClick: () => handleNavigation('/admin/subject-groups') },
              { key: 'admin-admission-links-mng', icon: <LinkOutlined />, label: 'QL Liên Kết Tuyển Sinh', onClick: () => handleNavigation('/admin/admission-links') },
          ]},
          { key: 'admin-applications', icon: <FileSearchOutlined />, label: 'QL Hồ Sơ Tuyển Sinh', onClick: () => handleNavigation('/admin/applications') },
          { key: 'admin-stats', icon: <BarChartOutlined />, label: 'Thống Kê', onClick: () => handleNavigation('/admin/stats') },
          { key: 'admin-users-mng', icon: <TeamOutlined />, label: 'QL Người Dùng', onClick: () => handleNavigation('/admin/users') },
        );
      } else if (user.role === 'candidate') {
        items.push(
          { key: 'candidate-dashboard', icon: <DashboardOutlined />, label: 'Bảng Điều Khiển', onClick: () => handleNavigation('/candidate/dashboard') },
          { key: 'candidate-submit', icon: <FormOutlined />, label: 'Nộp Hồ Sơ', onClick: () => handleNavigation('/candidate/submit-application') },
          { key: 'candidate-view', icon: <SolutionOutlined />, label: 'Hồ Sơ Của Tôi', onClick: () => handleNavigation('/candidate/my-applications') },
        );
      }
    }
    return items;
  };

  const handleNotificationClick = async (notification: NotificationFE) => {
    setNotificationDropdownVisible(false);
    if (notification.link) navigate(notification.link);
    if (!notification.isRead) {
      try {
        const response = await notificationService.markAsRead(notification.id);
        if (response.success) fetchNotifications(false);
      } catch (error) {
        console.error("Đánh dấu đã đọc thất bại:", error);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead();
      if (response.success) {
        message.success('Tất cả đã được đánh dấu là đã đọc.');
        fetchNotifications(false);
      } else {
        message.error(response.message || 'Không thể đánh dấu.');
      }
    } catch {
      message.error('Lỗi kết nối.');
    }
  };

  const notificationMenuOverlay = (
    <div className="notification-dropdown">
      <div className="notification-header">
        <Typography.Title level={5} className="notification-title">
          Thông Báo
          {unreadCount > 0 && <Badge count={unreadCount} size="small" />}
        </Typography.Title>
        {unreadCount > 0 && (
          <Button type="link" size="small" onClick={handleMarkAllAsRead} className="mark-all-btn">
            Đánh dấu đã đọc
          </Button>
        )}
      </div>
      <div className="notification-body">
        {loadingNotifications && notifications.length === 0 ? (
          <div className="notification-loading">
            <Spin size="small" />
            <Text type="secondary">Đang tải...</Text>
          </div>
        ) : notifications.length === 0 ? (
          <Empty 
            description="Không có thông báo mới" 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            className="notification-empty" 
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={item => (
              <List.Item
                onClick={() => handleNotificationClick(item)}
                className={`notification-item ${!item.isRead ? 'unread' : 'read'}`}
              >
                <List.Item.Meta
                  avatar={
                    <div className={`notification-avatar ${!item.isRead ? 'unread' : ''}`}>
                      <MailOutlined />
                    </div>
                  }
                  title={<Text strong={!item.isRead} className="notification-title">{item.title}</Text>}
                  description={
                    <div className="notification-content">
                      <Paragraph ellipsis={{ rows: 2 }} className="notification-message">
                        {item.message}
                      </Paragraph>
                      <Text type="secondary" className="notification-time">
                        {dayjs(item.createdAt).fromNow()}
                      </Text>
                    </div>
                  }
                />
                {!item.isRead && <div className="unread-indicator" />}
              </List.Item>
            )}
          />
        )}
      </div>
      <div className="notification-footer">
        <Button 
          type="link" 
          size="small" 
          onClick={() => { 
            navigate('/notifications'); 
            setNotificationDropdownVisible(false); 
          }}
          className="view-all-btn"
        >
          Xem tất cả thông báo
        </Button>
      </div>
    </div>
  );

  const renderMobileMenuItem = (item: any, isChild = false) => (
    <div key={item.key} className={`mobile-menu-item ${isChild ? 'child' : ''}`}>
      {item.children ? (
        <div className="mobile-submenu">
          <div className="mobile-submenu-title">
            {item.icon}
            <span>{item.label}</span>
            <DownOutlined className="submenu-arrow" />
          </div>
          <div className="mobile-submenu-content">
            {item.children.map((child: any) => renderMobileMenuItem(child, true))}
          </div>
        </div>
      ) : (
        <div className="mobile-menu-link" onClick={item.onClick}>
          {item.icon}
          <span>{item.label}</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Header className="app-header">
        <div className="header-container">
          <Link to="/" className="header-logo">
            <div className="logo-icon-wrapper">
              <Briefcase className="logo-icon" />
            </div>
            <div className="logo-text-wrapper">
              <span className="logo-text-main">Tuyển Sinh ĐH</span>
              <span className="logo-text-sub">Hệ thống thông tin</span>
            </div>
          </Link>

          <Menu 
            className="desktop-menu" 
            mode="horizontal" 
            items={getMenuItems(isClient)} 
            selectable={false}
            theme="light"
          />

          <div className="header-actions">
            {isClient ? (
              <>
                {isAuthenticated && user && (
                  <div className="notification-container">
                    <Badge count={unreadCount} size="small">
                      <Button 
                        type="text" 
                        shape="circle" 
                        icon={<BellOutlined />} 
                        className="notification-button"
                        onClick={() => setNotificationDropdownVisible(!notificationDropdownVisible)}
                      />
                    </Badge>
                    {notificationDropdownVisible && (
                      <div className="notification-dropdown-wrapper">
                        {notificationMenuOverlay}
                      </div>
                    )}
                  </div>
                )}

                {isAuthenticated && user ? (
                  <Dropdown 
                    menu={{ items: userDropdownItems }} 
                    placement="bottomRight"
                    overlayClassName="user-dropdown-overlay"
                  >
                    <div className="user-info">
                      <Avatar icon={<UserOutlined />} className="user-avatar" size="default" />
                      <div className="user-details">
                        <span className="user-name">{user.fullName || user.email}</span>
                        <span className="user-role">{user.role === 'admin' ? 'Quản trị viên' : 'Thí sinh'}</span>
                      </div>
                      <DownOutlined className="user-dropdown-arrow" />
                    </div>
                  </Dropdown>
                ) : (
                  <div className="auth-buttons">
                    <Button onClick={() => navigate('/login')} className="login-button" icon={<LoginOutlined />}>
                      Đăng Nhập
                    </Button>
                    <Button onClick={() => navigate('/register')} type="primary" className="register-button">
                      Đăng Ký
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ width: '210px', height: '40px' }} />
            )}

            <Button 
              type="text" 
              shape="circle" 
              icon={<MenuOutlined />} 
              onClick={() => setMobileMenuVisible(true)}
              className="mobile-menu-trigger"
            />
          </div>
        </div>
      </Header>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div className="mobile-menu-header">
            <div className="mobile-logo">
              <Briefcase className="mobile-logo-icon" />
              <span>Tuyển Sinh ĐH</span>
            </div>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        className="mobile-menu-drawer"
        width={300}
        closeIcon={<CloseOutlined />}
      >
        <div className="mobile-menu-content">
          {/* User Info in Mobile */}
          {isAuthenticated && user && (
            <div className="mobile-user-info">
              <Avatar icon={<UserOutlined />} size="large" />
              <div className="mobile-user-details">
                <Text strong>{user.fullName || user.email}</Text>
                <Text type="secondary">{user.role === 'admin' ? 'Quản trị viên' : 'Thí sinh'}</Text>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <div className="mobile-navigation">
            {getMenuItems(isClient)?.map(item => renderMobileMenuItem(item))}
          </div>

          {/* Auth Buttons in Mobile */}
          {!isAuthenticated && (
            <div className="mobile-auth-buttons">
              <Button 
                block 
                onClick={() => handleNavigation('/login')}
                icon={<LoginOutlined />}
                className="mobile-login-btn"
              >
                Đăng Nhập
              </Button>
              <Button 
                block 
                type="primary" 
                onClick={() => handleNavigation('/register')}
                className="mobile-register-btn"
              >
                Đăng Ký
              </Button>
            </div>
          )}

          {/* Logout Button in Mobile */}
          {isAuthenticated && (
            <div className="mobile-logout">
              <Button 
                block 
                danger 
                onClick={handleLogout}
                icon={<LogoutOutlined />}
              >
                Đăng Xuất
              </Button>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default AppHeader;
