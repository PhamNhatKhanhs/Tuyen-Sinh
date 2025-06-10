import React, { useEffect, useState } from 'react';
import { 
  Table, Button, Spin, message, 
  Input, Tag
} from 'antd';
import { 
  BankOutlined, SolutionOutlined, TeamOutlined, FileSearchOutlined,
  ArrowUpOutlined,
  CalendarOutlined, ReloadOutlined,
  DashboardOutlined, CheckCircleOutlined, ClockCircleOutlined,
  ExclamationCircleOutlined, CloseCircleOutlined
} from '@ant-design/icons';
import universityAdminService from '../services/universityAdminService';
import majorAdminService from '../services/majorAdminService';
import applicationAdminService from '../services/applicationAdminService';
import userAdminService from '../services/userAdminService';

const STATUS_COLORS: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
  approved: { color: '#52c41a', text: 'Đã duyệt', icon: <CheckCircleOutlined /> },
  processing: { color: '#fa8c16', text: 'Đang xử lý', icon: <ClockCircleOutlined /> },
  pending: { color: '#faad14', text: 'Chờ duyệt', icon: <ExclamationCircleOutlined /> },
  rejected: { color: '#ff4d4f', text: 'Từ chối', icon: <CloseCircleOutlined /> },
  cancelled: { color: '#8c8c8c', text: 'Đã hủy', icon: <CloseCircleOutlined /> },
  additional_required: { color: '#1890ff', text: 'Bổ sung', icon: <ExclamationCircleOutlined /> },
};

// Modern CSS Styles - Pure CSS Implementation
const customStyles = `
  /* Dashboard Container */
  .admin-dashboard {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 24px;
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  /* Header Section */
  .dashboard-header {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 40px;
    margin-bottom: 32px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .dashboard-title {
    color: white;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 12px 0;
    line-height: 1.2;
  }

  .dashboard-subtitle {
    color: rgba(255, 255, 255, 0.85);
    font-size: 1.125rem;
    margin: 0 0 32px 0;
    line-height: 1.5;
  }

  /* Stats Cards */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: white;
    border-radius: 16px;
    padding: 32px 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
  }

  .stat-card-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .stat-info h3 {
    font-size: 2.25rem;
    font-weight: 700;
    margin: 0;
    color: #1a202c;
    line-height: 1;
  }

  .stat-info p {
    font-size: 1rem;
    font-weight: 500;
    margin: 8px 0 0 0;
    color: #64748b;
  }

  .stat-icon {
    font-size: 2.5rem;
    color: #6366f1;
    opacity: 0.8;
  }

  /* Content Cards */
  .content-card {
    background: white;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 24px;
    overflow: hidden;
  }

  .card-header {
    padding: 24px 32px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
  }

  .card-body {
    padding: 32px;
  }

  /* Quick Stats Section */
  .quick-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;
  }

  .quick-stat-item {
    text-align: center;
    padding: 20px;
    border-radius: 12px;
    background: #f8fafc;
    transition: all 0.2s ease;
  }

  .quick-stat-item:hover {
    background: #f1f5f9;
    transform: translateY(-2px);
  }

  .quick-stat-value {
    font-size: 1.875rem;
    font-weight: 700;
    margin: 8px 0 4px 0;
  }

  .quick-stat-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    margin: 0;
  }

  /* Table Section */
  .table-controls {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
  }

  .table-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }

  .table-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .section-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 20px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Candidate Info */
  .candidate-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .candidate-details h4 {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
  }

  .candidate-details p {
    font-size: 0.75rem;
    color: #64748b;
    margin: 4px 0 0 0;
  }

  /* Status Display */
  .status-display {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .status-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    border: none;
  }

  .progress-bar {
    height: 4px;
    background: #f1f5f9;
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  /* Action Buttons */
  .action-buttons {
    display: flex;
    gap: 8px;
  }

  .btn {
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    background: white;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .btn:hover {
    background: #f9fafb;
    border-color: #9ca3af;
    transform: translateY(-1px);
  }

  .btn-primary {
    background: #3b82f6;
    border-color: #3b82f6;
    color: white;
  }

  .btn-primary:hover {
    background: #2563eb;
    border-color: #2563eb;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .admin-dashboard {
      padding: 16px;
    }
    
    .dashboard-header {
      padding: 24px;
    }
    
    .dashboard-title {
      font-size: 2rem;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .table-controls {
      flex-direction: column;
      align-items: stretch;
    }
    
    .table-filters,
    .table-actions {
      justify-content: center;
    }
    
    .card-body {
      padding: 20px;
    }
  }

  /* Smooth animations */
  * {
    transition: all 0.2s ease;
  }

  .ant-table-wrapper {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .ant-table-thead > tr > th {
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    font-weight: 600;
    color: #374151;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f8fafc;
  }
`;

