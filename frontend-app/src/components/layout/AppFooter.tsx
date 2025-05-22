// src/components/layout/AppFooter.tsx
import React from 'react';
import { Layout, Typography, Space, Divider, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import {
  FacebookFilled,
  YoutubeFilled,
  LinkedinFilled,
  TwitterOutlined,
} from '@ant-design/icons';
import { Briefcase } from 'lucide-react';

const { Footer } = Layout;
const { Text, Link: AntLink, Title } = Typography;
import './AppFooter.css';


const AppFooter: React.FC = () => {
  return (
    <Footer className="bg-neutral-800 text-neutral-400 pt-12 pb-8 px-4">
      <div className="container mx-auto">
        <Row gutter={[24, 32]} justify="space-between">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Space direction="vertical" size="middle">
              <Link to="/" className="flex items-center group mb-2">
                <Briefcase className="h-10 w-10 mr-3 text-primary" />
                <Title level={4} className="!text-white !mb-0 group-hover:text-primary-light transition-colors">
                  Tuyển Sinh ĐH
                </Title>
              </Link>
              <Text className="text-neutral-400">
                Hệ thống tuyển sinh trực tuyến hàng đầu, mang đến cơ hội học tập rộng mở cho mọi thí sinh.
              </Text>
              <Space size="middle" className="mt-2">
                <AntLink
                  href="https://facebook.com"
                  target="_blank"
                  className="text-neutral-400 hover:text-primary-light text-2xl transition-colors"
                >
                  <FacebookFilled />
                </AntLink>
                <AntLink
                  href="https://youtube.com"
                  target="_blank"
                  className="text-neutral-400 hover:text-primary-light text-2xl transition-colors"
                >
                  <YoutubeFilled />
                </AntLink>
                <AntLink
                  href="https://linkedin.com"
                  target="_blank"
                  className="text-neutral-400 hover:text-primary-light text-2xl transition-colors"
                >
                  <LinkedinFilled />
                </AntLink>
                <AntLink
                  href="https://twitter.com"
                  target="_blank"
                  className="text-neutral-400 hover:text-primary-light text-2xl transition-colors"
                >
                  <TwitterOutlined />
                </AntLink>
              </Space>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={5} lg={4}>
            <Title level={5} className="!text-neutral-200 !mb-4 uppercase tracking-wider">
              Về Chúng Tôi
            </Title>
            <Space direction="vertical" size="small">
              <AntLink href="#" className="text-neutral-400 hover:text-primary-light">
                Giới thiệu
              </AntLink>
              <AntLink href="#" className="text-neutral-400 hover:text-primary-light">
                Đội ngũ
              </AntLink>
              <AntLink href="#" className="text-neutral-400 hover:text-primary-light">
                Tuyển dụng
              </AntLink>
              <AntLink href="#" className="text-neutral-400 hover:text-primary-light">
                Liên hệ
              </AntLink>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={5} lg={4}>
            <Title level={5} className="!text-neutral-200 !mb-4 uppercase tracking-wider">
              Hỗ Trợ
            </Title>
            <Space direction="vertical" size="small">
              <AntLink href="#" className="text-neutral-400 hover:text-primary-light">
                Câu hỏi thường gặp
              </AntLink>
              <AntLink href="#" className="text-neutral-400 hover:text-primary-light">
                Hướng dẫn sử dụng
              </AntLink>
              <AntLink href="#" className="text-neutral-400 hover:text-primary-light">
                Chính sách bảo mật
              </AntLink>
              <AntLink href="#" className="text-neutral-400 hover:text-primary-light">
                Điều khoản dịch vụ
              </AntLink>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={6} lg={5}>
            <Title level={5} className="!text-neutral-200 !mb-4 uppercase tracking-wider">
              Liên Hệ
            </Title>
            <Text className="block text-neutral-400">
              Email:{' '}
              <AntLink
                href="mailto:support@tuyensinhdh.edu"
                className="text-primary-light hover:underline"
              >
                support@tuyensinhdh.edu
              </AntLink>
            </Text>
            <Text className="block text-neutral-400 mt-1">
              Hotline:{' '}
              <AntLink href="tel:19009999" className="text-primary-light hover:underline">
                1900 9999
              </AntLink>
            </Text>
            <Text className="block text-neutral-400 mt-1">
              Địa chỉ: 123 Đường ABC, Quận XYZ, Thành phố HCM
            </Text>
          </Col>
        </Row>

        <Divider className="!border-neutral-700 !my-8" />

        <Text className="text-center block text-neutral-500 text-sm">
          Bản quyền © {new Date().getFullYear()} Hệ Thống Tuyển Sinh ĐH. Phát triển bởi Nhóm Sinh Viên Pro Coders.
        </Text>
      </div>
    </Footer>
  );
};

export default AppFooter;
