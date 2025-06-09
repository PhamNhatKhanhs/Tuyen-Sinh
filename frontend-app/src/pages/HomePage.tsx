import React from 'react';
import { Typography, Button, Row, Col, Space, Badge, Avatar } from 'antd'; // Added Avatar
import './HomePage.css';
import './BorderStyles.css';
import './HeroSection.css';
import './ElegantStyles.css';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowRightOutlined, FormOutlined, 
    BookOutlined, 
    BankOutlined, SolutionOutlined, 
    CalendarOutlined, 
    EnvironmentOutlined,
    GlobalOutlined,
    StarFilled
} from '@ant-design/icons';
import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated, selectUser } from '../features/auth/store/authSlice';
import type { User } from '../features/auth/types';
import { 
    MessageSquare, 
    Heart,         
    ThumbsUp,      
    BookOpen, ShieldCheck, Zap, Award, TrendingUp, 
    ChevronRight, Sparkles, Star, Users, Crown, GraduationCap, Briefcase // Added Briefcase, GraduationCap
} from 'lucide-react'; 
import Banner from '../components/banner/Banner';
import classNames from 'classnames'; // Re-added classNames import

const { Title, Paragraph, Text } = Typography;

// Super Enhanced BenefitCard với nhiều màu sắc và hiệu ứng
interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass?: string;
  accentColor?: string;
}
const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description, colorClass, accentColor = 'from-pink-500 to-rose-500' }) => (
  <div className="group relative overflow-hidden rounded-xl h-full">
    {/* Enhanced background gradient with better opacity transitions */}
    <div className={`absolute inset-0 bg-gradient-to-br ${accentColor} opacity-5 group-hover:opacity-15 transition-all duration-700`}></div>
    
    {/* Main card with glass morphism effect */}
    <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-xl h-full flex flex-col border border-white/80 shadow-xl transition-all duration-500 group-hover:shadow-2xl">
      {/* Sparkle effects on hover with improved positioning */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-700 transform rotate-0 group-hover:rotate-45">
        <Sparkles className="text-pink-400 w-6 h-6 animate-pulse" />
      </div>
      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-300"> 
        <Sparkles className="text-purple-400 w-4 h-4 animate-bounce" />
      </div>
      
      {/* Enhanced glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-700"></div>
      
      {/* Icon container with improved visual effects */}
      <div className="relative z-10 mx-auto mb-8">
        <div className={`w-28 h-28 rounded-2xl flex items-center justify-center text-white shadow-2xl ${colorClass || 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative overflow-hidden`}>
          {/* Inner glow effect */}
          <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Icon with enhanced size */}
          <div className="text-5xl relative z-10 transform transition-transform duration-500 group-hover:scale-110">{icon}</div>
          
          {/* Shine effect animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      </div>
      
      {/* Content with improved typography and spacing */}
      <div className="relative z-10 text-center flex-grow">
        <Title level={4} className="!text-2xl !font-bold !mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-500">
          {title}
        </Title>
        <Paragraph className="text-gray-600 text-base leading-relaxed group-hover:text-gray-700">
          {description}
        </Paragraph>
      </div>
      
      {/* Enhanced decorative elements with better positioning and animations */}
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-pink-200/40 to-purple-200/40 rounded-full group-hover:scale-[2] group-hover:rotate-180 transition-all duration-1000"></div>
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-blue-200/40 to-indigo-200/40 rounded-full group-hover:scale-[1.75] group-hover:-rotate-90 transition-all duration-1000 delay-200"></div>
    </div>
  </div>
);

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

