import React from 'react';
import { Layout, Typography, Space, Divider, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { 
  FacebookFilled, 
  YoutubeFilled, 
  TwitterOutlined, 
  EnvironmentOutlined, 
  PhoneOutlined, 
  MailOutlined,
  InstagramOutlined,
  LinkedinOutlined
} from '@ant-design/icons';
import './AppFooter.css';

const { Footer } = Layout;
const { Text, Link: AntLink, Title } = Typography;

const PtitLogoSmall = () => (
  <div className="footer-logo">
    <img 
      src="https://placehold.co/140x40/D8242C/FFFFFF?text=HỆ+THỐNG+TS&font=Inter" 
      alt="Logo Hệ Thống Tuyển Sinh" 
      className="logo-image"
    />
  </div>
);

const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { text: 'Trang chủ PTIT', href: '#' },
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
    { icon: <FacebookFilled />, href: '#', label: 'Facebook' },
    { icon: <YoutubeFilled />, href: '#', label: 'YouTube' },
    { icon: <TwitterOutlined />, href: '#', label: 'Twitter' },
    { icon: <InstagramOutlined />, href: '#', label: 'Instagram' },
    { icon: <LinkedinOutlined />, href: '#', label: 'LinkedIn' }
  ];

  return (
    <Footer className="app-footer">
      <div className="footer-container">
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
                </Text>
                <div className="social-links">
                  {socialLinks.map((social, index) => (
                    <AntLink
                      key={index}
                      href={social.href}
                      target="_blank"
                      className="social-link"
                      title={social.label}
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
            </Col>
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
                Phát triển bởi <span className="highlight">Nhóm Sinh Viên Pro Coders</span>
              </Text>
            </Col>
          </Row>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;