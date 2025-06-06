import React, { useEffect, useState } from 'react';
import { Typography, Card, Spin, Alert, Input, Pagination, Button, Skeleton, Tooltip, Tag, Empty, Avatar } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import universityService from '../services/universityService';
import { UniversityFE } from '../types';
import { BankOutlined, SearchOutlined, GlobalOutlined, EnvironmentOutlined, PictureOutlined } from '@ant-design/icons';
import styles from './UniversityListPage.module.css';

const { Title, Paragraph, Text } = Typography;

const UniversityListPage: React.FC = () => {
  const [universities, setUniversities] = useState<UniversityFE[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUniversities, setTotalUniversities] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await universityService.getAll({ 
            page: currentPage, 
            limit: pageSize,
            search: searchTerm 
        });
        if (response.success && response.data) {
          setUniversities(response.data);
          setTotalUniversities(response.total || 0);
        } else {
          setError(response.message || 'Không thể tải danh sách trường.');
        }
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, [currentPage, pageSize, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading + ' ' + styles.redHeading}>
        Danh Sách Các Trường Đại Học
      </h1>
      <div className={styles.subheading + ' ' + styles.centerSubheading}>
        Khám phá thông tin về các trường đại học trên toàn quốc. Tìm kiếm, xem chi tiết ngành học, website, địa chỉ và nhiều thông tin hữu ích khác.
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }} className="mb-8">
        <Input.Search
          placeholder="Tìm kiếm theo tên hoặc mã trường..."
          enterButton={<><SearchOutlined /> Tìm</>}
          size="large"
          onSearch={handleSearch}
          loading={loading && searchTerm !== ''}
          allowClear
          className="rounded-lg shadow"
          style={{ maxWidth: 480, width: '100%' }}
        />
      </div>

      {error && !loading && <Alert message={error} type="error" showIcon className="mb-6" />}
      {loading && universities.length === 0 && (
        <div className={styles.grid + ' mb-8'}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.card}>
              <Card className="w-full h-full" bodyStyle={{ minHeight: 260 }}>
                <Skeleton avatar paragraph={{ rows: 4 }} active />
              </Card>
            </div>
          ))}
        </div>
      )}
      {!loading && universities.length === 0 && !error && (
        <Empty description="Không tìm thấy trường đại học nào phù hợp." className="mb-8" />
      )}
      <div className={styles.grid}>
        {universities.map((uni) => (
          <div key={uni.id} className={styles.card}>
            <Card
              hoverable
              className="w-full h-full"
              bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, background: 'none' }}
              cover={
                <div className={styles.cardCover}>
                  {uni.logoUrl ? (
                    <Avatar src={uni.logoUrl} size={80} shape="square" className="bg-white border object-contain" alt={uni.name} />
                  ) : (
                    <Avatar size={80} shape="square" icon={<PictureOutlined />} className="bg-gray-200" />
                  )}
                </div>
              }
            >
              <div className={styles.cardContent}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span className={styles.uniCode}>{uni.code}</span>
                  <span className={styles.uniName} title={uni.name}>{uni.name}</span>
                </div>
                <Tooltip title={uni.address} placement="topLeft">
                  <Paragraph className={styles.uniAddress}>
                    <EnvironmentOutlined style={{ marginRight: 4 }} /> {uni.address || 'Chưa cập nhật'}
                  </Paragraph>
                </Tooltip>
                {uni.website && (
                  <Paragraph className={styles.uniWebsite}>
                    <GlobalOutlined style={{ marginRight: 4 }} />
                    <a href={uni.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline" title={uni.website}>{uni.website}</a>
                  </Paragraph>
                )}
                {uni.description && (
                  <Tooltip title={uni.description} placement="topLeft">
                    <Paragraph className={styles.uniDescription}>{uni.description}</Paragraph>
                  </Tooltip>
                )}
                <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                  <Button
                    type="primary"
                    block
                    className={styles.detailBtn}
                    onClick={() => navigate(`/universities/${uni.id}`)}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
      {totalUniversities > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalUniversities}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={['6', '12', '18', '24']}
            showTotal={total => `Tổng cộng ${total} trường`}
          />
        </div>
      )}
    </div>
  );
};
export default UniversityListPage;