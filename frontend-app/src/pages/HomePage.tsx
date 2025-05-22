import React, { useState, useEffect } from 'react';
import { 
  Award, BookOpen, Users, ShieldCheck, Zap, TrendingUp,
  Sparkles, Rocket, Heart, Target, Clock, Users2, 
  Star, CheckCircle, Trophy, ArrowRight, Menu, X,
  GraduationCap, FileText, BarChart3, MessageCircle
} from 'lucide-react';

const FeatureCard = ({ icon, title, description, linkText, colorClass = 'bg-blue-50 text-blue-600', onClick }) => {
  return (
    <div 
      className={`group relative p-8 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col justify-between transform hover:-translate-y-2 hover:rotate-1 cursor-pointer border border-gray-100 hover:border-blue-200/40 overflow-hidden backdrop-blur-sm`}
      onClick={onClick}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out group-hover:h-full" />
      
      {/* Floating particles effect - Enhanced */}
      <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-blue-200/50 to-purple-300/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:animate-pulse" />
      <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-gradient-to-br from-cyan-200/40 to-indigo-300/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 group-hover:animate-pulse" />
      <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-gradient-to-br from-pink-200/40 to-blue-200/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 delay-150 group-hover:animate-pulse" />
      <div className="absolute bottom-1/3 right-0 w-4 h-4 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200 group-hover:animate-pulse" />
      
      <div className="relative z-10">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${colorClass} group-hover:scale-110 transition-all duration-500 shadow-md group-hover:shadow-lg border border-white/40 group-hover:border-white/80`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-3 leading-tight group-hover:tracking-wide">
          {title}
        </h3>
        <p className="text-gray-600 text-base flex-grow mb-6 leading-relaxed">{description}</p>
        <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
          {linkText || 'Tìm hiểu thêm'} 
          <ArrowRight className="ml-2 w-4 h-4 transition-all duration-300 group-hover:translate-x-2 group-hover:translate-y-[-2px] group-hover:rotate-[-10deg]" />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ number, label, icon }) => (
  <div className="text-center group">
    <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-3 group-hover:bg-white/20 transition-all duration-300 border border-white/5 group-hover:border-white/20 overflow-hidden shadow-glow">
      {/* Glowing effect - using shadow-glow class */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Decorative floating elements */}
      <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 float-animation" />
      <div className="absolute bottom-4 right-4 w-6 h-6 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 float-animation-delayed" />
      
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto rounded-full bg-white/10 border border-white/30 mb-4 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg pulse-slower">
          <div className="text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">
            {icon}
          </div>
        </div>
        <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300 group-hover:text-gradient-secondary">
          {number}
        </div>
        <div className="text-blue-100 text-sm uppercase tracking-wider font-semibold pulse-slow">{label}</div>
      </div>
    </div>
  </div>
);

const TestimonialCard = ({ name, role, content, avatar }) => (
  <div className="feature-card-hover relative p-8 group">
    {/* Decorative corner elements */}
    <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-primary-200 to-primary-400 rounded-full opacity-0 group-hover:opacity-50 transition-all duration-700 blur-md float-animation"></div>
    <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-accent-200 to-accent-400 rounded-full opacity-0 group-hover:opacity-50 transition-all duration-700 blur-md float-animation-delayed"></div>
    
    <div className="gradient-border opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
    
    <div className="flex items-center mb-5">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-glow group-hover:scale-110 transition-all duration-300 border-2 border-white pulse-slow">
        {avatar}
      </div>
      <div className="ml-4">
        <h4 className="font-bold text-gray-800 group-hover:text-gradient-primary transition-all duration-300">{name}</h4>
        <p className="text-gray-500 text-sm">{role}</p>
      </div>
    </div>
    
    <p className="text-gray-600 leading-relaxed italic text-base relative z-10 mb-6 group-hover:text-gray-700 transition-colors">"{content}"</p>
    
    <div className="flex mt-4 space-x-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="transform transition-all duration-300 group-hover:scale-110 pulse-slow" style={{ transitionDelay: `${i * 75}ms` }}>
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
        </div>
      ))}
    </div>
  </div>
);

const ModernHomepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFeatureClick = (feature) => {
    alert(`Chuyển đến trang ${feature}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tuyển Sinh ĐH
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Trang Chủ</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Các Trường ĐH</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Bảng Điều Khiển</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Nộp Hồ Sơ</a>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                Đăng Nhập
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white rounded-2xl mt-2 p-4 shadow-xl">
              <div className="flex flex-col space-y-4">
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Trang Chủ</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Các Trường ĐH</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Bảng Điều Khiển</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Nộp Hồ Sơ</a>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold">
                  Đăng Nhập
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Enhanced Design */}
      <section className="hero-section-bg relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background with Pattern Overlay - using hero-section-bg class */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[length:24px_24px]" />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        
        {/* Enhanced Floating Elements using pre-defined animation classes */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl float-animation" />
        <div className="absolute top-40 left-1/4 w-20 h-20 bg-yellow-400/10 rounded-full blur-xl float-animation-delayed" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl float-animation" />
        <div className="absolute bottom-40 right-1/4 w-32 h-32 bg-cyan-400/10 rounded-full blur-xl float-animation-delayed" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-400/10 rounded-full blur-2xl pulse-slow" />
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-indigo-400/10 rounded-full blur-lg pulse-slower" />
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 right-10 rotate-45 w-40 h-3 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent blur-sm pulse-slow" />
        <div className="absolute bottom-1/4 left-10 -rotate-45 w-40 h-3 bg-gradient-to-r from-transparent via-pink-400/30 to-transparent blur-sm pulse-slower" />
        
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <div className="mb-10 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-400/30 to-secondary-600/30 rounded-full blur-xl pulse-slow" />
            <div className="relative w-28 h-28 mx-auto bg-gradient-to-br from-secondary-400/40 to-secondary-600/40 rounded-full flex items-center justify-center shadow-glow">
              <Award size={64} className="mx-auto text-secondary-400 float-animation relative z-10" />
            </div>
          </div>
          
          <h1 className="section-title text-5xl md:text-7xl font-black mb-8 tracking-tight leading-tight text-white">
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-primary-600/20 blur-xl rounded-full pulse-slow"></span>
              <span className="relative shadow-glow">Mở Cánh Cửa</span>
            </span>
            <span className="block text-gradient-secondary mt-2">
              Đại Học Mơ Ước
            </span>
          </h1>
          
          <p className="text-blue-50 text-xl md:text-2xl max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
            Hệ thống tuyển sinh trực tuyến hiện đại, minh bạch và tiện lợi.
            <span className="block mt-3 text-yellow-100/80 font-semibold">Đăng ký xét tuyển, theo dõi hồ sơ và nhận kết quả nhanh chóng, chính xác.</span>
          </p>

          {/* Statistics with enhanced design */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto mb-12">
            <StatCard 
              number="50+" 
              label="Trường Đại Học" 
              icon={<Trophy className="w-8 h-8" />} 
            />
            <StatCard 
              number="10K+" 
              label="Hồ Sơ Đã Xử Lý" 
              icon={<Star className="w-8 h-8" />} 
            />
            <StatCard 
              number="98%" 
              label="Tỷ Lệ Hài Lòng" 
              icon={<CheckCircle className="w-8 h-8" />} 
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="relative bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-800 font-bold px-10 py-4 text-lg shadow-xl hover:shadow-2xl hover:shadow-yellow-500/20 transform hover:scale-105 transition-all duration-300 rounded-2xl flex items-center overflow-hidden group">
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <Rocket className="mr-3 w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10">Đăng Nhập Ngay</span>
            </button>
            <button className="relative bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold px-10 py-4 text-lg border-2 border-white/30 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transform hover:scale-105 transition-all duration-300 rounded-2xl flex items-center overflow-hidden group">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <FileText className="mr-3 w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10">Tạo Tài Khoản</span>
            </button>
            <button className="relative bg-transparent border-2 border-white/40 hover:bg-white/10 hover:border-white/60 text-white font-bold px-10 py-4 text-lg backdrop-blur-sm rounded-2xl transition-all duration-300 flex items-center overflow-hidden group">
              <span className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <BookOpen className="mr-3 w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10">Xem Danh Sách Trường</span>
            </button>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute bottom-10 left-10 animate-bounce">
          <Sparkles className="text-yellow-400/40 w-8 h-8" />
        </div>
        <div className="absolute top-1/4 right-20 animate-bounce" style={{animationDelay: '0.5s'}}>
          <BookOpen className="text-pink-400/40 w-8 h-8" />
        </div>
        <div className="absolute bottom-1/4 left-1/5 animate-bounce" style={{animationDelay: '1.5s'}}>
          <GraduationCap className="text-blue-400/40 w-8 h-8" />
        </div>
      </section>

      {/* Enhanced Features Section with Background Elements */}
      <section className="py-24 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
        {/* Decorative background elements using pre-defined animation classes */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full blur-3xl opacity-70 float-animation"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-accent-50 to-secondary-50 rounded-full blur-3xl opacity-70 float-animation-delayed"></div>
        
        {/* Decorative pulsing lines */}
        <div className="absolute top-1/2 left-10 w-5 h-24 bg-gradient-to-b from-primary-300 to-transparent rounded-full blur-sm pulse-slow"></div>
        <div className="absolute top-1/4 right-10 w-5 h-24 bg-gradient-to-b from-accent-300 to-transparent rounded-full blur-sm pulse-slower"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="relative inline-block">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary-100 via-secondary-100 to-accent-100 rounded-full blur-lg opacity-70 pulse-slow"></div>
              <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 shadow-glow transform hover:rotate-6 transition-transform duration-300">
                <Heart className="text-white w-10 h-10 float-animation" />
              </div>
            </div>
            
            <h2 className="section-title text-4xl md:text-5xl font-black mb-6 text-gradient-primary">
              Tại Sao Chọn Chúng Tôi?
            </h2>
            <p className="section-subtitle text-gray-600 text-xl mb-6 max-w-4xl mx-auto leading-relaxed">
              Chúng tôi mang đến trải nghiệm tuyển sinh trực tuyến toàn diện, giúp bạn dễ dàng tiếp cận cơ hội học tập tại các trường đại học hàng đầu.
            </p>
            <div className="flex items-center justify-center space-x-2 mt-8 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary-400 pulse-slow" style={{animationDelay: '0ms'}}></div>
              <div className="w-3 h-3 rounded-full bg-secondary-400 pulse-slow" style={{animationDelay: '300ms'}}></div>
              <div className="w-4 h-4 rounded-full bg-accent-400 pulse-slow" style={{animationDelay: '600ms'}}></div>
              <div className="w-3 h-3 rounded-full bg-secondary-400 pulse-slow" style={{animationDelay: '900ms'}}></div>
              <div className="w-2 h-2 rounded-full bg-primary-400 pulse-slow" style={{animationDelay: '1200ms'}}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            <FeatureCard 
              icon={<Zap className="w-8 h-8" />} 
              title="Đăng Ký Siêu Nhanh" 
              description="Quy trình nộp hồ sơ trực tuyến được tối ưu hóa với AI, chỉ mất 5 phút để hoàn thành." 
              linkText="Nộp hồ sơ ngay" 
              colorClass="bg-gradient-to-br from-green-100 to-emerald-100 text-green-600"
              onClick={() => handleFeatureClick('nộp hồ sơ')}
            />
            <FeatureCard 
              icon={<BookOpen className="w-8 h-8" />} 
              title="Thông Tin Chuẩn Xác" 
              description="Cập nhật realtime thông tin tuyển sinh từ hơn 50 trường đại học uy tín trên cả nước." 
              linkText="Khám phá ngay" 
              colorClass="bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600"
              onClick={() => handleFeatureClick('danh sách trường')}
            />
            <FeatureCard 
              icon={<TrendingUp className="w-8 h-8" />} 
              title="Theo Dõi Thông Minh" 
              description="Dashboard cá nhân với thông báo push, theo dõi trạng thái hồ sơ 24/7." 
              linkText="Xem dashboard" 
              colorClass="bg-gradient-to-br from-purple-100 to-violet-100 text-purple-600"
              onClick={() => handleFeatureClick('dashboard')}
            />
            <FeatureCard 
              icon={<Users2 className="w-8 h-8" />} 
              title="Cộng Đồng Sôi Động" 
              description="Tham gia diễn đàn với 10,000+ thành viên, nhận tư vấn từ chuyên gia và sinh viên." 
              linkText="Tham gia cộng đồng" 
              colorClass="bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600"
              onClick={() => alert("Chức năng diễn đàn sắp ra mắt với nhiều tính năng hấp dẫn!")}
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8" />} 
              title="Bảo Mật Tuyệt Đối" 
              description="Mã hóa end-to-end, tuân thủ GDPR và ISO 27001, bảo vệ thông tin 100%." 
              linkText="Xem chính sách" 
              colorClass="bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-600"
              onClick={() => alert("Chính sách bảo mật được cập nhật theo tiêu chuẩn quốc tế.")}
            />
            <FeatureCard 
              icon={<Clock className="w-8 h-8" />} 
              title="Hỗ Trợ 24/7" 
              description="Đội ngũ tư vấn chuyên nghiệp với chatbot AI và hotline miễn phí." 
              linkText="Liên hệ ngay" 
              colorClass="bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600"
              onClick={() => alert("🔥 Hotline: 1900 9999 - Hỗ trợ miễn phí 24/7")}
            />
          </div>
          
          {/* Additional floating elements for visual interest */}
          <div className="absolute bottom-10 right-10 animate-bounce" style={{animationDelay: '1s'}}>
            <div className="w-3 h-3 bg-blue-400/50 rounded-full"></div>
          </div>
          <div className="absolute top-20 left-20 animate-bounce" style={{animationDelay: '1.5s'}}>
            <div className="w-2 h-2 bg-purple-400/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Phản Hồi Từ Học Sinh
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              Hàng nghìn học sinh đã tin tưởng và thành công cùng chúng tôi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Nguyễn Minh An"
              role="Sinh viên Đại học Bách Khoa"
              content="Hệ thống rất dễ sử dụng, giúp mình nộp hồ sơ nhanh chóng và theo dõi kết quả một cách thuận tiện. Recommend cho các bạn!"
              avatar="MA"
            />
            <TestimonialCard 
              name="Trần Thị Hương"
              role="Sinh viên Đại học Kinh tế"
              content="Thông tin về các trường đại học rất đầy đủ và cập nhật. Mình đã chọn được ngành học phù hợp nhờ tư vấn từ platform này."
              avatar="TH"
            />
            <TestimonialCard 
              name="Lê Văn Đức"
              role="Sinh viên Đại học Y"
              content="Dashboard theo dõi hồ sơ rất chi tiết, giúp mình biết chính xác trạng thái và chuẩn bị tốt cho từng bước tiếp theo."
              avatar="LD"
            />
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 p-12 md:p-20 rounded-3xl shadow-2xl text-white text-center overflow-hidden">
            {/* Enhanced Background decorations */}
            
            <div className="relative z-10">
              <div className="mb-8 relative">
                <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-br from-secondary-400/40 to-secondary-600/40 rounded-full blur-xl pulse-slow" />
                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-secondary-400/40 to-secondary-600/40 rounded-full flex items-center justify-center shadow-glow">
                  <Target size={64} className="mx-auto text-secondary-400 relative z-10 float-animation" />
                </div>
              </div>
              
              <h2 className="text-white text-4xl md:text-5xl font-black mb-6 leading-tight shadow-glow">
                <span className="relative inline-block">
                  <span className="absolute inset-0 bg-gradient-to-r from-secondary-400/20 to-secondary-600/20 blur-xl rounded-full pulse-slow"></span>
                  <span className="relative">Sẵn Sàng Chinh Phục</span>
                </span>
                <span className="block text-gradient-secondary mt-2">Giấc Mơ Đại Học?</span>
              </h2>
              
              <p className="text-blue-100 text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
                Hơn 10,000 học sinh đã tin tưởng và thành công cùng chúng tôi. 
                <span className="block mt-3 text-gradient-secondary font-semibold text-2xl md:text-3xl">Bạn sẽ là người tiếp theo!</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button className="relative bg-gradient-to-r from-secondary-400 to-secondary-600 hover:from-secondary-500 hover:to-secondary-400 border-0 text-gray-800 font-black px-12 py-4 text-xl rounded-2xl shadow-glow hover:shadow-xl hover:shadow-secondary-500/30 transform hover:scale-105 transition-all duration-300 min-w-72 flex items-center justify-center overflow-hidden group">
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                  <Rocket className="mr-3 w-6 h-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500" />
                  <span className="group-hover:tracking-wider transition-all duration-300">Bắt Đầu Ngay</span>
                </button>
                
                <div className="text-center bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 shadow-glow">
                  <div className="text-gradient-secondary font-bold text-lg mb-1">✨ HOÀN TOÀN MIỄN PHÍ ✨</div>
                  <div className="text-blue-100 text-sm">Không phí ẩn • Không cam kết</div>
                </div>
              </div>

              {/* Enhanced Trust indicators */}
              <div className="mt-12 pt-8 border-t border-white/30 gradient-border">
                <div className="flex flex-wrap justify-center items-center gap-8 text-blue-100">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                    <CheckCircle className="text-yellow-300 w-5 h-5" />
                    <span className="text-sm font-medium">Uy tín 5 sao</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                    <ShieldCheck className="text-yellow-300 w-5 h-5" />
                    <span className="text-sm font-medium">Bảo mật SSL</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                    <Users className="text-yellow-300 w-5 h-5" />
                    <span className="text-sm font-medium">10K+ người dùng</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(120,120,255,0.03)_1px,_transparent_1px)] bg-[length:20px_20px] opacity-50" />
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300 transform group-hover:scale-105">
                  <GraduationCap className="text-white w-7 h-7" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">Tuyển Sinh ĐH</span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                Hệ thống tuyển sinh trực tuyến hàng đầu Việt Nam, kết nối học sinh với các trường đại học uy tín.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-all duration-300">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-400 transition-all duration-300">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 transition-all duration-300">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6 text-white/90 border-l-4 border-blue-500 pl-3">Dịch Vụ</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="transform hover:translate-x-2 transition-transform duration-300">
                  <a href="#" className="hover:text-blue-400 transition-colors inline-flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Nộp Hồ Sơ
                  </a>
                </li>
                <li className="transform hover:translate-x-2 transition-transform duration-300">
                  <a href="#" className="hover:text-blue-400 transition-colors inline-flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Theo Dõi Kết Quả
                  </a>
                </li>
                <li className="transform hover:translate-x-2 transition-transform duration-300">
                  <a href="#" className="hover:text-blue-400 transition-colors inline-flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Tư Vấn Ngành Học
                  </a>
                </li>
                <li className="transform hover:translate-x-2 transition-transform duration-300">
                  <a href="#" className="hover:text-blue-400 transition-colors inline-flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Hỗ Trợ 24/7
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6 text-white/90 border-l-4 border-purple-500 pl-3">Thông Tin</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="transform hover:translate-x-2 transition-transform duration-300">
                  <a href="#" className="hover:text-purple-400 transition-colors inline-flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Về Chúng Tôi
                  </a>
                </li>
                <li className="transform hover:translate-x-2 transition-transform duration-300">
                  <a href="#" className="hover:text-purple-400 transition-colors inline-flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Điều Khoản
                  </a>
                </li>
                <li className="transform hover:translate-x-2 transition-transform duration-300">
                  <a href="#" className="hover:text-purple-400 transition-colors inline-flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Bảo Mật
                  </a>
                </li>
                <li className="transform hover:translate-x-2 transition-transform duration-300">
                  <a href="#" className="hover:text-purple-400 transition-colors inline-flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Liên Hệ
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6 text-white/90 border-l-4 border-pink-500 pl-3">Liên Hệ</h3>
              <div className="space-y-4 text-gray-300">
                <p className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                  <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </span>
                  <span className="hover:text-pink-400 transition-colors">Hotline: 1900 9999</span>
                </p>
                <p className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                  <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </span>
                  <span className="hover:text-purple-400 transition-colors">Email: support@tuyensinhDH.vn</span>
                </p>
                <p className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                  <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </span>
                  <span className="hover:text-blue-400 transition-colors">Hà Nội, Việt Nam</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700/50 mt-16 pt-10 text-center text-gray-300 gradient-border">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="float-animation-delayed">&copy; 2024 Tuyển Sinh ĐH. Tất cả các quyền được bảo lưu. <span className="text-gradient-primary font-bold">Hệ thống tuyển sinh thông minh</span></p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-300 hover:text-gradient-primary transition-all duration-300 transform hover:-translate-y-1">Chính sách bảo mật</a>
                <a href="#" className="text-gray-300 hover:text-gradient-primary transition-all duration-300 transform hover:-translate-y-1">Quyền riêng tư</a>
                <a href="#" className="text-gray-300 hover:text-gradient-primary transition-all duration-300 transform hover:-translate-y-1">Điều khoản sử dụng</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernHomepage;