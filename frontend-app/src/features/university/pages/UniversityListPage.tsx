import React, { useEffect, useState } from 'react';
import { Typography, Card, Alert, Input, Pagination, Button, Skeleton, Tag, Empty, Avatar, Badge, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import universityService from '../services/universityService';
import { UniversityFE } from '../types';
import { BankOutlined, SearchOutlined, GlobalOutlined, EnvironmentOutlined, BookOutlined, UserOutlined, StarOutlined, FireOutlined } from '@ant-design/icons';
import styles from './UniversityListPage.module.css';

const { Text } = Typography;

const UniversityListPage: React.FC = () => {
  const [universities, setUniversities] = useState<UniversityFE[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUniversities, setTotalUniversities] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();  // Sample logo URLs for universities - using multiple reliable sources
  const sampleLogos = [
    'https://picsum.photos/200/200?random=1',
    'https://via.placeholder.com/200x200/6366f1/ffffff?text=UNI+1',
    'https://picsum.photos/200/200?random=2',
    'https://via.placeholder.com/200x200/8b5cf6/ffffff?text=UNI+2',
    'https://picsum.photos/200/200?random=3',
    'https://via.placeholder.com/200x200/3b82f6/ffffff?text=UNI+3',
    'https://picsum.photos/200/200?random=4',
    'https://via.placeholder.com/200x200/10b981/ffffff?text=UNI+4',
    'https://picsum.photos/200/200?random=5',
    'https://via.placeholder.com/200x200/f59e0b/ffffff?text=UNI+5',
    'https://picsum.photos/200/200?random=6',
    'https://via.placeholder.com/200x200/ef4444/ffffff?text=UNI+6',
    'https://picsum.photos/200/200?random=7',
    'https://via.placeholder.com/200x200/8b5cf6/ffffff?text=UNI+7',
    'https://picsum.photos/200/200?random=8',
    'https://via.placeholder.com/200x200/6366f1/ffffff?text=UNI+8',
    'https://picsum.photos/200/200?random=9',
    'https://via.placeholder.com/200x200/3b82f6/ffffff?text=UNI+9'
  ];

  const getRandomLogo = (index: number) => {
    return sampleLogos[index % sampleLogos.length];
  };
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };  // University logo component with better fallback handling
  const UniversityLogo: React.FC<{ 
    university: UniversityFE; 
    index: number; 
  }> = ({ university, index }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    const colors = [
      '#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', 
      '#ef4444', '#ec4899', '#14b8a6', '#f97316', '#84cc16'
    ];
    
    const bgColor = colors[index % colors.length];
    const uniCode = university.code || `U${index + 1}`;
    
    // Optimized image sources with faster loading
    const imageSources = [
      `https://picsum.photos/200/200?random=${index + 100}`, // Different seed for variety
      `https://ui-avatars.com/api/?name=${encodeURIComponent(university.name.substring(0, 2))}&size=200&background=${bgColor.replace('#', '')}&color=ffffff&bold=true&format=png`,
      `https://via.placeholder.com/200x200/${bgColor.replace('#', '')}/ffffff?text=${encodeURIComponent(uniCode)}`
    ];
    
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    const handleImageError = () => {
      if (currentImageIndex < imageSources.length - 1) {
        setCurrentImageIndex(prev => prev + 1);
        setImageError(false);
      } else {
        setImageError(true);
      }
    };
    
    const handleImageLoad = () => {
      setImageLoaded(true);
      setImageError(false);
    };
    
    // If all images failed, show beautiful gradient fallback
    if (imageError || currentImageIndex >= imageSources.length) {
      return (
        <Avatar 
          size={72} 
          shape="square" 
          className={styles.defaultLogo}
          style={{ 
            background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {uniCode}
        </Avatar>
      );
    }
    
    return (
      <Avatar 
        size={72} 
        shape="square" 
        src={imageSources[currentImageIndex]}
        className={styles.universityLogo}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{
          background: imageLoaded ? 'transparent' : `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        {!imageLoaded && uniCode}
      </Avatar>
    );
  };

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
    <div className={styles.modernContainer}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroIcon}>
            <BankOutlined />
          </div>
          <h1 className={styles.heroTitle}>
            Khám Phá Các Trường Đại Học Hàng Đầu
          </h1>
          <p className={styles.heroSubtitle}>
            Tìm hiểu thông tin chi tiết về <span className={styles.highlight}>{totalUniversities}</span> trường đại học uy tín trên toàn quốc. 
            Khám phá ngành học, cơ sở vật chất và cơ hội nghề nghiệp tại mỗi trường.
          </p>
          
          {/* Search Section */}
          <div className={styles.searchContainer}>
            <Input.Search
              placeholder="Tìm kiếm theo tên hoặc mã trường đại học..."
              enterButton={
                <Button type="primary" className={styles.searchButton}>
                  <SearchOutlined /> Tìm kiếm
                </Button>
              }
              size="large"
              onSearch={handleSearch}
              loading={loading && searchTerm !== ''}
              allowClear
              className={styles.searchInput}
            />
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <BankOutlined />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{totalUniversities}</div>
              <div className={styles.statLabel}>Trường Đại học</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <BookOutlined />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>500+</div>
              <div className={styles.statLabel}>Ngành học</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <UserOutlined />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>1M+</div>
              <div className={styles.statLabel}>Sinh viên</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.contentSection}>
        {error && !loading && (
          <Alert 
            message={error} 
            type="error" 
            showIcon 
            className={styles.errorAlert}
            action={
              <Button size="small" danger onClick={() => window.location.reload()}>
                Thử lại
              </Button>
            }
          />
        )}

        {loading && universities.length === 0 && (
          <div className={styles.loadingGrid}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <Card className={styles.card}>
                  <Skeleton avatar paragraph={{ rows: 4 }} active />
                </Card>
              </div>
            ))}
          </div>
        )}

        {!loading && universities.length === 0 && !error && (
          <div className={styles.emptyState}>
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className={styles.emptyDescription}>
                  <Text strong>Không tìm thấy trường đại học nào</Text>
                  <br />
                  <Text type="secondary">Hãy thử với từ khóa khác</Text>
                </div>
              }
            />
          </div>
        )}

        {universities.length > 0 && (
          <>
            <div className={styles.resultsHeader}>
              <div className={styles.resultsInfo}>
                <Text strong>
                  Hiển thị {universities.length} trong tổng số {totalUniversities} trường đại học
                </Text>
                {searchTerm && (
                  <Tag color="blue" className={styles.searchTag}>
                    Kết quả cho: "{searchTerm}"
                  </Tag>
                )}
              </div>
            </div>            <div className={styles.universityGrid}>
              {universities.map((uni, index) => (
                <div key={uni.id} className={styles.universityCard}>
                  <Card
                    hoverable
                    className={styles.card}
                    cover={
                      <div className={styles.cardCover}>                        <div className={styles.logoContainer}>
                          <UniversityLogo university={uni} index={index} />
                        </div>
                        <Badge 
                          count={<StarOutlined style={{ color: '#faad14' }} />} 
                          className={styles.popularBadge}
                        />
                      </div>
                    }
                  >
                    <div className={styles.cardContent}>
                      <div className={styles.universityHeader}>
                        <Tag color="blue" className={styles.universityCode}>
                          {uni.code}
                        </Tag>
                        <div className={styles.universityName} title={uni.name}>
                          {uni.name}
                        </div>
                      </div>

                      <div className={styles.universityInfo}>
                        {uni.address && (
                          <div className={styles.infoItem}>
                            <EnvironmentOutlined className={styles.infoIcon} />
                            <Text className={styles.infoText} ellipsis title={uni.address}>
                              {uni.address}
                            </Text>
                          </div>
                        )}

                        {uni.website && (
                          <div className={styles.infoItem}>
                            <GlobalOutlined className={styles.infoIcon} />
                            <a 
                              href={uni.website} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={styles.websiteLink}
                              title={uni.website}
                            >
                              {uni.website.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        )}

                        {uni.description && (
                          <div className={styles.description}>
                            <Text type="secondary" className={styles.descriptionText}>
                              {uni.description}
                            </Text>
                          </div>
                        )}
                      </div>

                      <Divider className={styles.cardDivider} />

                      <div className={styles.cardActions}>
                        <Button
                          type="primary"
                          size="large"
                          block
                          className={styles.detailButton}
                          onClick={() => navigate(`/universities/${uni.id}`)}
                          icon={<FireOutlined />}
                        >
                          Khám phá ngay
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            {totalUniversities > pageSize && (
              <div className={styles.paginationContainer}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalUniversities}
                  onChange={handlePageChange}
                  showSizeChanger
                  pageSizeOptions={['9', '18', '27', '36']}
                  showTotal={(total, range) => 
                    `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} trường`
                  }
                  className={styles.pagination}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default UniversityListPage;