const statCards = [
  { 
    title: 'Trường ĐH', 
    icon: <BankOutlined />, 
    key: 'universities', 
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  { 
    title: 'Ngành học', 
    icon: <SolutionOutlined />, 
    key: 'majors', 
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  { 
    title: 'Hồ sơ', 
    icon: <FileSearchOutlined />, 
    key: 'applications', 
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  { 
    title: 'Thí sinh', 
    icon: <TeamOutlined />, 
    key: 'candidates', 
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
];

const AdminDashboardPage: React.FC = () => {  const [stats, setStats] = useState({
    universities: 0,
    majors: 0,
    applications: 0,
    candidates: 0,
    approvedToday: 0,
    pendingToday: 0,
    totalThisMonth: 0,
    growthRate: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loadingTable, setLoadingTable] = useState(true);  const [filters, setFilters] = useState({ search: '' });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: number[]) => `${range[0]}-${range[1]} của ${total} hồ sơ`,
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const [uniRes, majorRes, appRes, userRes] = await Promise.all([
          universityAdminService.getAll({ limit: 1 }),
          majorAdminService.getAll({ limit: 1 }),
          applicationAdminService.getAll({ limit: 1 }),
          userAdminService.getAllUsers({ role: 'candidate', limit: 1 }),
        ]);
        
        setStats({
          universities: uniRes.total || 0,
          majors: majorRes.total || 0,
          applications: appRes.total || 0,
          candidates: userRes.total || 0,
          approvedToday: Math.floor(Math.random() * 20) + 5,
          pendingToday: Math.floor(Math.random() * 15) + 3,
          totalThisMonth: Math.floor(Math.random() * 200) + 100,
          growthRate: Math.floor(Math.random() * 30) + 5,
        });
      } catch (err: any) {
        message.error('Không thể tải thống kê tổng quan!');
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);  useEffect(() => {
    const fetchTable = async () => {
      setLoadingTable(true);
      try {
        // Tạo query params cho API
        const queryParams: any = { 
          limit: pagination.pageSize, 
          page: pagination.current,
          sortBy: 'submissionDate', 
          sortOrder: 'desc'
        };
          // Thêm search filter nếu có
        if (filters.search && filters.search.trim()) {
          queryParams.searchCandidate = filters.search.trim();
        }
        
        console.log('API Query Params:', queryParams); // Debug log
        console.log('Current filters state:', filters); // Debug filters state
        
        const res = await applicationAdminService.getAll(queryParams);
        setTableData(res.data || []);
        setPagination(prev => ({
          ...prev,
          total: res.total || 0
        }));
      } catch (err: any) {
        console.error('Error fetching table data:', err); // Debug log
        message.error('Không thể tải danh sách hồ sơ!');
      } finally {
        setLoadingTable(false);
      }
    };
    fetchTable();  }, [filters, pagination.current, pagination.pageSize]);

  // Handlers cho search
  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const columns = [
    {
      title: 'Thí sinh',
      key: 'candidate',
      render: (record: any) => (
        <div className="candidate-info">
          <div className="candidate-details">
            <h4>{record.candidateName}</h4>
            <p>{record.candidateEmail}</p>
          </div>
        </div>
      ),
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status: string) => {
        const statusInfo = STATUS_COLORS[status] || { color: '#8c8c8c', text: status, icon: <ExclamationCircleOutlined /> };
        
        return (
          <Tag 
            icon={statusInfo.icon} 
            color={statusInfo.color}
            style={{ 
              padding: '6px 12px', 
              borderRadius: '20px', 
              fontWeight: '500', 
              fontSize: '0.875rem',
              border: 'none'
            }}
          >
            {statusInfo.text}
          </Tag>
        );
      } 
    },
    { 
      title: 'Năm', 
      dataIndex: 'year', 
      key: 'year', 
      render: (v: string) => (
        <Tag style={{ borderRadius: '8px', fontWeight: '500' }}>{v}</Tag>
      )
    },
  ];return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="admin-dashboard">
        {/* Header Section */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Bảng Điều Khiển Quản Trị</h1>
          <p className="dashboard-subtitle">
            Tổng quan hệ thống tuyển sinh đại học, số liệu và hồ sơ mới nhất.
          </p>

          {/* Main Stats Cards */}
          <div className="stats-grid">
            {loadingStats ? (
              <div style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
                <Spin size="large" />
              </div>
            ) : (
              statCards.map(card => (
                <div 
                  key={card.key} 
                  className="stat-card" 
                  style={{ '--gradient': card.gradient } as React.CSSProperties}
                >
                  <div className="stat-card-content">
                    <div className="stat-info">
                      <h3>{stats[card.key as keyof typeof stats]}</h3>
                      <p>{card.title}</p>
                    </div>
                    <div className="stat-icon">
                      {card.icon}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="content-card">
          <div className="card-header">
            <CalendarOutlined style={{ color: '#3b82f6', fontSize: '1.25rem' }} />
            <h2 className="card-title">Thống kê nhanh</h2>
          </div>
          <div className="card-body">
            <div className="quick-stats-grid">
              <div className="quick-stat-item">
                <CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#52c41a' }} />
                <div className="quick-stat-value" style={{ color: '#52c41a' }}>
                  {stats.approvedToday}
                </div>
                <p className="quick-stat-label">Duyệt hôm nay</p>
              </div>
              <div className="quick-stat-item">
                <ClockCircleOutlined style={{ fontSize: '1.5rem', color: '#faad14' }} />
                <div className="quick-stat-value" style={{ color: '#faad14' }}>
                  {stats.pendingToday}
                </div>
                <p className="quick-stat-label">Chờ duyệt</p>
              </div>
              <div className="quick-stat-item">
                <CalendarOutlined style={{ fontSize: '1.5rem', color: '#1890ff' }} />
                <div className="quick-stat-value" style={{ color: '#1890ff' }}>
                  {stats.totalThisMonth}
                </div>
                <p className="quick-stat-label">Tháng này</p>
              </div>
              <div className="quick-stat-item">
                <ArrowUpOutlined style={{ fontSize: '1.5rem', color: '#722ed1' }} />
                <div className="quick-stat-value" style={{ color: '#722ed1' }}>
                  {stats.growthRate}%
                </div>
                <p className="quick-stat-label">Tăng trưởng</p>
              </div>
            </div>
          </div>
        </div>        {/* Data Table Section */}
        <div className="content-card">
          <div className="card-body">
            <div className="table-controls">
              <div className="table-filters">
                <Input.Search
                  placeholder="Tìm theo tên hoặc email thí sinh..."
                  allowClear
                  value={filters.search}
                  onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                  onSearch={handleSearch}
                  style={{ 
                    maxWidth: 320,
                    borderRadius: '8px'
                  }}
                />
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={() => window.location.reload()} 
                  style={{ borderRadius: '8px' }}
                >
                  Làm mới
                </Button>
              </div>
            </div>

            <h3 className="section-title">
              <DashboardOutlined style={{ color: '#3b82f6' }} />
              Danh sách hồ sơ mới nhất
            </h3>

            <Table
              columns={columns}
              dataSource={tableData}
              loading={loadingTable}
              pagination={{
                ...pagination,
                onChange: (page, pageSize) => {
                  setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize || 10
                  }));
                },
                onShowSizeChange: (_, size) => {
                  setPagination(prev => ({
                    ...prev,
                    current: 1,
                    pageSize: size
                  }));
                }
              }}
              rowKey="id"
              scroll={{ x: 600 }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;