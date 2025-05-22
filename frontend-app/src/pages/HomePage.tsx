import React from 'react';
import { Typography, Button, Row, Col, Card, Avatar, Statistic, Space, Badge } from 'antd';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowRightOutlined, FormOutlined, UserOutlined, DashboardOutlined, ReadOutlined, 
    CheckCircleOutlined, TeamOutlined, MessageOutlined, StarFilled, LikeOutlined,
    BookOutlined, 
    SafetyCertificateOutlined, RocketOutlined, RiseOutlined,
    BankOutlined, SolutionOutlined, LoginOutlined, SnippetsOutlined,
    InfoCircleOutlined, QuestionCircleOutlined, CalendarOutlined, GlobalOutlined,
    MailOutlined, PhoneOutlined, SearchOutlined
} from '@ant-design/icons';
import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated, selectUser, User } from '../features/auth/store/authSlice';
import { 
    Briefcase, BookOpen, Users, ShieldCheck, Zap, Award, TrendingUp, MessageSquare, 
    Users2, Target, BarChart2, Newspaper, MessageCircleQuestion, GraduationCap, 
    BookOpenCheck, Star, ChevronRight, Sparkles, Crown, Flame, Heart 
} from 'lucide-react';
import Banner from '../components/banner/Banner'; 

const { Title, Paragraph, Text, Link: AntLink } = Typography;

// Super Enhanced BenefitCard với nhiều màu sắc và hiệu ứng
interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass?: string;
  accentColor?: string;
}
const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description, colorClass, accentColor = 'from-pink-500 to-rose-500' }) => (
  <div className="group relative overflow-hidden rounded-3xl h-full">
    <div className={`absolute inset-0 bg-gradient-to-br ${accentColor} opacity-5 group-hover:opacity-10 transition-opacity duration-700`}></div>
    <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:shadow-pink-500/25 transition-all duration-700 transform hover:-translate-y-3 hover:scale-105 h-full flex flex-col border-2 border-transparent hover:border-pink-200/50">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <Sparkles className="text-pink-400 w-6 h-6 animate-pulse" />
      </div>
      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-300"> {/* Cần Tailwind plugin cho delay nếu không có sẵn */}
        <Sparkles className="text-purple-400 w-4 h-4 animate-bounce" />
      </div>
      <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-1000"></div>
      <div className="relative z-10 mx-auto mb-6">
        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-white shadow-2xl ${colorClass || 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="text-4xl relative z-10">{icon}</div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      </div>
      <div className="relative z-10 text-center flex-grow">
        <Title level={4} className="!text-xl !font-bold !mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-500">
          {title}
        </Title>
        <Paragraph className="text-gray-600 text-base leading-relaxed group-hover:text-gray-700">
          {description}
        </Paragraph>
      </div>
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full group-hover:scale-150 group-hover:rotate-180 transition-all duration-1000"></div>
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full group-hover:scale-125 group-hover:-rotate-90 transition-all duration-1000 delay-200"></div> {/* Cần Tailwind plugin cho delay */}
    </div>
  </div>
);

// Enhanced TestimonialCard với nhiều màu sắc
interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatarUrl?: string;
  rating?: number;
  bgGradient?: string;
}
const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, role, avatarUrl, rating = 5, bgGradient = 'from-indigo-500 to-purple-600' }) => (
  <div className="group relative overflow-hidden rounded-3xl h-full">
    <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-5 group-hover:opacity-10 transition-opacity duration-700`}></div>
    <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/25 transition-all duration-700 transform hover:-translate-y-2 hover:scale-105 h-full flex flex-col border-2 border-transparent hover:border-purple-200/50">
      <div className="absolute top-6 right-6 text-6xl text-purple-100 group-hover:text-purple-200 transition-colors duration-500 font-serif">"</div>
      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <Heart className="text-red-400 w-5 h-5 animate-pulse" />
      </div>
      <div className="flex items-center mb-6 relative z-10">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={18} className="text-yellow-400 fill-yellow-400 group-hover:animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
        ))}
        <Crown className="text-yellow-500 w-4 h-4 ml-2 group-hover:animate-bounce" />
      </div>
      <Paragraph className="text-gray-700 italic text-lg mb-6 flex-grow leading-relaxed font-medium relative z-10 group-hover:text-gray-800 transition-colors">
        {quote}
      </Paragraph>
      <div className="flex items-center mt-auto pt-6 border-t border-purple-200/50 relative z-10">
        <div className="relative">
          <Avatar 
            src={avatarUrl || `https://placehold.co/64x64/E5E7EB/4B5563?text=${name.charAt(0)}`} 
            size={60} 
            icon={<UserOutlined />} 
            className="mr-4 shadow-xl border-4 border-white group-hover:border-purple-200 transition-all duration-500"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
        </div>
        <div>
          <Text strong className="block text-gray-800 text-base group-hover:text-purple-600 transition-colors">{name}</Text>
          <Text className="text-gray-500 text-sm font-medium">{role}</Text>
        </div>
      </div>
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full group-hover:scale-150 group-hover:rotate-45 transition-all duration-1000"></div>
    </div>
  </div>
);

// Super Enhanced FeatureCard
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
          <div className="card-icon">
            {icon}
          </div>
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
              <ChevronRight size={20} className="card-link-icon" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Colorful StatCard
const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  bgGradient?: string;
  iconColor?: string;
}> = ({ icon, title, value, bgGradient = 'from-blue-500 to-indigo-600', iconColor = 'text-blue-600' }) => (
  <div className="group relative overflow-hidden rounded-3xl h-full">
    <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-10 group-hover:opacity-20 transition-opacity duration-700`}></div>
    <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:shadow-blue-500/25 transition-all duration-700 transform hover:-translate-y-2 hover:scale-105 text-center border-2 border-transparent hover:border-blue-200/50 h-full flex flex-col justify-center">
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <Sparkles className="text-yellow-400 w-5 h-5 animate-spin" />
      </div>
      <div className="relative z-10">
        <div className={`text-5xl md:text-6xl mb-6 ${iconColor} group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`}>
          {icon}
        </div>
        <div className="text-4xl md:text-5xl font-bold mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-500">
          {value}
        </div>
        <div className="text-gray-600 font-medium text-lg group-hover:text-gray-700">
          {title}
        </div>
      </div>
      <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full group-hover:scale-150 group-hover:rotate-45 transition-all duration-1000"></div>
      <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full group-hover:scale-125 group-hover:-rotate-90 transition-all duration-1000 delay-300"></div> {/* Cần Tailwind plugin cho delay */}
    </div>
  </div>
);

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser) as User | null;

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
      buttonText: 'Nộp hồ sơ ngay',
      buttonLink: '/dashboard/ho-so',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      gradientColors: 'rgba(6, 182, 212, 0.8) 0%, rgba(59, 130, 246, 0.8) 100%'
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
    { title: 'Trường Đại Học', value: "200+", icon: <BankOutlined />, iconColor: 'text-blue-600', bgGradient: 'from-blue-400 to-cyan-400' },
    { title: 'Ngành Tuyển Sinh', value: "1,500+", icon: <SolutionOutlined />, iconColor: 'text-green-600', bgGradient: 'from-green-400 to-emerald-400' },
    { title: 'Hồ Sơ Đã Nộp', value: "50K+", icon: <FormOutlined />, iconColor: 'text-purple-600', bgGradient: 'from-purple-400 to-violet-400' },
    { title: 'Thí Sinh Tin Dùng', value: "100K+", icon: <Users2 />, iconColor: 'text-orange-600', bgGradient: 'from-orange-400 to-red-400' },
  ];

  const whyChooseUsItems = [
    { icon: <Zap />, title: "Nộp Hồ Sơ Nhanh Chóng", description: "Quy trình trực tuyến tinh gọn, tiết kiệm thời gian tối đa cho thí sinh và phụ huynh với giao diện thân thiện.", colorClass: "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600", accentColor: "from-green-400 to-emerald-500", linkTo: !isAuthenticated ? "/register" : (user?.role === 'candidate' ? "/candidate/submit-application" : undefined), linkText: "Nộp hồ sơ ngay" },
    { icon: <BookOpen />, title: "Thông Tin Đa Dạng", description: "Cập nhật liên tục thông tin tuyển sinh, chỉ tiêu, điểm chuẩn từ hàng trăm trường đại học uy tín trên cả nước.", colorClass: "bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600", accentColor: "from-blue-400 to-indigo-500", linkTo: "/universities", linkText: "Khám phá các trường" },
    { icon: <TrendingUp />, title: "Theo Dõi Trực Quan", description: "Dễ dàng theo dõi trạng thái xử lý hồ sơ và nhận thông báo kết quả nhanh nhất qua hệ thống thông minh.", colorClass: "bg-gradient-to-br from-purple-400 via-violet-500 to-pink-600", accentColor: "from-purple-400 to-violet-500", linkTo: isAuthenticated && user?.role === 'candidate' ? "/candidate/my-applications" : "/login", linkText: "Kiểm tra hồ sơ" },
    { icon: <ShieldCheck />, title: "Bảo Mật Tuyệt Đối", description: "Thông tin cá nhân và hồ sơ được mã hóa, bảo vệ an toàn theo tiêu chuẩn bảo mật quốc tế cao nhất.", colorClass: "bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600", accentColor: "from-teal-400 to-cyan-500" },
  ];

  const testimonials = [
    { quote: "Hệ thống rất dễ sử dụng và giúp tôi tiết kiệm rất nhiều thời gian trong việc nộp hồ sơ. Giao diện thân thiện và quy trình rõ ràng.", name: "Nguyễn Văn An", role: "Thí sinh K27", rating: 5, bgGradient: "from-blue-500 to-indigo-600", avatarUrl: "https://placehold.co/100x100/E2E8F0/4A5568?text=A" },
    { quote: "Thông tin về các trường đại học rất đầy đủ và cập nhật. Tôi có thể so sánh và lựa chọn trường phù hợp một cách dễ dàng.", name: "Trần Thị Bình", role: "Phụ huynh", rating: 5, bgGradient: "from-purple-500 to-pink-600", avatarUrl: "https://placehold.co/100x100/FEF2F2/B91C1C?text=B" },
    { quote: "Dịch vụ hỗ trợ tuyệt vời! Nhân viên tư vấn nhiệt tình và giải đáp mọi thắc mắc một cách chi tiết và chuyên nghiệp.", name: "Lê Minh Cường", role: "Thí sinh K26", rating: 4, bgGradient: "from-green-500 to-teal-600", avatarUrl: "https://placehold.co/100x100/EFF6FF/1D4ED8?text=C" }
  ];
  
  const benefitsData = [
    { icon: <Target />, title: "Tư Vấn Chuyên Nghiệp", description: "Đội ngũ chuyên gia giàu kinh nghiệm sẵn sàng hỗ trợ và tư vấn 24/7 để giúp bạn chọn ngành học phù hợp nhất.", colorClass: "bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600", accentColor: "from-rose-400 to-pink-500" },
    { icon: <BarChart2 />, title: "Phân Tích Thông Minh", description: "Hệ thống AI phân tích khả năng và đưa ra gợi ý trường-ngành phù hợp dựa trên điểm số và sở thích của bạn.", colorClass: "bg-gradient-to-br from-amber-400 via-orange-500 to-red-600", accentColor: "from-amber-400 to-orange-500" },
    { icon: <Newspaper />, title: "Cập Nhật Liên Tục", description: "Tin tức tuyển sinh, thông báo quan trọng được cập nhật theo thời gian thực từ các trường đại học.", colorClass: "bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600", accentColor: "from-emerald-400 to-green-500" },
    { icon: <MessageCircleQuestion />, title: "Hỗ Trợ Tận Tình", description: "Chatbot thông minh và đội ngũ hỗ trợ 24/7 giải đáp mọi thắc mắc về quy trình tuyển sinh một cách nhanh chóng.", colorClass: "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600", accentColor: "from-sky-400 to-blue-500" }
  ];

  const SectionTitle: React.FC<{ title: string, subtitle?: string }> = ({ title, subtitle }) => (
    <div className="text-center mb-16">
      <Title level={2} className="!text-4xl lg:!text-5xl !font-extrabold !text-gray-800 !mb-4">
        {title}
      </Title>
      {subtitle && <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</Paragraph>}
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-slate-50 via-stone-50 to-gray-100 min-h-screen">
      
      {/* Banner Section */}
      <Banner items={bannerItems} />
      
      {/* Modern Hero Section with Image Background */}
      <section className="relative text-white overflow-hidden hero-bg-section">
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')`,
          filter: 'brightness(0.4)'
        }}></div>
        
        {/* Overlay Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70 z-1"></div>
        
        {/* Animated Elements */}
        <div className="absolute inset-0 z-2">
          <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6 py-24 lg:py-40">
          <Row align="middle" className="min-h-[24rem]">
            <Col xs={24} lg={12} className="pr-0 lg:pr-12">
              <div className="text-center lg:text-left">
                <div className="mb-8">
                    <Badge count={<Flame size={14} className="mr-1" />} className="custom-hero-badge">
                        <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-2xl hover:shadow-yellow-500/25 transition-all duration-500 transform hover:scale-105">
                            <Flame size={18} className="mr-2 animate-pulse" />
                            Hệ thống tuyển sinh thông minh {new Date().getFullYear() + 1}
                        </div>
                    </Badge>
                </div>
                <Title level={1} className="!text-white !text-5xl lg:!text-7xl !font-black !mb-8 !leading-tight">
                  Nộp Hồ Sơ Đại Học{' '}
                  <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-pulse-slow">
                    Siêu Dễ Dàng
                  </span>
                </Title>
                <Paragraph className="text-xl lg:text-2xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                  🚀 Trải nghiệm hoàn toàn mới trong việc nộp hồ sơ tuyển sinh đại học. 
                  Nhanh chóng, tiện lợi và an toàn với công nghệ AI hiện đại nhất.
                </Paragraph>
                <Space size="large" className="flex-wrap justify-center lg:justify-start">
                  <Button 
                    type="primary" 
                    size="large" 
                    className="!bg-gradient-to-r !from-yellow-400 !to-orange-500 !text-white !border-none hover:!from-orange-500 hover:!to-red-500 !font-bold !px-10 !py-4 !text-lg !h-auto !rounded-2xl !shadow-2xl hover:!shadow-orange-500/50 !transition-all !duration-500 transform hover:scale-110"
                    icon={<RocketOutlined className="group-hover:animate-ping" />}
                    onClick={handleNopHoSo}
                  >
                    🎯 Bắt Đầu Nộp Hồ Sơ
                  </Button>
                  <Button 
                    size="large" 
                    className="!bg-white/20 !text-white !border-white/50 hover:!bg-white/30 !font-bold !px-10 !py-4 !text-lg !h-auto !rounded-2xl !backdrop-blur-sm !transition-all !duration-500 transform hover:scale-105"
                    icon={<SearchOutlined />}
                    onClick={() => navigate('/universities')}
                  >
                    Khám Phá Các Trường
                  </Button>
                </Space>
              </div>
            </Col>
            <Col xs={0} lg={12} className="flex items-center justify-center">
              <div className="relative">
                {/* Main student illustration */}
                <img 
                  src="https://img.freepik.com/free-vector/college-university-students-group-young-happy-people-standing-isolated-white-background_575670-66.jpg" 
                  alt="Student Journey" 
                  className="w-full max-w-md lg:max-w-lg z-10 relative transform transition-all duration-700 hover:scale-105"
                />
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-400/30 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-blue-400/30 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <SectionTitle 
            title="Tại Sao Chọn Hệ Thống Của Chúng Tôi?"
            subtitle="Trải nghiệm tuyển sinh trực tuyến toàn diện, dễ dàng tiếp cận cơ hội học tập tại các trường đại học hàng đầu với những ưu điểm vượt trội."
          />
          <Row gutter={[32, 32]}>
            {whyChooseUsItems.map((item, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <FeatureCard {...item} />
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <div className="container mx-auto px-6">
          <SectionTitle 
            title="Lợi Ích Vượt Trội"
            subtitle="Chúng tôi không chỉ giúp bạn nộp hồ sơ, mà còn mang đến những giá trị cộng thêm độc đáo và hữu ích."
          />
          <Row gutter={[32, 32]}>
            {benefitsData.map((item, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <BenefitCard {...item} />
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <SectionTitle 
            title="Những Con Số Biết Nói"
            subtitle="Minh chứng cho sự tin tưởng và hiệu quả mà hệ thống đã mang lại cho hàng ngàn thí sinh trên cả nước."
          />
          <Row gutter={[32, 32]}>
            {statsData.map((stat, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <StatCard {...stat} />
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50">
        <div className="container mx-auto px-6">
          <SectionTitle 
            title="Lắng Nghe Chia Sẻ"
            subtitle="Cảm nhận thực tế từ các thí sinh và phụ huynh đã tin tưởng lựa chọn đồng hành cùng chúng tôi."
          />
          <Row gutter={[32, 32]}>
            {testimonials.map((testimonial, index) => (
              <Col xs={24} md={12} lg={8} key={index}>
                <TestimonialCard {...testimonial} />
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Call to Action Section - Enhanced */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-purple-600 via-pink-600 to-red-700 text-white overflow-hidden">
        <div className="absolute inset-0">
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <Title level={2} className="!text-4xl lg:!text-5xl !font-black !text-white !mb-6">
            Sẵn Sàng Chinh Phục Giấc Mơ Đại Học?
          </Title>
          <Paragraph className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Đừng để quy trình phức tạp cản bước bạn! Với hệ thống của chúng tôi, cánh cửa đại học rộng mở hơn bao giờ hết. 
            Hãy bắt đầu hành trình của bạn ngay hôm nay!
          </Paragraph>
          <Button 
            type="primary" 
            size="large" 
            className="!bg-gradient-to-r !from-yellow-400 !to-orange-500 !text-white !border-none hover:!from-orange-500 hover:!to-red-500 !font-bold !px-12 !py-5 !text-xl !h-auto !rounded-2xl !shadow-2xl hover:!shadow-yellow-500/50 !transition-all !duration-500 transform hover:scale-110 hover:-translate-y-1"
            icon={<Sparkles className="mr-2"/>}
            onClick={handleNopHoSo}
          >
            {isAuthenticated && user?.role === 'candidate' ? 'Hoàn Tất Hồ Sơ Ngay!' : 'Đăng Ký Miễn Phí!'}
          </Button>
        </div>
      </section>

      {/* Footer (Simple Placeholder) */}
      <footer className="py-12 bg-gray-800 text-gray-400 text-center">
        <div className="container mx-auto px-6">
          <Paragraph className="!mb-2">
            &copy; {new Date().getFullYear()} Hệ Thống Tuyển Sinh Đại Học. All rights reserved.
          </Paragraph>
          <Paragraph className="text-sm">
            <AntLink href="/privacy-policy" className="!text-gray-400 hover:!text-white">Chính sách bảo mật</AntLink> | 
            <AntLink href="/terms-of-service" className="!text-gray-400 hover:!text-white ml-1">Điều khoản dịch vụ</AntLink>
          </Paragraph>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;