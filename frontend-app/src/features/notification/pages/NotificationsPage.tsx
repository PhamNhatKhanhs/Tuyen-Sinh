import React, { useState } from 'react';
import { Layout, Card, Space, message } from 'antd';
import NotificationList from '../components/NotificationList';

const { Content } = Layout;

// Mock data for demonstration
const mockNotifications = [
  {
    id: '1',
    title: 'Nộp hồ sơ thành công!',
    message: 'Hồ sơ 6847ce4ca40e57d9b184adb5 đã được nộp thành công vào ngành Công nghệ Thông tin (PTIT) - Học viện Bưu chính Viễn thông.',
    type: 'success' as const,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 minutes ago
  },
  {
    id: '2',
    title: 'Nộp hồ sơ thành công!',
    message: 'Hồ sơ 6847ce4ca40e57d9b184adb6 vào ngành Công nghệ Thông tin (PTIT) - Học viện Bưu chính Viễn thông đã được nộp thành công.',
    type: 'success' as const,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
  },
  {
    id: '3',
    title: 'Hồ sơ bị từ chối',
    message: 'Rất tiếc, hồ sơ 6847ce4ca40e57d9b184adb7 của bạn đã bị từ chối. Ghi chú: Không đạt điểm sàn DGNL.',
    type: 'error' as const,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString() // 11 hours ago
  },
  {
    id: '4',
    title: 'Nộp hồ sơ thành công!',
    message: 'Hồ sơ của bạn đã được nộp thành công và đang chờ xử lý.',
    type: 'success' as const,
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
  },
  {
    id: '5',
    title: 'Cập nhật thông tin',
    message: 'Vui lòng cập nhật thông tin cá nhân để hoàn tất quá trình đăng ký.',
    type: 'warning' as const,
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
  },
  {
    id: '6',
    title: 'Thông báo từ hệ thống',
    message: 'Hệ thống sẽ bảo trì vào ngày mai từ 2:00 - 4:00 sáng. Vui lòng hoàn tất các thao tác trước thời gian này.',
    type: 'info' as const,
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() // 3 days ago
  }
];

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [loading, setLoading] = useState(false);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    message.success('Đã đánh dấu là đã đọc');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    message.success('Đã đánh dấu tất cả là đã đọc');
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
    message.success('Đã xóa thông báo');
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      message.success('Đã tải lại thông báo');
    }, 1000);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
      <Content style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <NotificationList
          notifications={notifications}
          loading={loading}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onDelete={handleDelete}
          onRefresh={handleRefresh}
        />
      </Content>
    </Layout>
  );
};

export default NotificationsPage;
