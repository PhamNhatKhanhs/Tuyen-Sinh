import React from 'react';
import { Card, Typography, Space, Button, Empty, Spin, Divider } from 'antd';
import { 
  BellOutlined, 
  CheckOutlined, 
  ReloadOutlined
} from '@ant-design/icons';
import NotificationItem from './NotificationItem';

const { Title, Text } = Typography;

// Modern color palette
const COLORS = {
  primary: '#6366f1',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  },
  white: '#ffffff'
};

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isRead: boolean;
  createdAt: string;
}

interface NotificationListProps {
  notifications?: Notification[];
  loading?: boolean;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications = [],
  loading = false,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onRefresh
}) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Card
      style={{
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        border: 'none',
        overflow: 'hidden',
        minHeight: '500px'
      }}
      bodyStyle={{ padding: 0 }}
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, #4f46e5 100%)`,
          color: COLORS.white,
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BellOutlined style={{ fontSize: '24px' }} />
          <div>
            <Title level={3} style={{ color: COLORS.white, margin: 0, fontSize: '20px', fontWeight: 600 }}>
              Thông Báo
            </Title>
            {unreadCount > 0 && (
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                {unreadCount} thông báo chưa đọc
              </Text>
            )}
          </div>
        </div>

        <Space>
          {onRefresh && (
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              style={{
                color: COLORS.white,
                border: `1px solid rgba(255, 255, 255, 0.3)`,
                borderRadius: '8px'
              }}
              loading={loading}
            >
              Tải lại
            </Button>
          )}
          
          {unreadCount > 0 && onMarkAllAsRead && (
            <Button
              type="text"
              icon={<CheckOutlined />}
              onClick={onMarkAllAsRead}
              style={{
                color: COLORS.white,
                border: `1px solid rgba(255, 255, 255, 0.3)`,
                borderRadius: '8px'
              }}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </Space>
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px', color: COLORS.gray[500] }}>
              Đang tải thông báo...
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text style={{ color: COLORS.gray[500], fontSize: '16px' }}>
                  Không có thông báo nào
                </Text>
                <br />
                <Text style={{ color: COLORS.gray[400], fontSize: '14px' }}>
                  Bạn sẽ nhận được thông báo khi có cập nhật mới
                </Text>
              </div>
            }
            style={{ padding: '40px 0' }}
          />
        ) : (
          <>
            {/* Unread notifications */}
            {notifications.filter(n => !n.isRead).length > 0 && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <Text
                    strong
                    style={{
                      color: COLORS.gray[700],
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Chưa đọc ({notifications.filter(n => !n.isRead).length})
                  </Text>
                </div>
                
                {notifications
                  .filter(n => !n.isRead)
                  .map(notification => (
                    <NotificationItem
                      key={notification.id}
                      {...notification}
                      onMarkAsRead={onMarkAsRead}
                      onDelete={onDelete}
                    />
                  ))}
                
                {notifications.filter(n => n.isRead).length > 0 && (
                  <Divider style={{ margin: '24px 0' }} />
                )}
              </>
            )}

            {/* Read notifications */}
            {notifications.filter(n => n.isRead).length > 0 && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <Text
                    strong
                    style={{
                      color: COLORS.gray[500],
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Đã đọc ({notifications.filter(n => n.isRead).length})
                  </Text>
                </div>
                
                {notifications
                  .filter(n => n.isRead)
                  .map(notification => (
                    <NotificationItem
                      key={notification.id}
                      {...notification}
                      onMarkAsRead={onMarkAsRead}
                      onDelete={onDelete}
                    />
                  ))}
              </>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default NotificationList;
