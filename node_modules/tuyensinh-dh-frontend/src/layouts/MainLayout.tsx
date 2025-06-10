import React from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from '../components/layout/AppHeader';
import AppFooter from '../components/layout/AppFooter';
import { Layout } from 'antd';

const { Content } = Layout;

const MainLayout: React.FC = () => {
  return (
    <Layout className="min-h-screen">
      <AppHeader />
      <Content className="p-4 md:p-6 lg:p-8 bg-gray-100">
        <div className="container mx-auto">
          <Outlet /> {/* Đây là nơi các page component sẽ được render */}
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};
export default MainLayout;