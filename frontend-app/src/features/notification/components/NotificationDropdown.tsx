import React, { useState } from 'react';
import { 
  Badge, 
  Dropdown, 
  Button, 
  Typography, 
  Divider,
  Empty
} from 'antd';
import { 
  BellOutlined, 
  CheckOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

// Modern color palette
const COLORS = {
  primary: '#6366f1',
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

interface NotificationDropdownProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  maxDisplay?: number;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  maxDisplay = 5
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const displayNotifications = notifications.slice(0, maxDisplay);

  const dropdownContent = (
    <div
      style={{
        width: '380px',
        maxHeight: '600px',
        background: COLORS.white,
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        border: 'none'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${COLORS.gray[100]}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <Title level={5} style={{ margin: 0, color: COLORS.gray[900] }}>
            Thông báo
          </Title>
          {unreadCount > 0 && (
            <Text style={{ color: COLORS.gray[500], fontSize: '12px' }}>
              {unreadCount} thông báo mới
            </Text>
          )}
        </div>

        {unreadCount > 0 && onMarkAllAsRead && (
          <Button
            type="text"
            size="small"
            icon={<CheckOutlined />}
            onClick={onMarkAllAsRead}
            style={{
              color: COLORS.primary,
              fontSize: '12px',
              padding: '4px 8px',
              height: 'auto'
            }}
          >
            Đánh dấu tất cả
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '8px'
        }}
      >
        {displayNotifications.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có thông báo"
            style={{ padding: '40px 20px' }}
          />
        ) : (
          displayNotifications.map(notification => (
            <div
              key={notification.id}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                margin: '4px 0',
                backgroundColor: notification.isRead ? 'transparent' : COLORS.gray[50],
                border: `1px solid ${notification.isRead ? 'transparent' : COLORS.gray[200]}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.gray[50];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = notification.isRead ? 'transparent' : COLORS.gray[50];
              }}
              onClick={() => {
                if (!notification.isRead && onMarkAsRead) {
                  onMarkAsRead(notification.id);
                }
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                {/* Type indicator dot */}
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: notification.isRead ? COLORS.gray[300] : getTypeColor(notification.type),
                    marginTop: '6px',
                    flexShrink: 0
                  }}
                />

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    strong={!notification.isRead}
                    style={{
                      fontSize: '14px',
                      color: notification.isRead ? COLORS.gray[600] : COLORS.gray[900],
                      display: 'block',
                      marginBottom: '4px'
                    }}
                  >
                    {notification.title}
                  </Text>
                  
                  <Text
                    style={{
                      fontSize: '12px',
                      color: COLORS.gray[500],
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {notification.message}
                  </Text>
                  
                  <Text
                    style={{
                      fontSize: '11px',
                      color: COLORS.gray[400],
                      display: 'block',
                      marginTop: '4px'
                    }}
                  >
                    {formatTimeAgo(notification.createdAt)}
                  </Text>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > maxDisplay && (
        <>
          <Divider style={{ margin: '8px 0' }} />
          <div style={{ padding: '12px 20px', textAlign: 'center' }}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setOpen(false);
                navigate('/notifications');
              }}
              style={{
                color: COLORS.primary,
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Xem tất cả thông báo
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Dropdown
      overlay={dropdownContent}
      trigger={['click']}
      placement="bottomRight"
      open={open}
      onOpenChange={setOpen}
      overlayStyle={{ zIndex: 1050 }}
    >
      <Badge count={unreadCount} size="small" offset={[-2, 2]}>
        <Button
          type="text"
          shape="circle"
          icon={<BellOutlined />}
          style={{
            fontSize: '18px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.gray[600]
          }}
        />
      </Badge>
    </Dropdown>
  );
};

// Helper functions
const getTypeColor = (type: string) => {
  switch (type) {
    case 'success': return '#10b981';
    case 'error': return '#ef4444';
    case 'warning': return '#f59e0b';
    default: return '#3b82f6';
  }
};

const formatTimeAgo = (dateString: string) => {
  try {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'vừa xong';
    if (diffMinutes < 60) return `${diffMinutes} phút`;
    if (diffHours < 24) return `${diffHours} giờ`;
    if (diffDays < 7) return `${diffDays} ngày`;
    
    return past.toLocaleDateString('vi-VN');
  } catch (error) {
    return 'vừa xong';
  }
};

export default NotificationDropdown;
