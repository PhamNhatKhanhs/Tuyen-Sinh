import React, { useState, useEffect } from 'react';
import { Layout, Typography, Space, Divider, Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';
import { 
  FacebookFilled, 
  YoutubeFilled, 
  TwitterOutlined, 
  EnvironmentOutlined, 
  PhoneOutlined, 
  MailOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  UpOutlined,
  TrophyOutlined,
  SafetyOutlined,
  RocketOutlined,
  HeartFilled
} from '@ant-design/icons';
import './AppFooter.css';

const { Footer } = Layout;
const { Text, Link: AntLink, Title } = Typography;

const PtitLogoSmall = () => (
  <div className="footer-logo">
    <img 
      src="https://placehold.co/140x40/3B82F6/FFFFFF?text=HỆ+THỐNG+TS&font=Inter" 
      alt="Logo Hệ Thống Tuyển Sinh" 
      className="logo-image"
    />
    <div className="logo-badges">
      <span className="logo-badge official">
        <SafetyOutlined /> Chính thức
      </span>
      <span className="logo-badge trusted">
        <TrophyOutlined /> Uy tín
      </span>
      <span className="logo-badge modern">
        <RocketOutlined /> Hiện đại
      </span>
    </div>
  </div>
);

const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const quickLinks = [
    { text: 'Trang chủ', href: '#' },
    { text: 'Đề án tuyển sinh', href: '#' },
    { text: 'Các ngành đào tạo', href: '#' },
    { text: 'Tin tức & Thông báo', href: '#' },
    { text: 'Thống kê tuyển sinh', href: '#' }
  ];

  const supportLinks = [
    { text: 'Câu hỏi thường gặp', href: '#' },
    { text: 'Hướng dẫn nộp hồ sơ', href: '#' },
    { text: 'Tra cứu kết quả', href: '#' },
    { text: 'Chính sách bảo mật', href: '#' },
    { text: 'Điều khoản sử dụng', href: '#' }
  ];
  const socialLinks = [
    { icon: <FacebookFilled />, href: '#', label: 'Facebook', color: '#1877f2' },
    { icon: <YoutubeFilled />, href: '#', label: 'YouTube', color: '#ff0000' },
    { icon: <TwitterOutlined />, href: '#', label: 'Twitter', color: '#1da1f2' },
    { icon: <InstagramOutlined />, href: '#', label: 'Instagram', color: '#e4405f' },
    { icon: <LinkedinOutlined />, href: '#', label: 'LinkedIn', color: '#0077b5' }
  ];

  const stats = [
    { label: 'Sinh viên', value: '50K+', icon: '🎓', color: '#3b82f6' },
    { label: 'Trường ĐH', value: '100+', icon: '🏫', color: '#10b981' },
    { label: 'Thành công', value: '98%', icon: '🎯', color: '#06b6d4' },
    { label: 'Kinh nghiệm', value: '25+', icon: '⭐', color: '#f59e0b' }
  ];

  const features = [
    { icon: '🚀', title: 'Nhanh chóng', desc: 'Xử lý hồ sơ trong 24h' },
    { icon: '🔒', title: 'Bảo mật', desc: 'Thông tin được mã hóa an toàn' },
    { icon: '💡', title: 'Thông minh', desc: 'AI hỗ trợ tư vấn ngành học' },
    { icon: '🎯', title: 'Chính xác', desc: 'Dự đoán kết quả 98% chính xác' }
  ];
  return (
    <Footer className="app-footer">
      <div className="footer-container">
        {/* Statistics Section */}
        <div className="footer-stats">
          <Row gutter={[24, 24]} justify="center">
            {stats.map((stat, index) => (
              <Col xs={12} sm={6} key={index}>
                <div className="stat-card">
                  <div className="stat-icon" style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="stat-value" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Main Footer Content */}
        <div className="footer-main">
          <Row gutter={[48, 32]} justify="space-between">
            {/* Brand Section */}
            <Col xs={24} md={8} lg={6}>
              <div className="footer-brand">
                <PtitLogoSmall />
                <Text className="footer-description">
                  Cổng thông tin tuyển sinh chính thức của Học viện Công nghệ 
                  Bưu chính Viễn thông. Nơi cập nhật thông tin nhanh chóng và chính xác nhất.
                </Text>                <div className="social-links">
                  {socialLinks.map((social, index) => (
                    <AntLink
                      key={index}
                      href={social.href}
                      target="_blank"
                      className="social-link"
                      title={social.label}
                      style={{ '--brand-color': social.color } as React.CSSProperties}
                    >
                      {social.icon}
                    </AntLink>
                  ))}
                </div>
              </div>
            </Col>

            {/* Quick Links */}
            <Col xs={12} sm={8} md={5} lg={4}>
              <div className="footer-section">
                <Title level={5} className="footer-section-title">
                  Liên kết nhanh
                </Title>
                <div className="footer-links">
                  {quickLinks.map((link, index) => (
                    <AntLink key={index} href={link.href} className="footer-link">
                      {link.text}
                    </AntLink>
                  ))}
                </div>
              </div>
            </Col>

            {/* Support Links */}
            <Col xs={12} sm={8} md={5} lg={4}>
              <div className="footer-section">
                <Title level={5} className="footer-section-title">
                  Hỗ trợ
                </Title>
                <div className="footer-links">
                  {supportLinks.map((link, index) => (
                    <AntLink key={index} href={link.href} className="footer-link">
                      {link.text}
                    </AntLink>
                  ))}
                </div>
              </div>
            </Col>

            {/* Contact Information */}
            <Col xs={24} sm={12} md={6} lg={6}>
              <div className="footer-section">
                <Title level={5} className="footer-section-title">
                  Thông tin liên hệ
                </Title>
                <div className="contact-info">
                  <div className="contact-item">
                    <PhoneOutlined className="contact-icon" />
                    <div className="contact-details">
                      <Text className="contact-label">Hotline:</Text>
                      <AntLink href="tel:02433512252" className="contact-link">
                        024.3351.2252
                      </AntLink>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <MailOutlined className="contact-icon" />
                    <div className="contact-details">
                      <Text className="contact-label">Email:</Text>
                      <AntLink href="mailto:tuyensinh@ptit.edu.vn" className="contact-link">
                        tuyensinh@ptit.edu.vn
                      </AntLink>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <EnvironmentOutlined className="contact-icon" />
                    <div className="contact-details">
                      <Text className="contact-label">Địa chỉ:</Text>
                      <Text className="contact-text">
                        Km10, Đường Nguyễn Trãi,<br />
                        Q.Hà Đông, Hà Nội, Việt Nam
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </Col>          </Row>
        </div>

        {/* Feature Highlights */}
        <div className="footer-features">
          <Title level={4} className="features-title">
            <HeartFilled style={{ color: '#f59e0b', marginRight: 8 }} />
            Tại sao chọn chúng tôi?
          </Title>
          <Row gutter={[24, 16]}>
            {features.map((feature, index) => (
              <Col xs={12} sm={6} key={index}>
                <div className="feature-item">
                  <div className="feature-icon">{feature.icon}</div>
                  <div className="feature-content">
                    <div className="feature-title">{feature.title}</div>
                    <div className="feature-desc">{feature.desc}</div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Footer Bottom */}
        <Divider className="footer-divider" />
        <div className="footer-bottom">
          <Row justify="space-between" align="middle">
            <Col xs={24} md={12}>
              <Text className="copyright-text">
                © {currentYear} Học viện Công nghệ Bưu chính Viễn thông. Bảo lưu mọi quyền.
              </Text>
            </Col>
            <Col xs={24} md={12} className="footer-credits">
              <Text className="credits-text">
                Phát triển bởi <span className="highlight">Nhóm Sinh Viên UDU</span>
              </Text>
            </Col>          </Row>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          className="scroll-to-top"
          onClick={scrollToTop}
          shape="circle"
          icon={<UpOutlined />}
          size="large"
        />
      )}
    </Footer>
  );
};

export default AppFooter;