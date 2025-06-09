import React from 'react';
import { Typography, Button, Row, Col, Space, Avatar } from 'antd';
import './HomePage.css';
import './BorderStyles.css';
import './HeroSection.css';
import './ElegantStyles.css';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowRightOutlined, FormOutlined, 
    BookOutlined, 
    BankOutlined, SolutionOutlined, 
    StarFilled
} from '@ant-design/icons';
import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated, selectUser } from '../features/auth/store/authSlice';
import type { User } from '../features/auth/types';
import { 
    MessageSquare, 
    Heart,         
    ThumbsUp,      
    BookOpen, Zap, Award, TrendingUp, 
    Sparkles, Star, Users, Briefcase
} from 'lucide-react';
import Banner from '../components/banner/Banner';
import classNames from 'classnames';

const { Title, Paragraph, Text } = Typography;

// Enhanced TestimonialCard với nhiều màu sắc
interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatarChar?: string;
  avatarUrl?: string; // Added avatarUrl
  rating?: number;
  bgColor?: string;
  icon?: React.ReactNode;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, role, avatarChar, avatarUrl, rating, bgColor, icon }) => {
  return (
    <div className={classNames("testimonial-card", bgColor)}> {/* Used bgColor here */}
      <div className="testimonial-card-content">
        {icon && <div className="testimonial-icon">{icon}</div>}
        {avatarUrl ? (
          <Avatar src={avatarUrl} size={56} className="testimonial-avatar-img" />
        ) : avatarChar ? (
          <div className="testimonial-avatar">{avatarChar}</div>
        ) : null}
        <Paragraph className="testimonial-quote">"{quote}"</Paragraph>
        <Text strong className="testimonial-name">{name}</Text>
        <Text className="testimonial-role">{role}</Text>
        {rating && (
          <div className="testimonial-rating">
            {Array(rating)
              .fill(0)
              .map((_, i) => (
                <StarFilled key={i} style={{ color: '#FFD700' }} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

const testimonialsData: TestimonialCardProps[] = [
  {
    quote: "Hệ thống rất dễ sử dụng và giúp tôi tiết kiệm rất nhiều thời gian trong việc nộp hồ sơ. Giao diện thân thiện và quy trình rõ ràng.",
    name: "Nguyễn Văn An",
    role: "Thí sinh K27",
    avatarChar: "A",
    avatarUrl: "https://picsum.photos/seed/an/100/100", // Added avatarUrl
    rating: 5,
    bgColor: "bg-gradient-to-br from-pink-400 via-rose-400 to-fuchsia-500",
    icon: <ThumbsUp size={24} />
  },
  {
    quote: "Thông tin về các trường đại học rất đầy đủ và cập nhật. Tôi có thể so sánh và lựa chọn trường phù hợp một cách dễ dàng.",
    name: "Trần Thị Bình",
    role: "Phụ huynh",
    avatarChar: "B",
    avatarUrl: "https://picsum.photos/seed/binh/100/100", // Added avatarUrl
    rating: 5,
    bgColor: "bg-gradient-to-br from-sky-400 via-cyan-400 to-teal-500",
    icon: <MessageSquare size={24} />
  },
  {
    quote: "Dịch vụ hỗ trợ tuyệt vời! Nhân viên tư vấn nhiệt tình và giải đáp mọi thắc mắc một cách chi tiết và chuyên nghiệp.",
    name: "Lê Minh Cường",
    role: "Thí sinh K26",
    avatarChar: "C",
    avatarUrl: "https://picsum.photos/seed/cuong/100/100", // Added avatarUrl
    rating: 5,
    bgColor: "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500",
    icon: <Heart size={24} />
  }
];

const HomePage: React.FC = () => {
  const navigate = useNavigate(); // Ensure navigate is defined
  const isAuthenticated = useAppSelector(selectIsAuthenticated); // Ensure isAuthenticated is defined
  const user = useAppSelector(selectUser) as User | null; // Ensure user is defined

  // Banner data
  const bannerItems = [
    {
      id: '1',
      title: 'Chinh Phục Đại Học Mơ Ước',
      subtitle: 'TUYỂN SINH 2025',
      description: 'Hệ thống tư vấn tuyển sinh thông minh giúp bạn lựa chọn ngành học phù hợp và tối ưu cơ hội trúng tuyển vào trường đại học mơ ước.',
      buttonText: 'Bắt đầu ngay',
      buttonLink: '/auth/register',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      gradientColors: 'rgba(79, 70, 229, 0.8) 0%, rgba(45, 212, 191, 0.8) 100%'
    },
    {
      id: '2',
      title: 'Tư Vấn Ngành Học Phù Hợp',
      subtitle: 'AI TƯ VẤN',
      description: 'Công nghệ AI phân tích năng lực, sở thích và xu hướng thị trường để gợi ý ngành học phù hợp nhất với bạn.',
      buttonText: 'Khám phá ngay',
      buttonLink: '/tu-van-nganh-hoc',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      gradientColors: 'rgba(220, 38, 38, 0.8) 0%, rgba(251, 146, 60, 0.8) 100%'
    },
    {
      id: '3',
      title: 'Nộp Hồ Sơ Trực Tuyến',
      subtitle: 'TIỆN LỢI & NHANH CHÓNG',
      description: 'Quy trình nộp hồ sơ trực tuyến đơn giản, nhanh chóng và an toàn. Tiết kiệm thời gian và chi phí đi lại.',
      buttonText: 'Nộp hồ sơ',
      buttonLink: '/nop-ho-so',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      gradientColors: 'rgba(79, 70, 229, 0.8) 0%, rgba(124, 58, 237, 0.8) 100%'
    },
    {
      id: '4',
      title: 'Học Bổng & Cơ Hội Tài Chính',
      subtitle: 'HỖ TRỢ TÀI CHÍNH',
      description: 'Khám phá hàng ngàn cơ hội học bổng và hỗ trợ tài chính từ các trường đại học và tổ chức uy tín.',
      buttonText: 'Tìm học bổng',
      buttonLink: '/hoc-bong',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1911&q=80',
      gradientColors: 'rgba(20, 83, 45, 0.8) 0%, rgba(5, 150, 105, 0.8) 100%'
    },
    {
      id: '5',
      title: 'Sự Kiện Tuyển Sinh 2025',
      subtitle: 'SỰ KIỆN SẮP DIỄN RA',
      description: 'Tham gia các sự kiện tuyển sinh trực tiếp và trực tuyến để gặp gỡ đại diện các trường và tư vấn chuyên sâu.',
      buttonText: 'Đăng ký tham gia',
      buttonLink: '/su-kien',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      gradientColors: 'rgba(157, 23, 77, 0.8) 0%, rgba(219, 39, 119, 0.8) 100%'
    },
    {
      id: '6',
      title: 'Thống Kê & Xu Hướng Ngành Nghề',
      subtitle: 'DỮ LIỆU THỰC TẾ',
      description: 'Phân tích dữ liệu thị trường lao động, xu hướng ngành nghề và cơ hội việc làm trong tương lai.',
      buttonText: 'Xem thống kê',
      buttonLink: '/thong-ke',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      gradientColors: 'rgba(30, 58, 138, 0.8) 0%, rgba(37, 99, 235, 0.8) 100%'
    }
  ];

  const handleNopHoSo = () => {
    if (isAuthenticated && user?.role === 'candidate') {
      navigate('/dashboard/ho-so');
    } else {
      navigate('/auth/register');
    }
  };

  const statsData = [
    { title: 'Trường Đại Học', value: "200+", icon: <BankOutlined /> },
    { title: 'Ngành Tuyển Sinh', value: "1,500+", icon: <SolutionOutlined /> },
    { title: 'Hồ Sơ Đã Nộp', value: "50K+", icon: <FormOutlined /> },
    { title: 'Thí Sinh Tin Dùng', value: "100K+", icon: <Users /> }, // Users is LucideUsers
  ];  const whyChooseUsFeatures = [
    { icon: <Zap />, title: "Nộp Hồ Sơ Nhanh Chóng", description: "Quy trình trực tuyến tinh gọn, tiết kiệm thời gian tối đa cho thí sinh và phụ huynh với giao diện thân thiện.", colorClass: "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600", accentColor: "from-green-400 to-emerald-500", linkTo: !isAuthenticated ? "/auth/register" : (user?.role === 'candidate' ? "/candidate/submit-application" : undefined), linkText: "Nộp hồ sơ ngay" },
    { icon: <BookOpen />, title: "Thông Tin Đa Dạng", description: "Cập nhật liên tục thông tin tuyển sinh, chỉ tiêu, điểm chuẩn từ hàng trăm trường đại học uy tín trên cả nước.", colorClass: "bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600", accentColor: "from-blue-400 to-indigo-500", linkTo: "/universities", linkText: "Khám phá các trường" },
    { icon: <TrendingUp />, title: "Theo Dõi Trực Quan", description: "Dễ dàng theo dõi trạng thái xử lý hồ sơ và nhận thông báo kết quả nhanh nhất qua hệ thống thông minh.", colorClass: "bg-gradient-to-br from-purple-400 via-violet-500 to-pink-600", accentColor: "from-purple-400 to-violet-500", linkTo: isAuthenticated && user?.role === 'candidate' ? "/candidate/my-applications" : "/auth/login", linkText: "Kiểm tra hồ sơ" },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-stone-50 to-gray-100 min-h-screen">
      
      {/* Banner Section */}
      <Banner items={bannerItems} />
      
      {/* Modern Header with Pastel Gradient and Dot Pattern */}
      <section className="modern-header-background">
        {/* Header content */}
        
        <div className="header-content">
          <Row align="middle" className="w-full max-w-7xl mx-auto">
            <Col xs={24} lg={12} className="text-center lg:text-left">

              
              <Title level={1} className="header-title !text-5xl lg:!text-6xl !font-black !mb-6 !leading-tight">
                Nộp Hồ Sơ Đại Học{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                  Siêu Dễ Dàng
                </span>
              </Title>
              
              <Paragraph className="header-subtitle !text-lg !mb-8 max-w-xl lg:pr-6">
                Nền tảng tuyển sinh thông minh giúp bạn tìm kiếm, so sánh và nộp hồ sơ vào các trường đại học hàng đầu Việt Nam chỉ với vài cú nhấp chuột.
              </Paragraph>
              
              <Space size="large" className="flex flex-col sm:flex-row gap-4">
                <Button 
                  type="primary" 
                  size="large"
                  className="!h-auto !px-8 !py-3 !text-base !font-medium bg-gradient-to-r from-indigo-500 to-purple-500 border-none shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate('/universities')}
                >
                  <span className="flex items-center">
                    <BankOutlined className="mr-2" />
                    Khám phá trường đại học
                  </span>
                </Button>
                <Button 
                  size="large"
                  className="!h-auto !px-8 !py-3 !text-base !font-medium bg-white text-indigo-600 border border-indigo-100 shadow-md hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
                  onClick={() => navigate('/nganh-hoc')}
                >
                  <span className="flex items-center">
                    <BookOutlined className="mr-2" />
                    Tìm ngành học phù hợp
                  </span>
                </Button>
              </Space>
            </Col>
            
            <Col xs={24} lg={12} className="mt-12 lg:mt-0">
              <div className="relative">
                <div className="relative z-10 bg-white p-1 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-500 border border-indigo-50">
                  <img 
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                    alt="Sinh viên đại học" 
                    className="rounded-lg"
                  />

                </div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-r from-indigo-200/40 to-purple-200/40 rounded-full blur-2xl z-0"></div>
              </div>
            </Col>
          </Row>
        </div>
      </section>      {/* Why Choose Us Section - Ultra Modern & Beautiful */}
      <section className="why-choose-ultra-modern-section">
        {/* Complex Background */}
        <div className="why-choose-bg-wrapper">
          <div className="why-choose-bg-gradient"></div>
          <div className="why-choose-bg-pattern"></div>
          <div className="why-choose-floating-orbs">
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
          </div>
        </div>

        <div className="why-choose-container">
          {/* Premium Section Header */}
          <div className="why-choose-header">
            <div className="why-choose-badge">
              <Sparkles className="sparkle-icon" />
              <span>Lợi Ích Vượt Trội</span>
              <Sparkles className="sparkle-icon" />
            </div>
            
            <h2 className="why-choose-title">
              Tại Sao Chọn{' '}
              <span className="title-gradient">
                Hệ Thống Của Chúng Tôi?
              </span>
            </h2>
            
            <p className="why-choose-subtitle">
              Trải nghiệm tuyển sinh trực tuyến toàn diện với những ưu điểm vượt trội được hàng ngàn thí sinh tin tưởng
            </p>
          </div>

          {/* Premium Feature Cards */}
          <div className="why-choose-cards-grid">
            {whyChooseUsFeatures.map((item, index) => (
              <div 
                key={index}
                className={`why-choose-premium-card card-${index + 1}`}
                style={{ 
                  animationDelay: `${index * 0.2}s`
                }}
                onClick={() => item.linkTo && navigate(item.linkTo)}
              >
                {/* Card Background Effects */}
                <div className="card-bg-effect"></div>
                <div className="card-glow-effect"></div>
                
                {/* Card Content */}
                <div className="card-content-wrapper">
                  {/* Premium Icon */}
                  <div className={`card-icon-wrapper icon-${index + 1}`}>
                    <div className="icon-inner">
                      {item.icon}
                    </div>
                    <div className="icon-glow"></div>
                  </div>
                  
                  {/* Text Content */}
                  <div className="card-text-content">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-description">{item.description}</p>
                  </div>
                  
                  {/* Premium Action Link */}
                  {item.linkTo && (
                    <div className="card-action">
                      <span className="action-text">{item.linkText}</span>
                      <div className="action-icon">
                        <ArrowRightOutlined />
                      </div>
                    </div>
                  )}
                </div>

                {/* Decorative Elements */}
                <div className="card-decoration-1"></div>
                <div className="card-decoration-2"></div>
                <div className="card-shine-effect"></div>
              </div>
            ))}
          </div>
        </div>
      </section>{/* Featured Universities Section - Enhanced Premium */}
      <section className="universities-enhanced-section relative py-24 lg:py-40 overflow-hidden" style={{ margin: '4rem 2rem', borderRadius: '24px' }}>
        {/* Enhanced Background with Multiple Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-green-800/80 via-transparent to-blue-800/80"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 universities-bg-pattern opacity-20">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-yellow-300/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.8'%3E%3Cpath d='M36 30c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15 15-6.716 15-15zm-5 0c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }}></div>        <div className="container mx-auto px-6 relative z-10">
          <Row align="middle" gutter={[48, 48]}>
            {/* Left Column - Content */}
            <Col xs={24} lg={12} xl={13}>
              <div className="universities-content-container">
                {/* Enhanced Badge */}
                <div className="universities-enhanced-badge">
                  <span className="universities-badge-icon">🏛️</span>
                  <span className="universities-badge-text">TOP TRƯỜNG ĐẠI HỌC HÀNG ĐẦU</span>
                  <span className="universities-badge-icon">⭐</span>
                </div>

                {/* Enhanced Title */}
                <Title level={1} className="universities-enhanced-title">
                  <span className="universities-title-line1">Khám Phá Những</span>
                  <br />
                  <span className="universities-title-line2">Trường Đại Học Uy Tín</span>
                </Title>

                {/* Enhanced Description */}
                <div className="universities-description-container">
                  <Paragraph className="universities-enhanced-description">
                    <strong>Tìm hiểu thông tin chi tiết</strong> về các trường đại học uy tín hàng đầu Việt Nam. 
                    Khám phá <span className="universities-highlight-text">chương trình đào tạo chất lượng cao</span> 
                    và cơ hội nghề nghiệp tương lai rộng mở.
                  </Paragraph>
                  <Paragraph className="universities-enhanced-description">
                    Hãy lựa chọn môi trường học tập lý tưởng với 
                    <span className="universities-highlight-text"> đội ngũ giảng viên uy tín</span> và 
                    cơ sở vật chất hiện đại nhất!
                  </Paragraph>
                </div>

                {/* Enhanced Features List */}
                <div className="universities-features-list">
                  <div className="universities-feature-item">
                    <div className="universities-feature-icon">🎓</div>
                    <span>200+ trường đại học uy tín</span>
                  </div>
                  <div className="universities-feature-item">
                    <div className="universities-feature-icon">📚</div>
                    <span>1,500+ ngành học đa dạng</span>
                  </div>
                  <div className="universities-feature-item">
                    <div className="universities-feature-icon">🏆</div>
                    <span>Xếp hạng quốc tế cao</span>
                  </div>
                </div>

                {/* Enhanced Buttons */}
                <div className="universities-buttons-container">
                  <Button 
                    type="primary" 
                    size="large" 
                    className="universities-primary-button"
                    icon={<Star className="universities-button-icon"/>}
                    onClick={() => navigate('/universities')}
                  >
                    <span className="universities-button-text">Xem Tất Cả Trường</span>
                  </Button>
                  <Button 
                    size="large" 
                    className="universities-secondary-button"
                    icon={<ArrowRightOutlined className="universities-button-icon"/>}
                    onClick={() => navigate('/top-truong-dai-hoc')}
                  >
                    <span className="universities-button-text">Top 10 Trường</span>
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="universities-trust-indicators">
                  <div className="universities-trust-item">
                    <strong>95%</strong> tỷ lệ đỗ đại học
                  </div>
                  <div className="universities-trust-divider">•</div>
                  <div className="universities-trust-item">
                    <strong>200+</strong> trường đối tác
                  </div>
                  <div className="universities-trust-divider">•</div>
                  <div className="universities-trust-item">
                    <strong>50K+</strong> sinh viên
                  </div>
                </div>
              </div>
            </Col>            {/* Right Column - Image */}
            <Col xs={24} lg={12} xl={11}>
              <div className="universities-image-container">
                <div className="universities-image-wrapper">                  <img 
                    src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1586&q=80" 
                    alt="Trường đại học uy tín" 
                    className="universities-main-image"
                  />
                  {/* Floating University Cards */}
                  <div className="universities-floating-card universities-card-1">
                    <div className="universities-card-icon">🏛️</div>
                    <div className="universities-card-content">
                      <div className="universities-card-title">Đại học Quốc gia</div>
                      <div className="universities-card-rating">★★★★★</div>
                    </div>
                  </div>
                  <div className="universities-floating-card universities-card-2">
                    <div className="universities-card-icon">📊</div>
                    <div className="universities-card-content">
                      <div className="universities-card-title">Tỷ lệ việc làm</div>
                      <div className="universities-card-value">96%</div>
                    </div>
                  </div>
                  <div className="universities-floating-card universities-card-3">
                    <div className="universities-card-icon">🎯</div>
                    <div className="universities-card-content">
                      <div className="universities-card-title">Chương trình</div>
                      <div className="universities-card-value">1,500+</div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>


      

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 testimonials-section"> {/* Removed bg-gray-100 */}
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <Paragraph className="testimonials-section-tagline">
              {/* Đánh giá từ người dùng */}
            </Paragraph>
            <Title level={2} className="testimonials-section-title">
              Lắng Nghe Chia Sẻ
            </Title>
            <Paragraph className="testimonials-section-subtitle">
              Cảm nhận thực tế từ các thí sinh và phụ huynh đã tin tưởng lựa chọn đồng hành cùng chúng tôi.
            </Paragraph>
          </div>
          <Row gutter={[24, 24]} justify="center">
            {testimonialsData.map((testimonial: TestimonialCardProps, index: number) => (
              <Col xs={24} sm={24} md={12} lg={8} key={index}>
                <TestimonialCard
                  quote={testimonial.quote}
                  name={testimonial.name}
                  role={testimonial.role}
                  avatarChar={testimonial.avatarChar}
                  avatarUrl={testimonial.avatarUrl}
                  rating={testimonial.rating}
                  bgColor={testimonial.bgColor}
                  icon={testimonial.icon}
                />
              </Col>
            ))}
          </Row>
          <div className="text-center mt-12">
            {/* <Button type="primary" size="large" className="view-all-testimonials-button">
              Xem thêm đánh giá
            </Button> */}
          </div>
        </div>
      </section>
      {/* Statistics Section - Enhanced Premium Design */}
      <section className="stats-enhanced-section relative py-24 lg:py-32 overflow-hidden" style={{ margin: '4rem 2rem', borderRadius: '24px' }}>
        {/* Enhanced Background with Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>        <div 
          className="absolute inset-0 opacity-25" 
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-indigo-900/70 to-purple-900/85"></div>
          {/* Enhanced Decorative Elements */}
        <div className="absolute inset-0 stats-bg-pattern opacity-30">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400/25 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-400/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-cyan-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
          <div className="absolute top-10 left-1/4 w-32 h-32 bg-pink-400/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
          <div className="absolute bottom-10 right-1/3 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '5s' }}></div>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.6'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3Ccircle cx='27' cy='7' r='2'/%3E%3Ccircle cx='47' cy='7' r='2'/%3E%3Ccircle cx='7' cy='27' r='2'/%3E%3Ccircle cx='27' cy='27' r='2'/%3E%3Ccircle cx='47' cy='27' r='2'/%3E%3Ccircle cx='7' cy='47' r='2'/%3E%3Ccircle cx='27' cy='47' r='2'/%3E%3Ccircle cx='47' cy='47' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }}></div>        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-20">
            {/* Enhanced Badge */}
            <div className="stats-enhanced-badge">
              <span className="stats-badge-icon">📊</span>
              <span className="stats-badge-text">THÀNH TÍCH ẤN TƯỢNG</span>
              <span className="stats-badge-icon">✨</span>
            </div>
            
            {/* Enhanced Title */}
            <Title level={2} className="stats-enhanced-title">
              <span className="stats-title-line1">Những Con Số</span>
              <br />
              <span className="stats-title-line2">Biết Nói</span>
            </Title>
            
            {/* Enhanced Subtitle */}
            <Paragraph className="stats-enhanced-subtitle">
              <strong>Minh chứng rõ ràng</strong> cho sự tin tưởng và hiệu quả mà hệ thống đã mang lại cho 
              <span className="stats-highlight-text"> hàng ngàn thí sinh</span> trên cả nước trong suốt những năm qua.
            </Paragraph>
          </div>            <div className="relative stats-cards-container">
            {/* Enhanced Stats Cards Grid */}
            <Row gutter={[32, 32]} className="items-stretch relative z-10" justify="center">
              {statsData.map((stat, index) => (
                <Col xs={24} sm={12} md={12} lg={6} key={index}>
                  <div className="stats-enhanced-card">
                    <div className="stats-card-inner">
                      <div className="stats-card-decoration"></div>
                      <div className="stats-card-icon">
                        {stat.icon}
                      </div>
                      <div className="stats-card-content">
                        <div className="stats-card-value">{stat.value}</div>
                        <div className="stats-card-label">{stat.title}</div>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
            
            {/* Connecting Lines */}
            <div className="stats-connecting-lines">
              <div className="stats-connecting-line"></div>
              <div className="stats-connecting-line"></div>
              <div className="stats-connecting-line"></div>
            </div>
          </div>
        </div>
      </section>      {/* Ngành học phổ biến - Banner */}
      <section className="py-16 lg:py-24 relative overflow-hidden" style={{ margin: '3rem 2rem' }}>
        <div className="container mx-auto px-6">          <div className="trending-section-header">            {/* Enhanced tagline */}
            <div className="trending-badge">
              <span className="trending-badge-icon">🔥</span>
              TRENDING NGÀNH HỌC
            </div>
              {/* Enhanced main title */}
            <Title level={1} className="trending-nganh-hoc-title">
              <span className="trending-title-line1">
                Ngành Học
              </span>
              <br />
              <span className="trending-title-line2">
                Phổ Biến
              </span>
            </Title>
            
            {/* Enhanced subtitle */}
            <Paragraph className="trending-nganh-hoc-subtitle">
              Tìm hiểu về các <span className="trending-hot-text">ngành học hot nhất</span> hiện nay và 
              <span className="trending-future-text"> cơ hội nghề nghiệp tương lai</span> đầy hứa hẹn
            </Paragraph>
            
            {/* Decorative elements */}
            <div className="trending-decorative-line">
              <div className="trending-line-left"></div>
              <div className="trending-star">✨</div>
              <div className="trending-line-right"></div>
            </div>
          </div>
          
          {/* Banner style cards */}
          <div className="banner-container mb-8">
            <div className="banner-slide" style={{ backgroundImage: `linear-gradient(to right, rgba(5, 150, 105, 0.85) 0%, rgba(16, 185, 129, 0.85) 100%), url(https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)` }}>
              <div className="banner-decorative-circle banner-circle-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              <div className="banner-decorative-circle banner-circle-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              
              <div className="banner-content">
                <div className="banner-text-container">
                  <div className="banner-badge">
                    <Briefcase size={14} className="banner-badge-icon" />
                    TOP NGÀNH HOT
                  </div>
                  <Title level={1} className="banner-title">Công Nghệ Thông Tin</Title>
                  <Paragraph className="banner-description">
                    Ngành CNTT mở ra cơ hội việc làm rộng lớn trong lĩnh vực phát triển phần mềm, AI, dữ liệu lớn và an ninh mạng.
                  </Paragraph>
                  <div className="flex items-center mb-4">
                    <div className="bg-white/20 px-4 py-2 rounded-full text-white font-semibold mr-4">
                      Điểm chuẩn: 22.5 - 28.0
                    </div>
                    <div className="bg-white/20 px-4 py-2 rounded-full text-white font-semibold">
                      Cơ hội việc làm: Cao
                    </div>
                  </div>
                  <div className="banner-buttons">
                    <Button 
                      type="primary" 
                      size="large"
                      className="banner-button banner-button-primary"
                      icon={<ArrowRightOutlined />}
                      onClick={() => navigate('/nganh-hoc/cong-nghe-thong-tin')}
                    >
                      Xem chi tiết
                    </Button>
                    <Button 
                      size="large"
                      className="banner-button banner-button-secondary"
                      onClick={() => navigate('/truong-dao-tao/cong-nghe-thong-tin')}
                    >
                      Trường đào tạo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="banner-container mb-8">
            <div className="banner-slide" style={{ backgroundImage: `linear-gradient(to right, rgba(217, 119, 6, 0.85) 0%, rgba(234, 88, 12, 0.85) 100%), url(https://images.unsplash.com/photo-1664575599736-c5197c684128?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)` }}>
              <div className="banner-decorative-circle banner-circle-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              <div className="banner-decorative-circle banner-circle-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              
              <div className="banner-content">
                <div className="banner-text-container">
                  <div className="banner-badge">
                    <TrendingUp size={14} className="banner-badge-icon" />
                    TRIỂN VỌNG CAO
                  </div>
                  <Title level={1} className="banner-title">Quản Trị Kinh Doanh</Title>
                  <Paragraph className="banner-description">
                    Trang bị kiến thức và kỹ năng quản lý, marketing, tài chính và phát triển chiến lược kinh doanh hiệu quả.
                  </Paragraph>
                  <div className="flex items-center mb-4">
                    <div className="bg-white/20 px-4 py-2 rounded-full text-white font-semibold mr-4">
                      Điểm chuẩn: 21.0 - 26.5
                    </div>
                    <div className="bg-white/20 px-4 py-2 rounded-full text-white font-semibold">
                      Nhu cầu: Rất cao
                    </div>
                  </div>
                  <div className="banner-buttons">
                    <Button 
                      type="primary" 
                      size="large"
                      className="banner-button banner-button-primary"
                      icon={<ArrowRightOutlined />}
                      onClick={() => navigate('/nganh-hoc/quan-tri-kinh-doanh')}
                    >
                      Xem chi tiết
                    </Button>
                    <Button 
                      size="large"
                      className="banner-button banner-button-secondary"
                      onClick={() => navigate('/truong-dao-tao/quan-tri-kinh-doanh')}
                    >
                      Trường đào tạo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="banner-container mb-8">
            <div className="banner-slide" style={{ backgroundImage: `linear-gradient(to right, rgba(220, 38, 38, 0.85) 0%, rgba(185, 28, 28, 0.85) 100%), url(https://images.unsplash.com/photo-1631217868264-e6036a81fbc1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1491&q=80)` }}>
              <div className="banner-decorative-circle banner-circle-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              <div className="banner-decorative-circle banner-circle-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              
              <div className="banner-content">
                <div className="banner-text-container">
                  <div className="banner-badge">
                    <Award size={14} className="banner-badge-icon" />
                    ĐIỂM CHUẨN CAO
                  </div>
                  <Title level={1} className="banner-title">Y Khoa</Title>
                  <Paragraph className="banner-description">
                    Đào tạo bác sĩ với kiến thức chuyên sâu về y học, kỹ năng khám chữa bệnh và đạo đức nghề nghiệp.
                  </Paragraph>
                  <div className="flex items-center mb-4">
                    <div className="bg-white/20 px-4 py-2 rounded-full text-white font-semibold mr-4">
                      Điểm chuẩn: 26.0 - 29.5
                    </div>
                    <div className="bg-white/20 px-4 py-2 rounded-full text-white font-semibold">
                      Thời gian học: 6 năm
                    </div>
                  </div>
                  <div className="banner-buttons">
                    <Button 
                      type="primary" 
                      size="large"
                      className="banner-button banner-button-primary"
                      icon={<ArrowRightOutlined />}
                      onClick={() => navigate('/nganh-hoc/y-khoa')}
                    >
                      Xem chi tiết
                    </Button>
                    <Button 
                      size="large"
                      className="banner-button banner-button-secondary"
                      onClick={() => navigate('/truong-dao-tao/y-khoa')}
                    >
                      Trường đào tạo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          
        </div>
      </section>      {/* Call to Action Section - Enhanced Premium */}
      <section className="cta-enhanced-section relative py-24 lg:py-40 overflow-hidden" style={{ margin: '4rem 2rem', borderRadius: '24px' }}>
        {/* Enhanced Background with Multiple Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-800/80 via-transparent to-purple-800/80"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 cta-bg-pattern opacity-20">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-yellow-300/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.8'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3Ccircle cx='27' cy='7' r='2'/%3E%3Ccircle cx='47' cy='7' r='2'/%3E%3Ccircle cx='7' cy='27' r='2'/%3E%3Ccircle cx='27' cy='27' r='2'/%3E%3Ccircle cx='47' cy='27' r='2'/%3E%3Ccircle cx='7' cy='47' r='2'/%3E%3Ccircle cx='27' cy='47' r='2'/%3E%3Ccircle cx='47' cy='47' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <Row align="middle" gutter={[48, 48]}>
            {/* Left Column - Content */}
            <Col xs={24} lg={14}>
              <div className="cta-content-container">
                {/* Enhanced Badge */}
                <div className="cta-enhanced-badge">
                  <span className="cta-badge-icon">🎓</span>
                  <span className="cta-badge-text">BƯỚC TIẾN MỚI TRONG GIÁO DỤC</span>
                  <span className="cta-badge-icon">✨</span>
                </div>

                {/* Enhanced Title */}
                <Title level={1} className="cta-enhanced-title">
                  <span className="cta-title-line1">Sẵn Sàng Chinh Phục</span>
                  <br />
                  <span className="cta-title-line2">Giấc Mơ Đại Học?</span>
                </Title>

                {/* Enhanced Description */}
                <div className="cta-description-container">
                  <Paragraph className="cta-enhanced-description">
                    <strong>Đừng để quy trình phức tạp cản bước bạn!</strong> Với hệ thống thông minh của chúng tôi, 
                    cánh cửa đại học <span className="cta-highlight-text">rộng mở hơn bao giờ hết</span>. 
                  </Paragraph>
                  <Paragraph className="cta-enhanced-description">
                    Hãy bắt đầu hành trình chinh phục ước mơ của bạn ngay hôm nay với 
                    <span className="cta-highlight-text"> công nghệ hiện đại nhất</span>!
                  </Paragraph>
                </div>

                {/* Enhanced Features List */}
                <div className="cta-features-list">
                  <div className="cta-feature-item">
                    <div className="cta-feature-icon">⚡</div>
                    <span>Nộp hồ sơ chỉ trong 5 phút</span>
                  </div>
                  <div className="cta-feature-item">
                    <div className="cta-feature-icon">🎯</div>
                    <span>AI tư vấn ngành học phù hợp</span>
                  </div>
                  <div className="cta-feature-item">
                    <div className="cta-feature-icon">📊</div>
                    <span>Theo dõi real-time 24/7</span>
                  </div>
                </div>

                {/* Enhanced Buttons */}
                <div className="cta-buttons-container">
                  <Button 
                    type="primary" 
                    size="large" 
                    className="cta-primary-button"
                    icon={<Sparkles className="cta-button-icon"/>}
                    onClick={handleNopHoSo}
                  >
                    <span className="cta-button-text">
                      {isAuthenticated && user?.role === 'candidate' ? 'Hoàn Tất Hồ Sơ Ngay!' : 'Đăng Ký Miễn Phí!'}
                    </span>
                  </Button>
                  <Button 
                    size="large" 
                    className="cta-secondary-button"
                    icon={<ArrowRightOutlined className="cta-button-icon"/>}
                    onClick={() => navigate('/universities')}
                  >
                    <span className="cta-button-text">Khám Phá Ngay</span>
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="cta-trust-indicators">
                  <div className="cta-trust-item">
                    <strong>100K+</strong> thí sinh tin dùng
                  </div>
                  <div className="cta-trust-divider">•</div>
                  <div className="cta-trust-item">
                    <strong>200+</strong> trường đại học
                  </div>
                  <div className="cta-trust-divider">•</div>
                  <div className="cta-trust-item">
                    <strong>99%</strong> thành công
                  </div>
                </div>
              </div>
            </Col>

            {/* Right Column - Image */}
            <Col xs={24} lg={10}>
              <div className="cta-image-container">
                <div className="cta-image-wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                    alt="Sinh viên thành công" 
                    className="cta-main-image"
                  />
                  {/* Floating Success Cards */}
                  <div className="cta-floating-card cta-card-1">
                    <div className="cta-card-icon">🎉</div>
                    <div className="cta-card-content">
                      <div className="cta-card-title">Hồ sơ đã nộp</div>
                      <div className="cta-card-value">50,000+</div>
                    </div>
                  </div>
                  <div className="cta-floating-card cta-card-2">
                    <div className="cta-card-icon">⭐</div>
                    <div className="cta-card-content">
                      <div className="cta-card-title">Đánh giá</div>
                      <div className="cta-card-value">4.9/5</div>
                    </div>
                  </div>
                  <div className="cta-floating-card cta-card-3">
                    <div className="cta-card-icon">🚀</div>
                    <div className="cta-card-content">
                      <div className="cta-card-title">Tỷ lệ thành công</div>
                      <div className="cta-card-value">99%</div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-800 text-gray-400 text-center">
        <div className="container mx-auto px-6">
          <Paragraph className="text-sm">
            {/* Footer content can be added here */}
          </Paragraph>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;