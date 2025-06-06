import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Row, Col, Card, Typography } from 'antd';
import { School } from 'lucide-react'; 

const AuthLayout: React.FC = () => {
  return (
    <Layout className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <Row justify="center" align="middle" className="w-full">
        <Col xs={24} sm={20} md={14} lg={10} xl={8}>
          <Card variant="borderless" className="shadow-2xl rounded-xl p-4 md:p-8 bg-white/95 backdrop-blur-sm">
            <div className="text-center mb-8">
              <School size={64} className="mx-auto text-indigo-600 mb-4" />
              <Typography.Title level={2} className="!font-bold !text-indigo-900 !mb-0">
                Hệ Thống Tuyển Sinh
              </Typography.Title>
            </div>
            <Outlet />
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default AuthLayout;