// Enhanced FeatureCard
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  linkTo?: string;
  linkText?: string;
  onClick?: () => void;
}> = ({ icon, title, description, linkTo, linkText, onClick }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (onClick) onClick();
    else if (linkTo) navigate(linkTo);
  };
  return (
    <div 
      className="feature-card"
      onClick={handleClick} 
      role={linkTo || onClick ? "button" : undefined} 
      tabIndex={linkTo || onClick ? 0 : undefined}
      onKeyDown={(e) => { if (e.key === 'Enter' && (linkTo || onClick)) handleClick();}}
    >
      <div className="card-content">
        <div className="card-icon-wrapper">
          <div className="card-icon">{icon}</div>
        </div>
        <div className="card-body">
          <Title level={4} className="card-title">
            {title}
          </Title>
          <Paragraph className="card-description">
            {description}
          </Paragraph>
        </div>
        {(linkTo || onClick) && (
          <div className="card-footer">
            <div className="card-link">
              <span>{linkText || 'Tìm hiểu thêm'}</span>
              <ChevronRight className="card-link-icon" size={18} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Colorful StatCard - Rewritten for Custom CSS
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => (
  <div className="custom-stat-card">
    <div className="custom-stat-card-icon-wrapper">
      {icon}
    </div>
    <Text className="custom-stat-card-value">{value}</Text>
    <Paragraph className="custom-stat-card-title">{title}</Paragraph>
  </div>
);

// Placeholder for SectionTitle component
interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, className }) => (
  <div className={classNames("section-title-wrapper", className)}> {/* Changed class for clarity */}
    <Title level={2} className="section-title-main-heading"> {/* Added specific class */}
      {title}
    </Title>
    {subtitle && <Paragraph className="section-title-subheading">{subtitle}</Paragraph>} {/* Changed to a more specific class */}
  </div>
);

// Placeholder for benefitsData
const benefitsData: BenefitCardProps[] = [
  { icon: <Zap />, title: "Lợi ích 1", description: "Mô tả lợi ích 1", colorClass: "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600" },
  { icon: <BookOpen />, title: "Lợi ích 2", description: "Mô tả lợi ích 2", colorClass: "bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600" },
  { icon: <TrendingUp />, title: "Lợi ích 3", description: "Mô tả lợi ích 3", colorClass: "bg-gradient-to-br from-purple-400 via-violet-500 to-pink-600" },
  { icon: <ShieldCheck />, title: "Lợi ích 4", description: "Mô tả lợi ích 4", colorClass: "bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600" },
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
  ];

  const whyChooseUsFeatures = [
    { icon: <Zap />, title: "Nộp Hồ Sơ Nhanh Chóng", description: "Quy trình trực tuyến tinh gọn, tiết kiệm thời gian tối đa cho thí sinh và phụ huynh với giao diện thân thiện.", colorClass: "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600", accentColor: "from-green-400 to-emerald-500", linkTo: !isAuthenticated ? "/auth/register" : (user?.role === 'candidate' ? "/candidate/submit-application" : undefined), linkText: "Nộp hồ sơ ngay" },
    { icon: <BookOpen />, title: "Thông Tin Đa Dạng", description: "Cập nhật liên tục thông tin tuyển sinh, chỉ tiêu, điểm chuẩn từ hàng trăm trường đại học uy tín trên cả nước.", colorClass: "bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600", accentColor: "from-blue-400 to-indigo-500", linkTo: "/universities", linkText: "Khám phá các trường" },
    { icon: <TrendingUp />, title: "Theo Dõi Trực Quan", description: "Dễ dàng theo dõi trạng thái xử lý hồ sơ và nhận thông báo kết quả nhanh nhất qua hệ thống thông minh.", colorClass: "bg-gradient-to-br from-purple-400 via-violet-500 to-pink-600", accentColor: "from-purple-400 to-violet-500", linkTo: isAuthenticated && user?.role === 'candidate' ? "/candidate/my-applications" : "/auth/login", linkText: "Kiểm tra hồ sơ" },
    { icon: <ShieldCheck />, title: "Bảo Mật Tuyệt Đối", description: "Thông tin cá nhân và hồ sơ được mã hóa, bảo vệ an toàn theo tiêu chuẩn bảo mật quốc tế cao nhất.", colorClass: "bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600", accentColor: "from-teal-400 to-cyan-500" },
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
                  onClick={() => navigate('/university')}
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
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 lg:py-24 why-choose-us-section"> {/* Added why-choose-us-section class */}
        <div className="container mx-auto px-6">
          <SectionTitle 
            title="Tại Sao Chọn Hệ Thống Của Chúng Tôi?"
            subtitle="Trải nghiệm tuyển sinh trực tuyến toàn diện, dễ dàng tiếp cận cơ hội học tập tại các trường đại học hàng đầu với những ưu điểm vượt trội."
          />
          <Row gutter={[32, 40]}> {/* Increased gutter for more spacing */}
            {whyChooseUsFeatures.map((item, index) => (
              <Col xs={24} sm={12} md={8} key={index}> {/* Changed to 12 for sm, 8 for md/lg for 2/3 columns */}
                <FeatureCard {...item} />
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Sự kiện sắp diễn ra */}
      <section className="py-16 lg:py-20 relative overflow-hidden upcoming-events-section" style={{ margin: '3rem 2rem', border: '2px solid #fbcfe8', borderRadius: '16px', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 z-0"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400 opacity-70"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400 opacity-70"></div>
        
        {/* Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-pink-200/20 to-rose-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-rose-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Title level={2} className="!mb-6 !leading-tight upcoming-event-title">
              Sự Kiện Tuyển Sinh 2025
            </Title>
            <Paragraph className="max-w-2xl mx-auto upcoming-event-subtitle">
              Tham gia các sự kiện tuyển sinh để cập nhật thông tin mới nhất và gặp gỡ đại diện các trường đại học
            </Paragraph>
          </div>
          
          {/* Sự kiện 1 - Banner style */}
          <div className="banner-container mb-8">
            <div className="banner-slide" style={{ backgroundImage: `linear-gradient(to right, rgba(219, 39, 119, 0.85) 0%, rgba(236, 72, 153, 0.85) 100%), url(https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)` }}>
              {/* Decorative elements */}
              <div className="banner-decorative-circle banner-circle-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              <div className="banner-decorative-circle banner-circle-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              
              <div className="banner-content">
                <div className="banner-text-container">
                  <div className="banner-badge">
                    <CalendarOutlined className="banner-badge-icon" />
                    SỰ KIỆN NỔI BẬT
                  </div>
                  <Title level={1} className="banner-title">Ngày Hội Tư Vấn Tuyển Sinh</Title>
                  <Paragraph className="banner-description">
                    Sự kiện quy tụ hơn 50 trường đại học hàng đầu, cung cấp thông tin tuyển sinh và tư vấn trực tiếp.
                  </Paragraph>
                  <div className="flex items-center mb-4">
                    <div className="bg-white/20 px-4 py-2 rounded-full text-white font-semibold mr-4">
                      <CalendarOutlined className="mr-2" /> 10/06/2025 (8:00 - 17:00)
                    </div>
                    <div className="bg-white/20 px-4 py-2 rounded-full text-white font-semibold">
                      <EnvironmentOutlined className="mr-2" /> TP. Hồ Chí Minh
                    </div>
                  </div>
                  <div className="banner-buttons">
                    <Button 
                      type="primary" 
                      size="large"
                      className="banner-button banner-button-primary"
                      icon={<ArrowRightOutlined />}
                      onClick={() => navigate('/su-kien/ngay-hoi-tu-van')}
                    >
                      Xem chi tiết
                    </Button>
                    <Button 
                      size="large"
                      className="banner-button banner-button-secondary"
                      onClick={() => navigate('/dang-ky-su-kien/ngay-hoi-tu-van')}
                    >
                      Đăng ký tham gia
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sự kiện 2 - Banner style */}
          <div className="banner-container mb-8">
            <div className="banner-slide" style={{ backgroundImage: `linear-gradient(to right, rgba(37, 99, 235, 0.85) 0%, rgba(59, 130, 246, 0.85) 100%), url(https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)` }}>
              {/* Decorative elements */}
              <div className="banner-decorative-circle banner-circle-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              <div className="banner-decorative-circle banner-circle-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              
              <div className="banner-content">
                <div className="banner-text-container">
                  <div className="banner-badge">
                    <GlobalOutlined className="banner-badge-icon" />
                    TRỰC TUYẾN
                  </div>
                  <Title level={1} className="banner-title">Webinar: Chọn Ngành Đúng</Title>
                  <Paragraph className="banner-description">
                    Chuyên gia tư vấn hướng nghiệp sẽ chia sẻ phương pháp chọn ngành phù hợp với năng lực và sở thích.
                  </Paragraph>
                  <div className="flex items-center mb-4">
                    <div className="bg-white/20 px-4 py-2 rounded-full text-white font-semibold mr-4">
                      <CalendarOutlined className="mr-2" /> 25/05/2025 (19:30 - 21:00)
                    </div>
                    <div className="bg-white/20 px-4 py-2 rounded-full text-white font-semibold">
                      <GlobalOutlined className="mr-2" /> Zoom & Facebook
                    </div>
                  </div>
                  <div className="banner-buttons">
                    <Button 
                      type="primary" 
                      size="large"
                      className="banner-button banner-button-primary"
                      icon={<ArrowRightOutlined />}
                      onClick={() => navigate('/su-kien/webinar-chon-nganh')}
                    >
                      Xem chi tiết
                    </Button>
                    <Button 
                      size="large"
                      className="banner-button banner-button-secondary"
                      onClick={() => navigate('/dang-ky-su-kien/webinar-chon-nganh')}
                    >
                      Đăng ký tham gia
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sự kiện 3 - Banner style */}
          <div className="banner-container mb-8">
            <div className="banner-slide" style={{ backgroundImage: `linear-gradient(to right, rgba(124, 58, 237, 0.85) 0%, rgba(139, 92, 246, 0.85) 100%), url(https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80)` }}>
              {/* Decorative elements */}
              <div className="banner-decorative-circle banner-circle-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              <div className="banner-decorative-circle banner-circle-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              
              <div className="banner-content">
                <div className="banner-text-container">
                  <div className="banner-badge">
                    <Star size={14} className="banner-badge-icon" />
                    MIỄN PHÍ
                  </div>
                  <Title level={1} className="banner-title">Workshop Kỹ Năng Phỏng Vấn</Title>
                  <Paragraph className="banner-description">
                    Tập huấn kỹ năng trả lời phỏng vấn, chuẩn bị hồ sơ và các bí quyết để trúng tuyển vào trường mong muốn.
                  </Paragraph>
                  <div className="flex items-center mb-4">
                    <div className="bg-white/20 px-4 py-2 rounded-full text-white font-semibold mr-4">
                      <CalendarOutlined className="mr-2" /> 15/06/2025 (14:00 - 17:00)
                    </div>
                    <div className="bg-white/20 px-4 py-2 rounded-full text-white font-semibold">
                      <EnvironmentOutlined className="mr-2" /> Hà Nội
                    </div>
                  </div>
                  <div className="banner-buttons">
                    <Button 
                      type="primary" 
                      size="large"
                      className="banner-button banner-button-primary"
                      icon={<ArrowRightOutlined />}
                      onClick={() => navigate('/su-kien/workshop-ky-nang')}
                    >
                      Xem chi tiết
                    </Button>
                    <Button 
                      size="large"
                      className="banner-button banner-button-secondary"
                      onClick={() => navigate('/dang-ky-su-kien/workshop-ky-nang')}
                    >
                      Đăng ký tham gia
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Banner xem tất cả sự kiện */}
          <div className="banner-container">
            <div className="banner-slide" style={{ backgroundImage: `linear-gradient(to right, rgba(190, 24, 93, 0.9) 0%, rgba(219, 39, 119, 0.9) 100%), url(https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)`, height: '400px' }}>
              {/* Decorative elements */}
              <div className="banner-decorative-circle banner-circle-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              <div className="banner-decorative-circle banner-circle-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              <div className="banner-decorative-circle banner-circle-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              
              <div className="banner-content">
                <div className="banner-text-container">
                  <div className="banner-badge">
                    <CalendarOutlined className="banner-badge-icon" />
                    SỰ KIỆN 2025
                  </div>
                  <Title level={1} className="banner-title">Xem Tất Cả Sự Kiện Tuyển Sinh</Title>
                  <Paragraph className="banner-description">
                    Cập nhật lịch trình và đăng ký tham gia các sự kiện tuyển sinh trên toàn quốc. Tham gia các sự kiện để cập nhật thông tin mới nhất và gặp gỡ đại diện các trường đại học.
                  </Paragraph>
                  <div className="banner-buttons">
                    <Button 
                      type="primary" 
                      size="large"
                      className="banner-button banner-button-primary"
                      icon={<ArrowRightOutlined />}
                      onClick={() => navigate('/su-kien')}
                    >
                      Xem Lịch Sự Kiện
                    </Button>
                    <Button 
                      size="large"
                      className="banner-button banner-button-secondary"
                      onClick={() => navigate('/dang-ky-thong-bao')}
                    >
                      Đăng ký nhận thông báo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 testimonials-section"> {/* Removed bg-gray-100 */}
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <Paragraph className="testimonials-section-tagline">
              Đánh giá từ người dùng
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

      {/* Benefits Section - Enhanced Modern Design */}
      <section className="py-20 lg:py-28 relative overflow-hidden" style={{ margin: '5rem 2rem', backgroundColor: 'transparent' }}>
        {/* Background Elements - Animated Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-purple-50/80 to-pink-50/80 z-0 animate-gradientShift" style={{ backgroundSize: '200% 200%' }}></div>
        
        {/* Decorative Elements - Enhanced with Animation */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-float" style={{ animationDuration: '15s' }}></div>
        <div className="absolute -bottom-40 -left-20 w-112 h-112 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl animate-floatSlow" style={{ animationDuration: '20s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-br from-pink-200/40 to-purple-200/40 rounded-full blur-xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-indigo-200/40 to-blue-200/40 rounded-full blur-lg animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            {/* Enhanced Badge with Animation */}
            <div className="inline-block relative mb-8 animate-fadeInUp" style={{ animationDuration: '0.8s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-md rounded-full"></div>
              <Badge 
                count={
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-lg animate-pulse" style={{ animationDuration: '3s' }}>
                    <Crown size={16} className="text-white" />
                  </div>
                } 
                className="custom-hero-badge"
                offset={[0, 0]}
              >
                <span className="text-sm font-semibold text-indigo-700 uppercase tracking-wider px-6 py-3 bg-white rounded-full border border-indigo-100 shadow-sm flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                  Đặc quyền dành cho bạn
                  <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                </span>
              </Badge>
            </div>
            
            {/* Enhanced Title with Animation */}
            <div className="animate-fadeInUp" style={{ animationDuration: '1s', animationDelay: '0.2s' }}>
              <Title level={2} className="!text-5xl md:!text-6xl !font-extrabold !mb-6 !leading-tight relative inline-block">
                <span className="relative z-10">Lợi Ích</span>
                <span className="relative">
                  <span className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-lg rounded-lg"></span>
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-shimmer" style={{ backgroundSize: '200% 100%', animationDuration: '3s' }}>Vượt Trội</span>
                </span>
              </Title>
            </div>
            
            {/* Enhanced Description with Animation */}
            <Paragraph className="text-xl text-gray-600 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDuration: '1.2s', animationDelay: '0.4s' }}>
              Chúng tôi không chỉ giúp bạn nộp hồ sơ, mà còn mang đến những giá trị cộng thêm độc đáo và hữu ích cho hành trình học tập của bạn.
            </Paragraph>
          </div>
          
          {/* Enhanced Benefits Card Layout */}
          <div className="relative">
            {/* Connecting line between cards */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-200 to-transparent hidden lg:block"></div>
            
            <Row gutter={[32, 32]} className="items-stretch">
              {benefitsData.map((item: BenefitCardProps, index: number) => ( // Explicitly typed item and index
                <Col xs={24} sm={12} lg={6} key={index} className="animate-fadeInUp" style={{ animationDuration: '1.5s', animationDelay: `${0.2 + index * 0.2}s` }}>
                  <div className="group relative h-full transform transition-all duration-500 hover:translate-y-[-8px]">
                    {/* Correctly call BenefitCard with item props */}
                    <BenefitCard {...item} />
                  </div>
                </Col>
              ))}
            </Row>
          </div>
          
          {/* Banner giữa trang - Trường đại học nổi bật */}
          <div className="mt-20 mb-10">
            <div className="banner-container">
              <div className="banner-slide" style={{ backgroundImage: `linear-gradient(to right, rgba(79, 70, 229, 0.85) 0%, rgba(45, 212, 191, 0.85) 100%), url(https://images.unsplash.com/photo-1523050854058-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)` }}>
                {/* Decorative elements */}
                <div className="banner-decorative-circle banner-circle-1"></div>
                <div className="banner-decorative-circle banner-circle-2"></div>
                <div className="banner-decorative-circle banner-circle-3"></div>
                
                <div className="banner-content">
                  <div className="banner-text-container">
                    <div className="banner-badge">
                      <Star size={14} className="banner-badge-icon" />
                      TRƯỜNG ĐẠI HỌC NỔI BẬT
                    </div>
                    <Title level={1} className="banner-title">Khám Phá Top Trường Đại Học Hàng Đầu</Title>
                    <Paragraph className="banner-description">
                      Tìm hiểu thông tin chi tiết về các trường đại học uy tín, chương trình đào tạo và cơ hội nghề nghiệp.
                    </Paragraph>
                    <div className="banner-buttons">
                      <Button 
                        type="primary" 
                        size="large"
                        className="banner-button banner-button-primary"
                        icon={<ArrowRightOutlined />}
                        onClick={() => navigate('/universities')}
                      >
                        Xem Tất Cả Trường Đại Học
                      </Button>
                      <Button 
                        size="large"
                        className="banner-button banner-button-secondary"
                        onClick={() => navigate('/top-truong-dai-hoc')}
                      >
                        Top 10 Trường
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section - Clean Design */}
      <section className="py-20 lg:py-28 relative overflow-hidden stats-display-section" style={{ border: '2px solid #bfdbfe', borderRadius: '16px', margin: '3rem 2rem', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 z-0"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 opacity-70"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 opacity-70"></div>
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-gradient-to-br from-sky-200/30 to-cyan-200/30 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            {/* REMOVED Badge component */}
            <Title level={2} className="!text-4xl md:!text-5xl !font-extrabold !text-gray-800 !mb-6 !leading-tight stats-section-title">
              Những Con Số <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Biết Nói</span>
            </Title>
            {/* ADDED custom class stats-section-subtitle */}
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto stats-section-subtitle">
              Minh chứng cho sự tin tưởng và hiệu quả mà hệ thống đã mang lại cho hàng ngàn thí sinh trên cả nước.
            </Paragraph>
          </div>
          
          <div className="relative">
            {/* Connecting lines between stats - kept for context, might need removal if cards are full width vertical */}
            {/* <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-100 via-indigo-200 to-blue-100 hidden lg:block"></div> */}
            
            {/* MODIFIED: Removed justify-center from Row */}
            <Row gutter={[32, 48]} className="items-stretch relative z-10">
              {statsData.map((stat, index) => (
                // MODIFIED: Col spans for full vertical stacking, removed flex justify-center
                <Col xs={24} sm={12} md={12} lg={6} key={index}>
                  <StatCard icon={stat.icon} title={stat.title} value={stat.value} />
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </section>

      {/* Ngành học phổ biến - Banner */}
      <section className="py-16 lg:py-24 relative overflow-hidden" style={{ margin: '3rem 2rem' }}>
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge count={<GraduationCap size={16} className="text-green-500" />} className="mb-6">
              <span className="text-sm font-semibold text-green-600 uppercase tracking-wider px-4 py-2 bg-green-50 rounded-full">Khám phá ngành học</span>
            </Badge>
            <Title level={2} className="!text-4xl md:!text-5xl !font-extrabold !text-gray-800 !mb-6 !leading-tight">
              Ngành Học <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">Phổ Biến</span>
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tìm hiểu về các ngành học hot nhất hiện nay và cơ hội nghề nghiệp tương lai
            </Paragraph>
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
          
          <div className="banner-container">
            <div className="banner-slide" style={{ backgroundImage: `linear-gradient(to right, rgba(6, 95, 70, 0.9) 0%, rgba(4, 120, 87, 0.9) 100%), url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)`, height: '400px' }}>
              <div className="banner-decorative-circle banner-circle-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              <div className="banner-decorative-circle banner-circle-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              <div className="banner-decorative-circle banner-circle-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              
              <div className="banner-content">
                <div className="banner-text-container">
                  <div className="banner-badge">
                    <BookOpen size={14} className="banner-badge-icon" />
                    100+ NGÀNH HỌC
                  </div>
                  <Title level={1} className="banner-title">Khám Phá Tất Cả Ngành Học</Title>
                  <Paragraph className="banner-description">
                    Tìm hiểu chi tiết về hơn 100+ ngành học tại các trường đại học hàng đầu Việt Nam. So sánh điểm chuẩn, chương trình đào tạo và cơ hội nghề nghiệp.
                  </Paragraph>
                  <div className="banner-buttons">
                    <Button 
                      type="primary" 
                      size="large"
                      className="banner-button banner-button-primary"
                      icon={<ArrowRightOutlined />}
                      onClick={() => navigate('/nganh-hoc')}
                    >
                      Xem Tất Cả Ngành Học
                    </Button>
                    <Button 
                      size="large"
                      className="banner-button banner-button-secondary"
                      onClick={() => navigate('/tu-van-chon-nganh')}
                    >
                      Tư vấn chọn ngành
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section - Premium */}
      <section className="premium-section premium-gradient-blue premium-shadow-lg relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 premium-bg-pattern">
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>
        <div className="premium-container text-center relative z-10">
          <Title level={2} className="premium-section-title !text-4xl lg:!text-5xl !font-bold !text-white !mb-8">
            Sẵn Sàng Chinh Phục Giấc Mơ Đại Học?
          </Title>
          <Paragraph className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Đừng để quy trình phức tạp cản bước bạn! Với hệ thống của chúng tôi, cánh cửa đại học rộng mở hơn bao giờ hết. 
            Hãy bắt đầu hành trình của bạn ngay hôm nay!
          </Paragraph>
          <Button 
            type="primary" 
            size="large" 
            className="premium-button premium-button-primary !rounded-lg !px-8 !font-semibold !h-14 !text-lg flex items-center justify-center premium-shadow-md"
            icon={<Sparkles className="mr-2"/>}
            onClick={handleNopHoSo}
          >
            {isAuthenticated && user?.role === 'candidate' ? 'Hoàn Tất Hồ Sơ Ngay!' : 'Đăng Ký Miễn Phí!'}
          </Button>
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