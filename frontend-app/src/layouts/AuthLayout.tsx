import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Row, Col, Card } from 'antd';
import { School } from 'lucide-react'; 

const AuthLayout: React.FC = () => {
  return (
    <Layout className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-indigo-600 to-purple-600 p-4">
      <Row justify="center" align="middle" className="w-full">
        <Col xs={24} sm={20} md={14} lg={10} xl={8}>
           <Card className="shadow-2xl rounded-xl p-2 md:p-6 bg-white"> {/* variant="outlined" là mặc định, có thể bỏ */}
            <div className="text-center mb-6 md:mb-8">
                <School size={56} className="mx-auto text-primary mb-3" />
                <h1 className="text-2xl md:text-3xl font-bold text-primary-dark">Hệ Thống Tuyển Sinh</h1>
            </div>
            <Outlet /> 
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};
export default AuthLayout;