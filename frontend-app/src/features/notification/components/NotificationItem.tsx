import React from 'react';
import { Card, Avatar, Typography, Space, Button } from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  InfoCircleOutlined, 
  ExclamationCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

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

interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isRead?: boolean;
  createdAt: string;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  title,
  message,
  type,
  isRead = false,
  createdAt,
  onMarkAsRead,
  onDelete
}) => {
  const getTypeConfig = (notificationType: string) => {
    switch (notificationType) {
      case 'success':
        return {
          icon: <CheckCircleOutlined />,
          color: COLORS.success,
          backgroundColor: '#ecfdf5',
          borderColor: '#10b981'
        };
      case 'error':
        return {
          icon: <CloseCircleOutlined />,
          color: COLORS.error,
          backgroundColor: '#fef2f2',
          borderColor: '#ef4444'
        };
      case 'warning':
        return {
          icon: <ExclamationCircleOutlined />,
          color: COLORS.warning,
          backgroundColor: '#fffbeb',
          borderColor: '#f59e0b'
        };
      default:
        return {
          icon: <InfoCircleOutlined />,
          color: COLORS.info,
          backgroundColor: '#eff6ff',
          borderColor: '#3b82f6'
        };
    }
  };

  const typeConfig = getTypeConfig(type);
    const formatTimeAgo = (dateString: string) => {
    try {
      const now = new Date();
      const past = new Date(dateString);
      const diffMs = now.getTime() - past.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 1) return 'vừa xong';
      if (diffMinutes < 60) return `${diffMinutes} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      if (diffDays < 7) return `${diffDays} ngày trước`;
      
      return past.toLocaleDateString('vi-VN');
    } catch (error) {
      return 'vừa xong';
    }
  };

  return (
    <Card
      style={{
        marginBottom: '12px',
        borderRadius: '16px',
        border: `2px solid ${isRead ? COLORS.gray[200] : typeConfig.borderColor}`,
        backgroundColor: isRead ? COLORS.white : typeConfig.backgroundColor,
        boxShadow: isRead 
          ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' 
          : '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
      bodyStyle={{ 
        padding: '20px',
        paddingBottom: '16px'
      }}
      hoverable
    >
      {/* Unread indicator */}
      {!isRead && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            backgroundColor: typeConfig.color,
            zIndex: 1
          }}
        />
      )}

      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        {/* Avatar with icon */}
        <Avatar
          size={48}
          style={{
            backgroundColor: typeConfig.color,
            color: COLORS.white,
            flexShrink: 0,
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          icon={typeConfig.icon}
        />

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '8px'
          }}>
            <Text
              strong
              style={{
                fontSize: '16px',
                color: COLORS.gray[900],
                lineHeight: '1.4',
                fontWeight: 600
              }}
            >
              {title}
            </Text>
            
            {!isRead && (
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: typeConfig.color,
                  flexShrink: 0,
                  marginLeft: '12px',
                  marginTop: '6px'
                }}
              />
            )}
          </div>

          {/* Message */}
          <Paragraph
            style={{
              color: COLORS.gray[600],
              fontSize: '14px',
              lineHeight: '1.5',
              marginBottom: '12px',
              margin: 0
            }}
            ellipsis={{ rows: 2, expandable: true, symbol: 'xem thêm' }}
          >
            {message}
          </Paragraph>

          {/* Footer */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '12px'
          }}>
            {/* Time ago */}
            <Space size={8}>
              <ClockCircleOutlined 
                style={{ 
                  color: COLORS.gray[400], 
                  fontSize: '12px' 
                }} 
              />
              <Text
                style={{
                  color: COLORS.gray[500],
                  fontSize: '12px',
                  fontWeight: 500
                }}
              >
                {formatTimeAgo(createdAt)}
              </Text>
            </Space>

            {/* Actions */}
            <Space size={8}>
              {!isRead && onMarkAsRead && (
                <Button
                  type="text"
                  size="small"
                  onClick={() => onMarkAsRead(id)}
                  style={{
                    color: typeConfig.color,
                    fontSize: '12px',
                    fontWeight: 500,
                    padding: '4px 8px',
                    height: 'auto',
                    borderRadius: '6px'
                  }}
                >
                  Đánh dấu đã đọc
                </Button>
              )}
              
              {onDelete && (
                <Button
                  type="text"
                  size="small"
                  onClick={() => onDelete(id)}
                  style={{
                    color: COLORS.gray[500],
                    fontSize: '12px',
                    fontWeight: 500,
                    padding: '4px 8px',
                    height: 'auto',
                    borderRadius: '6px'
                  }}
                >
                  Xóa
                </Button>
              )}
            </Space>
          </div>        </div>
      </div>
    </Card>
  );
};

export default NotificationItem;