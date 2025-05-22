export const APP_NAME = 'Hệ Thống Tuyển Sinh Đại Học';
export const DEFAULT_PAGE_SIZE = 10;
// Thêm các cấu hình khác nếu cần

// --- Placeholder cho các features khác ---

// src/features/candidate/pages/CandidateDashboardPage.tsx
import React from 'react';
import { Typography, Row, Col, Card, Button, Statistic } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, FormOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';
import { selectUser, User } from '../../auth/store/authSlice';

const { Title, Paragraph } = Typography;

const CandidateDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser) as User | null;

  // Dữ liệu giả lập
  const submittedApplications = 2;
  const approvedApplications = 1;
  const pendingApplications = 1;

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <Title level={2} className="text-indigo-700 !mb-2">
        Chào mừng, {user?.email || 'Thí sinh'}!
      </Title>
      <Paragraph className="text-gray-600 mb-8">
        Đây là trang quản lý hồ sơ và theo dõi kết quả tuyển sinh của bạn.
      </Paragraph>

      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} className="shadow-md rounded-lg bg-blue-50 text-blue-700">
            <Statistic title="Hồ Sơ Đã Nộp" value={submittedApplications} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} className="shadow-md rounded-lg bg-green-50 text-green-700">
            <Statistic title="Hồ Sơ Được Duyệt" value={approvedApplications} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} className="shadow-md rounded-lg bg-yellow-50 text-yellow-700">
            <Statistic title="Hồ Sơ Chờ Duyệt" value={pendingApplications} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
      </Row>

      <Title level={4} className="!mb-6">Tác vụ nhanh:</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Button 
            type="primary" 
            icon={<FormOutlined />} 
            size="large" 
            block 
            onClick={() => navigate('/candidate/submit-application')}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Nộp Hồ Sơ Mới
          </Button>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Button 
            icon={<FileTextOutlined />} 
            size="large" 
            block 
            onClick={() => navigate('/candidate/my-applications')}
            className="hover:border-indigo-500 hover:text-indigo-500"
          >
            Xem Hồ Sơ Đã Nộp
          </Button>
        </Col>
      </Row>
    </div>
  );
};
export default CandidateDashboardPage;