import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Button, Statistic, Avatar, Tag, Table, Skeleton, Empty, Tooltip, Space } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, FormOutlined, UserOutlined, ReloadOutlined, InfoCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../auth/store/authSlice';
import applicationService, { ApplicationListItemFE } from '../services/applicationService';
import styles from './CandidateDashboardPage.module.css';

const { Title, Paragraph, Text } = Typography;

const getStatusTag = (status: ApplicationListItemFE['status']) => {
  let color = 'default';
  let text = status ? status.toUpperCase() : 'KHÔNG XÁC ĐỊNH';
  switch (status) {
    case 'approved': color = 'success'; text = 'ĐÃ DUYỆT'; break;
    case 'pending': color = 'processing'; text = 'CHỜ DUYỆT'; break;
    case 'rejected': color = 'error'; text = 'TỪ CHỐI'; break;
    case 'processing': color = 'blue'; text = 'ĐANG XỬ LÝ'; break;
    case 'additional_required': color = 'warning'; text = 'CẦN BỔ SUNG'; break;
    case 'cancelled': color = 'default'; text = 'ĐÃ HỦY'; break;
  }
  return <Tag color={color} className="font-semibold">{text}</Tag>;
};

const CandidateDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser) as any;

  const [applications, setApplications] = useState<ApplicationListItemFE[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await applicationService.getMyApplications();
        if (res.success && res.data) {
          setApplications(res.data);
        } else {
          setError(res.message || 'Không thể tải dữ liệu.');
        }
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Thống kê
  const submittedApplications = applications.length;
  const approvedApplications = applications.filter(a => a.status === 'approved').length;
  const pendingApplications = applications.filter(a => a.status === 'pending' || a.status === 'processing' || a.status === 'additional_required').length;
  const rejectedApplications = applications.filter(a => a.status === 'rejected').length;

  // Preview 3 hồ sơ gần nhất
  const latestApplications = [...applications].sort((a, b) => (b.submissionDate.localeCompare(a.submissionDate))).slice(0, 3);

  return (
    <div className={styles.dashboardContainer}>
      {/* Header cá nhân hóa */}
      <div className={styles.header}>
        <Avatar
          size={96}
          src={user?.avatarUrl}
          icon={<UserOutlined />}
          className={styles.avatar}
        />
        <div className={styles.headerInfo}>
          <div className={styles.headerTitle}>
            Chào mừng, {user?.fullName || user?.email || 'Thí sinh'}!
          </div>
          <div className={styles.headerDesc}>
            Đây là trang quản lý hồ sơ và theo dõi kết quả tuyển sinh của bạn.
          </div>
          <span className={styles.statusTag}><CheckCircleOutlined style={{ color: '#22c55e', marginRight: 6 }} />Tài khoản đang hoạt động</span>
        </div>
      </div>

      {/* Thống kê */}
      <div className={styles.statsRow}>
        <div className={styles.statsCard}>
          <div className={styles.statsTitle}>Hồ Sơ Đã Nộp</div>
          <div className={styles.statsValue}><FileTextOutlined style={{ marginRight: 8 }} />{submittedApplications}</div>
        </div>
        <div className={styles.statsCard}>
          <div className={styles.statsTitle}>Được Duyệt</div>
          <div className={styles.statsValue}><CheckCircleOutlined style={{ marginRight: 8 }} />{approvedApplications}</div>
        </div>
        <div className={styles.statsCard}>
          <div className={styles.statsTitle}>Chờ Duyệt</div>
          <div className={styles.statsValue}><ClockCircleOutlined style={{ marginRight: 8 }} />{pendingApplications}</div>
        </div>
        <div className={styles.statsCard}>
          <div className={styles.statsTitle}>Bị Từ Chối</div>
          <div className={styles.statsValue}><CloseCircleOutlined style={{ marginRight: 8 }} />{rejectedApplications}</div>
        </div>
      </div>

      {/* Preview hồ sơ gần nhất */}
      <div className={styles.sectionTitle}><InfoCircleOutlined style={{ color: '#ef4444', marginRight: 8 }} />Hồ sơ gần nhất</div>
      <div className={styles.previewTable}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : error ? (
          <div className="mb-4"><Tag color="red">{error}</Tag></div>
        ) : latestApplications.length === 0 ? (
          <Empty description="Bạn chưa có hồ sơ nào được nộp." image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Table
            dataSource={latestApplications}
            rowKey="id"
            pagination={false}
            size="small"
            bordered
            columns={[
              { title: 'Trường', dataIndex: 'universityName', key: 'universityName', render: (text: string, r) => <Text strong>{text}</Text> },
              { title: 'Ngành', dataIndex: 'majorName', key: 'majorName' },
              { title: 'Năm', dataIndex: 'year', key: 'year', align: 'center' },
              { title: 'Ngày Nộp', dataIndex: 'submissionDate', key: 'submissionDate', align: 'center' },
              { title: 'Trạng Thái', dataIndex: 'status', key: 'status', align: 'center', render: getStatusTag },
              {
                title: 'Hành Động',
                key: 'action',
                align: 'center',
                render: (_: any, record: ApplicationListItemFE) => (
                  <Tooltip title="Xem chi tiết">
                    <Button
                      type="link"
                      icon={<InfoCircleOutlined />}
                      onClick={() => navigate('/candidate/my-applications')}
                    />
                  </Tooltip>
                ),
              },
            ]}
          />
        )}
      </div>

      {/* Tác vụ nhanh */}
      <div className={styles.sectionTitle}>Tác vụ nhanh</div>
      <div className={styles.quickActions}>
        <Button
          type="primary"
          icon={<FormOutlined />}
          size="large"
          block
          onClick={() => navigate('/candidate/submit-application')}
          className={styles.quickBtn + ' ' + styles.quickBtnPrimary}
        >
          Nộp Hồ Sơ Mới
        </Button>
        <Button
          icon={<FileTextOutlined />}
          size="large"
          block
          onClick={() => navigate('/candidate/my-applications')}
          className={styles.quickBtn + ' ' + styles.quickBtnOutline}
        >
          Xem Hồ Sơ Đã Nộp
        </Button>
        <Button
          icon={<UserOutlined />}
          size="large"
          block
          onClick={() => navigate('/candidate/profile')}
          className={styles.quickBtn + ' ' + styles.quickBtnOutline}
        >
          Cập Nhật Thông Tin
        </Button>
      </div>
    </div>
  );
};

export default CandidateDashboardPage;