// src/components/layout/AppHeader.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layout, Menu, Button, Avatar, Dropdown, Badge, List, Typography, Spin, Empty, message
} from 'antd';
import type { MenuProps } from 'antd';
import {
  HomeOutlined, UserOutlined, LoginOutlined, LogoutOutlined, DashboardOutlined,
  FormOutlined, SolutionOutlined, SettingOutlined, BuildOutlined,
  FileSearchOutlined, ReadOutlined, UnorderedListOutlined, AppstoreAddOutlined,
  LinkOutlined, BarChartOutlined, TeamOutlined, BellOutlined,
  MailOutlined, MenuOutlined
} from '@ant-design/icons';
import { Briefcase } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout, selectUser, selectIsAuthenticated, User } from '../../features/auth/store/authSlice';
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
  const user = useAppSelector(selectUser) as User | null;
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [notifications, setNotifications] = useState<NotificationFE[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationDropdownVisible, setNotificationDropdownVisible] = useState(false);

  const fetchNotifications = useCallback(async (showLoading = true) => {
    if (!isAuthenticated) return;
    if (showLoading) setLoadingNotifications(true);
    try {
      const response = await notificationService.getMyNotifications({ limit: MAX_NOTIFICATIONS_IN_DROPDOWN, page: 1 });
      if (response.success && response.data) {
        setNotifications(response.data);
        setUnreadCount(response.data.filter(n => !n.isRead).length);
      }
    } catch (error) {
      console.error("Lỗi tải thông báo:", error);
    } finally {
      if (showLoading) setLoadingNotifications(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (isAuthenticated) {
      fetchNotifications();
      intervalId = setInterval(() => fetchNotifications(false), 60000);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
    return () => clearInterval(intervalId);
  }, [isAuthenticated, fetchNotifications]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const userDropdownItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <Button type="text" block onClick={() => navigate(user?.role === 'admin' ? '/admin/dashboard' : '/candidate/dashboard')}>
          Trang của tôi
        </Button>
      ),
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: <Button type="text" block onClick={() => message.info('Chức năng cài đặt chưa có!')}>Cài đặt</Button>,
      icon: <SettingOutlined />,
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: <Button type="text" danger block onClick={handleLogout}>Đăng xuất</Button>,
      icon: <LogoutOutlined />,
    },
  ];

  const getMenuItems = (): MenuProps['items'] => {
    const items: MenuProps['items'] = [
      { key: 'home', icon: <HomeOutlined />, label: 'Trang Chủ', onClick: () => navigate('/') },
      { key: 'universities', icon: <ReadOutlined />, label: 'Các Trường ĐH', onClick: () => navigate('/universities') },
    ];

    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        items.push(
          { key: 'admin-dashboard', icon: <DashboardOutlined />, label: 'Bảng Điều Khiển', onClick: () => navigate('/admin/dashboard') },
          {
            key: 'admin-management',
            icon: <SettingOutlined />,
            label: 'Quản Lý Hệ Thống',
            children: [
              { key: 'admin-universities-mng', icon: <BuildOutlined />, label: 'QL Trường ĐH', onClick: () => navigate('/admin/universities') },
              { key: 'admin-majors-mng', icon: <SolutionOutlined />, label: 'QL Ngành Học', onClick: () => navigate('/admin/majors') },
              { key: 'admin-admission-methods-mng', icon: <UnorderedListOutlined />, label: 'QL Phương Thức XT', onClick: () => navigate('/admin/admission-methods') },
              { key: 'admin-subject-groups-mng', icon: <AppstoreAddOutlined />, label: 'QL Tổ Hợp Môn', onClick: () => navigate('/admin/subject-groups') },
              { key: 'admin-admission-links-mng', icon: <LinkOutlined />, label: 'QL Liên Kết Tuyển Sinh', onClick: () => navigate('/admin/admission-links') },
            ]
          },
          { key: 'admin-applications', icon: <FileSearchOutlined />, label: 'QL Hồ Sơ Tuyển Sinh', onClick: () => navigate('/admin/applications') },
          { key: 'admin-stats', icon: <BarChartOutlined />, label: 'Thống Kê', onClick: () => navigate('/admin/stats') },
          { key: 'admin-users-mng', icon: <TeamOutlined />, label: 'QL Người Dùng', onClick: () => navigate('/admin/users') },
        );
      } else if (user.role === 'candidate') {
        items.push(
          { key: 'candidate-dashboard', icon: <DashboardOutlined />, label: 'Bảng Điều Khiển', onClick: () => navigate('/candidate/dashboard') },
          { key: 'candidate-submit', icon: <FormOutlined />, label: 'Nộp Hồ Sơ', onClick: () => navigate('/candidate/submit-application') },
          { key: 'candidate-view', icon: <SolutionOutlined />, label: 'Hồ Sơ Của Tôi', onClick: () => navigate('/candidate/my-applications') },
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
        <Typography.Title level={5}>Thông Báo</Typography.Title>
        {unreadCount > 0 && (
          <Button type="link" size="small" onClick={handleMarkAllAsRead}>Đánh dấu đã đọc</Button>
        )}
      </div>
      <div className="notification-body">
        {loadingNotifications && notifications.length === 0 ? (
          <Spin className="my-6" />
        ) : notifications.length === 0 ? (
          <Empty description="Không có thông báo." image={Empty.PRESENTED_IMAGE_SIMPLE} className="my-10" />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={item => (
              <List.Item
                onClick={() => handleNotificationClick(item)}
                className={`notification-item ${!item.isRead ? 'unread' : ''}`}
              >
                <List.Item.Meta
                  avatar={<div className={`notification-avatar ${!item.isRead ? 'unread' : ''}`}><MailOutlined /></div>}
                  title={<Text strong={!item.isRead}>{item.title}</Text>}
                  description={
                    <>
                      <Paragraph ellipsis={{ rows: 2 }} className="notification-message">{item.message}</Paragraph>
                      <Text type="secondary" className="text-xs">{dayjs(item.createdAt).fromNow()}</Text>
                    </>
                  }
                />
                {!item.isRead && <Badge status="processing" />}
              </List.Item>
            )}
          />
        )}
      </div>
      <div className="notification-footer">
        <Button type="link" size="small" onClick={() => { navigate('/notifications'); setNotificationDropdownVisible(false); }}>
          Xem tất cả thông báo
        </Button>
      </div>
    </div>
  );

  return (
    <Header className="app-header">
      <div className="container">
        <Link to="/" className="logo">
          <Briefcase className="logo-icon" />
          <span className="logo-text">Tuyển Sinh ĐH</span>
        </Link>

        <Menu className="desktop-menu" mode="horizontal" items={getMenuItems()} selectable={false} />

        <div className="header-actions">
          {isAuthenticated && user && (
            <Dropdown 
              popupRender={() => notificationMenuOverlay}
              trigger={['click']}
              open={notificationDropdownVisible}
              onOpenChange={setNotificationDropdownVisible}
              placement="bottomRight"
            >
              <Badge count={unreadCount}>
                <Button type="text" shape="circle" icon={<BellOutlined />} className="icon-button" />
              </Badge>
            </Dropdown>
          )}

          {isAuthenticated && user ? (
            <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight">
              <div className="user-dropdown">
                <Avatar icon={<UserOutlined />} className="avatar" />
                <span className="username">{user.fullName || user.email}</span>
              </div>
            </Dropdown>
          ) : (
            <div className="auth-buttons">
              <Button onClick={() => navigate('/login')} className="btn-secondary">Đăng Nhập</Button>
              <Button onClick={() => navigate('/register')} className="btn-primary">Đăng Ký</Button>
            </div>
          )}

          <div className="mobile-menu-button">
            <Button type="text" shape="circle" icon={<MenuOutlined />} onClick={() => message.info("Mở mobile menu (chưa làm)")} />
          </div>
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;
