import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Button, Statistic, Avatar, Tag, Table, Skeleton, Empty, Tooltip, Space } from 'antd';
import { 
  FileTextOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  FormOutlined, 
  UserOutlined, 
  ReloadOutlined, 
  InfoCircleOutlined, 
  CloseCircleOutlined,
  TrophyOutlined,
  BookOutlined,
  EyeOutlined,
  PlusOutlined,
  SettingOutlined
} from '@ant-design/icons';
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
      </div>      {/* Modern Statistics Section */}
      <div className={styles.statsRow}>
        <div className={styles.statsCard}>
          <div className={styles.statsIcon}>
            <FileTextOutlined />
          </div>
          <div className={styles.statsTitle}>Hồ Sơ Đã Nộp</div>
          <div className={styles.statsValue}>{submittedApplications}</div>
          <div className={styles.statsChange}>
            Tổng số hồ sơ đã gửi
          </div>
        </div>
        <div className={styles.statsCard}>
          <div className={styles.statsIcon}>
            <CheckCircleOutlined />
          </div>
          <div className={styles.statsTitle}>Được Duyệt</div>
          <div className={styles.statsValue}>{approvedApplications}</div>
          <div className={styles.statsChange}>
            Hồ sơ được chấp nhận
          </div>
        </div>
        <div className={styles.statsCard}>
          <div className={styles.statsIcon}>
            <ClockCircleOutlined />
          </div>
          <div className={styles.statsTitle}>Chờ Duyệt</div>
          <div className={styles.statsValue}>{pendingApplications}</div>
          <div className={styles.statsChange}>
            Đang xem xét
          </div>
        </div>
        <div className={styles.statsCard}>
          <div className={styles.statsIcon}>
            <CloseCircleOutlined />
          </div>
          <div className={styles.statsTitle}>Bị Từ Chối</div>
          <div className={styles.statsValue}>{rejectedApplications}</div>
          <div className={styles.statsChange}>
            Cần xem lại
          </div>
        </div>
      </div>      {/* Recent Applications Section */}
      <div className={styles.sectionTitle}>
        <div className={styles.sectionIcon}>
          <BookOutlined />
        </div>
        Hồ sơ gần nhất
      </div>
      <div className={styles.previewTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>Danh sách hồ sơ mới nhất</div>
          <Button 
            className={styles.viewAllBtn}
            icon={<EyeOutlined />}
            onClick={() => navigate('/candidate/my-applications')}
          >
            Xem tất cả
          </Button>
        </div>
        
        {loading ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : error ? (
          <div className="mb-4"><Tag color="red">{error}</Tag></div>
        ) : latestApplications.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <FileTextOutlined />
            </div>
            <div className={styles.emptyTitle}>Chưa có hồ sơ nào</div>
            <div className={styles.emptyDesc}>
              Bạn chưa nộp hồ sơ tuyển sinh nào. Hãy bắt đầu với hồ sơ đầu tiên của bạn!
            </div>
            <Button 
              className={styles.emptyAction}
              icon={<PlusOutlined />}
              onClick={() => navigate('/candidate/submit-application')}
            >
              Nộp Hồ Sơ Đầu Tiên
            </Button>
          </div>
        ) : (
          <Table
            dataSource={latestApplications}
            rowKey="id"
            pagination={false}
            size="middle"
            scroll={{ x: 800 }}
            columns={[
              { 
                title: 'Trường', 
                dataIndex: 'universityName', 
                key: 'universityName', 
                render: (text: string) => <Text strong style={{ color: '#1f2937' }}>{text}</Text>,
                width: 200,
                ellipsis: true
              },
              { 
                title: 'Ngành', 
                dataIndex: 'majorName', 
                key: 'majorName',
                width: 180,
                ellipsis: true
              },
              { 
                title: 'Năm', 
                dataIndex: 'year', 
                key: 'year', 
                align: 'center',
                width: 80
              },
              { 
                title: 'Ngày Nộp', 
                dataIndex: 'submissionDate', 
                key: 'submissionDate', 
                align: 'center',
                width: 120,
                render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
              },
              { 
                title: 'Trạng Thái', 
                dataIndex: 'status', 
                key: 'status', 
                align: 'center', 
                render: getStatusTag,
                width: 140
              },
              {
                title: 'Thao Tác',
                key: 'action',
                align: 'center',
                width: 100,
                render: (_: any, record: ApplicationListItemFE) => (
                  <Tooltip title="Xem chi tiết">
                    <Button
                      type="text"
                      icon={<InfoCircleOutlined />}
                      onClick={() => navigate('/candidate/my-applications')}
                      style={{ color: '#2563eb' }}
                    />
                  </Tooltip>
                ),
              },
            ]}
          />
        )}
      </div>      {/* Modern Quick Actions */}
      <div className={styles.sectionTitle}>
        <div className={styles.sectionIcon}>
          <TrophyOutlined />
        </div>
        Thao tác nhanh
      </div>
      <div className={styles.quickActions}>
        <Button
          type="primary"
          icon={<PlusOutlined className={styles.quickBtnIcon} />}
          size="large"
          block
          onClick={() => navigate('/candidate/submit-application')}
          className={`${styles.quickBtn} ${styles.quickBtnPrimary}`}
        >
          Nộp Hồ Sơ Mới
        </Button>
        <Button
          icon={<FileTextOutlined className={styles.quickBtnIcon} />}
          size="large"
          block
          onClick={() => navigate('/candidate/my-applications')}
          className={`${styles.quickBtn} ${styles.quickBtnOutline}`}
        >
          Xem Hồ Sơ Đã Nộp
        </Button>
        <Button
          icon={<SettingOutlined className={styles.quickBtnIcon} />}
          size="large"
          block
          onClick={() => navigate('/candidate/profile')}
          className={`${styles.quickBtn} ${styles.quickBtnOutline}`}
        >
          Cập Nhật Thông Tin
        </Button>
      </div>
    </div>
  );
};

export default CandidateDashboardPage;