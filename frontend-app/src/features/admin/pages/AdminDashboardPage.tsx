import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Button, Badge, Space, Typography, Spin, message, Input, Select, Tooltip } from 'antd';
import { BankOutlined, SolutionOutlined, TeamOutlined, FileSearchOutlined } from '@ant-design/icons';
import universityAdminService from '../services/universityAdminService';
import majorAdminService from '../services/majorAdminService';
import applicationAdminService from '../services/applicationAdminService';
import userAdminService from '../services/userAdminService';
import ClientOnly from 'src/components/ClientOnly';

const { Title } = Typography;
const { Option } = Select;

const STATUS_COLORS: Record<string, { color: string; text: string }> = {
  approved: { color: 'green', text: 'Đã duyệt' },
  processing: { color: 'orange', text: 'Đang xử lý' },
  pending: { color: 'orange', text: 'Chờ duyệt' },
  rejected: { color: 'red', text: 'Từ chối' },
  cancelled: { color: 'gray', text: 'Đã hủy' },
  additional_required: { color: 'blue', text: 'Bổ sung' },
};

const gradientBg = {
  background: 'linear-gradient(90deg, #f8fafc 0%, #e0e7ef 100%)',
  borderRadius: 18,
  boxShadow: '0 4px 24px 0 rgba(16,30,54,0.06)',
  padding: '2rem 2rem 1.5rem 2rem',
  marginBottom: 32,
};

