import React, { useEffect, useState } from 'react';
import { Typography, List, Card, Spin, Alert, Input, Pagination, Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';
import universityService from '../services/universityService';
import { UniversityFE } from '../types'; // Import type cho University
import { BankOutlined, SearchOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const UniversityListPage: React.FC = () => {
  const [universities, setUniversities] = useState<UniversityFE[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUniversities, setTotalUniversities] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // Số trường mỗi trang
  const [searchTerm, setSearchTerm] = useState('');


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
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };
  
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };


  if (loading && universities.length === 0) { // Chỉ hiển thị spinner to nếu chưa có dữ liệu
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" tip="Đang tải danh sách trường..." />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <Title level={2} className="text-indigo-700 !mb-2 text-center">
        <BankOutlined className="mr-2" /> Danh Sách Các Trường Đại Học
      </Title>
      <Paragraph className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
        Khám phá thông tin về các trường đại học trên toàn quốc.
      </Paragraph>

      <Row justify="center" className="mb-6">
        <Col xs={24} sm={16} md={12} lg={10}>
            <Input.Search
                placeholder="Tìm kiếm theo tên hoặc mã trường..."
                enterButton={<><SearchOutlined /> Tìm</>}
                size="large"
                onSearch={handleSearch}
                loading={loading && searchTerm !== ''} // Spinner nhỏ khi đang search
                allowClear
            />
        </Col>
      </Row>


      {error && !loading && <Alert message={error} type="error" showIcon className="mb-6" />}
      
      {loading && universities.length > 0 && <div className="text-center mb-4"><Spin tip="Đang cập nhật..."/></div>}

      {!loading && universities.length === 0 && !error && (
        <Alert message="Không tìm thấy trường đại học nào phù hợp." type="info" showIcon className="mb-6" />
      )}

      <List
        grid={{
          gutter: 24,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 3,
          xl: 3,
          xxl: 3,
        }}
        dataSource={universities}
        renderItem={(uni) => (
          <List.Item>
            <Card
              hoverable
              className="shadow-md rounded-lg h-full flex flex-col"
              title={<Link to={`/universities/${uni.id}`} className="text-indigo-600 hover:text-indigo-700 text-lg font-semibold">{uni.name} ({uni.code})</Link>}
              // cover={uni.logoUrl ? <img alt={uni.name} src={uni.logoUrl} className="h-32 w-full object-contain p-2" onError={(e) => (e.currentTarget.style.display = 'none')} /> : null}
            >
              <div className="flex-grow">
                {uni.logoUrl && (
                    <div className="h-24 mb-3 flex items-center justify-center bg-gray-50 rounded">
                        <img alt={uni.name} src={uni.logoUrl} className="max-h-full max-w-full object-contain p-1" onError={(e) => (e.currentTarget.parentElement!.style.display = 'none')} />
                    </div>
                )}
                <Paragraph className="text-sm text-gray-600 mb-1">
                  <Text strong>Địa chỉ:</Text> {uni.address || 'Chưa cập nhật'}
                </Paragraph>
                {uni.website && (
                  <Paragraph className="text-sm text-gray-600">
                    <Text strong>Website:</Text> <a href={uni.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{uni.website}</a>
                  </Paragraph>
                )}
              </div>
              <div className="mt-auto pt-3">
                 <Button type="primary" block className="bg-indigo-500 hover:bg-indigo-600" onClick={() => alert(`Xem chi tiết trường ${uni.code} (chức năng chưa hoàn thiện)`)}>
                    Xem Chi Tiết Ngành
                </Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
      {totalUniversities > 0 && (
        <Row justify="center" className="mt-8">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalUniversities}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={['6', '12', '18', '24']}
          />
        </Row>
      )}
    </div>
  );
};
export default UniversityListPage;