const statCards = [
  { title: 'Trường ĐH', icon: <BankOutlined className="text-3xl text-blue-600" />, key: 'universities', color: 'bg-blue-50' },
  { title: 'Ngành học', icon: <SolutionOutlined className="text-3xl text-green-600" />, key: 'majors', color: 'bg-green-50' },
  { title: 'Hồ sơ', icon: <FileSearchOutlined className="text-3xl text-purple-600" />, key: 'applications', color: 'bg-purple-50' },
  { title: 'Thí sinh', icon: <TeamOutlined className="text-3xl text-orange-500" />, key: 'candidates', color: 'bg-orange-50' },
];

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    universities: 0,
    majors: 0,
    applications: 0,
    candidates: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: undefined as string | undefined });

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
        });
      } catch (err: any) {
        message.error('Không thể tải thống kê tổng quan!');
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchTable = async () => {
      setLoadingTable(true);
      try {
        const res = await applicationAdminService.getAll({ limit: 10, sortBy: 'submissionDate', sortOrder: 'desc', searchCandidate: filters.search, status: filters.status });
        setTableData(res.data || []);
      } catch (err: any) {
        message.error('Không thể tải danh sách hồ sơ!');
      } finally {
        setLoadingTable(false);
      }
    };
    fetchTable();
  }, [filters]);

  const columns = [
    { title: 'Tên thí sinh', dataIndex: 'candidateName', key: 'candidateName', render: (v: string) => <span className="font-medium text-gray-900">{v}</span> },
    { title: 'Email', dataIndex: 'candidateEmail', key: 'candidateEmail', render: (v: string) => <span className="text-gray-500">{v}</span> },
    { title: 'Ngành đăng ký', dataIndex: 'majorName', key: 'majorName', render: (v: string) => <Tooltip title={v}><span className="text-indigo-700 font-semibold truncate block max-w-[160px]">{v}</span></Tooltip> },
    { title: 'Trường', dataIndex: 'universityName', key: 'universityName', render: (v: string) => <Tooltip title={v}><span className="text-blue-700 font-semibold truncate block max-w-[160px]">{v}</span></Tooltip> },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status: string) => {
      const s = STATUS_COLORS[status] || { color: 'gray', text: status };
      return <Tooltip title={s.text}><Badge color={s.color} text={<span className={`font-semibold text-${s.color}-600`}>{s.text}</span>} /></Tooltip>;
    } },
    { title: 'Năm', dataIndex: 'year', key: 'year', render: (v: string) => <span className="text-gray-500">{v}</span> },
    { title: 'Hành động', key: 'action', render: () => (
      <Space>
        <Button type="primary" ghost size="small" className="rounded-lg">Xem</Button>
        <Button type="default" size="small" className="rounded-lg">Sửa</Button>
      </Space>
    ) },
  ];

  return (
    <div style={{ fontFamily: 'Inter, Poppins, Roboto, Be Vietnam Pro, system-ui, sans-serif', color: '#222', letterSpacing: '0.01em', lineHeight: 1.5 }}>
      {/* Top summary section with gradient */}
      <div style={{ ...gradientBg, padding: '2.5rem 2.5rem 2rem 2.5rem', marginBottom: 40 }}>
        <Title level={2} className="!mb-3 font-extrabold tracking-wide" style={{ fontSize: '2.5rem', color: '#1a1a1a', letterSpacing: '0.02em', lineHeight: 1.25 }}>
          Bảng Điều Khiển Quản Trị
        </Title>
        <Typography.Paragraph className="text-gray-600 text-lg mb-8 font-medium" style={{ letterSpacing: '0.01em', lineHeight: 1.5, marginBottom: 32 }}>
          Tổng quan hệ thống tuyển sinh đại học, số liệu và hồ sơ mới nhất.
        </Typography.Paragraph>
        <Row gutter={[32, 32]}>
          {loadingStats ? <Col span={24}><Spin /></Col> : statCards.map(card => (
            <Col xs={24} sm={12} md={6} key={card.key}>
              <Card variant="borderless" className={`shadow-lg rounded-2xl flex items-center gap-4 ${card.color} transition-all duration-200 hover:shadow-2xl hover:scale-105 cursor-pointer`} style={{ minHeight: 110, padding: 24, marginBottom: 24 }} onClick={() => navigate(card.link)}>
                <div>{card.icon}</div>
                <div>
                  <div className="font-bold" style={{ fontSize: '2rem', color: '#222', letterSpacing: '0.01em', lineHeight: 1.3 }}>{stats[card.key as keyof typeof stats]}</div>
                  <div className="text-gray-500 text-base font-medium" style={{ letterSpacing: '0.01em', lineHeight: 1.4 }}>{card.title}</div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      {/* Data table section */}
      <Card variant="borderless" className="shadow-xl rounded-2xl" style={{ padding: '2.5rem 2rem', marginBottom: 32 }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          <Input.Search
            placeholder="Tìm theo tên hoặc email thí sinh..."
            allowClear
            onSearch={v => setFilters(f => ({ ...f, search: v }))}
            style={{ maxWidth: 320, fontFamily: 'inherit', fontSize: '1rem', fontWeight: 500, letterSpacing: '0.01em', color: '#222' }}
          />
          <Select
            allowClear
            placeholder="Lọc theo trạng thái"
            style={{ width: 180, fontFamily: 'inherit', fontSize: '1rem', fontWeight: 500, letterSpacing: '0.01em', color: '#222' }}
            value={filters.status}
            onChange={v => setFilters(f => ({ ...f, status: v }))}
          >
            <Option value="approved">Đã duyệt</Option>
            <Option value="processing">Đang xử lý</Option>
            <Option value="pending">Chờ duyệt</Option>
            <Option value="rejected">Từ chối</Option>
            <Option value="cancelled">Đã hủy</Option>
            <Option value="additional_required">Bổ sung</Option>
          </Select>
        </div>
        <Title level={5} className="!mb-5 font-semibold tracking-wide" style={{ fontSize: '1.25rem', color: '#333', letterSpacing: '0.01em', lineHeight: 1.4, marginBottom: 24 }}>
          Danh sách hồ sơ mới nhất
        </Title>
        <Table
          columns={columns.map(col =>
            col.key === 'candidateName' || col.key === 'majorName' || col.key === 'universityName'
              ? { ...col, render: (v: string) => <span style={{ fontWeight: 500, fontSize: '1rem', color: '#222', letterSpacing: '0.01em', lineHeight: 1.4 }}>{v}</span> }
              : col.key === 'candidateEmail' || col.key === 'year'
              ? { ...col, render: (v: string) => <span style={{ fontWeight: 400, fontSize: '1rem', color: '#444', letterSpacing: '0.01em', lineHeight: 1.4 }}>{v}</span> }
              : col.key === 'action'
              ? { ...col, render: () => (
                  <Space>
                    <Button type="primary" ghost size="small" className="rounded-lg" style={{ fontWeight: 600, fontSize: '1rem', letterSpacing: '0.01em' }}>Xem</Button>
                    <Button type="default" size="small" className="rounded-lg" style={{ fontWeight: 600, fontSize: '1rem', letterSpacing: '0.01em' }}>Sửa</Button>
                  </Space>
                ) }
              : col
          )}
          dataSource={tableData}
          loading={loadingTable}
          pagination={false}
          rowKey="id"
          className="rounded-xl overflow-hidden"
          style={{ fontFamily: 'inherit', fontSize: '1rem', color: '#222', letterSpacing: '0.01em', lineHeight: 1.5 }}
        />
      </Card>
    </div>
  );
};

export default AdminDashboardPage;