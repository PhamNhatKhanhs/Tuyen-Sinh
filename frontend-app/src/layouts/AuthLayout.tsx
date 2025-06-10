import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Row, Col } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import styles from '../features/auth/pages/AuthPages.module.css';

const AuthLayout: React.FC = () => {
  return (
    <Layout className={styles.authLayoutContainer}>
      <Row justify="center" align="middle" className="w-full min-h-screen relative z-10">
        <Col xs={22} sm={18} md={12} lg={10} xl={8} xxl={6}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>            <div className={styles.authIcon}>
              <BookOutlined style={{ fontSize: '2rem', color: 'white' }} />
            </div>            <h1 className={styles.authTitle} style={{ color: '#60a5fa' }}>
                Hệ Thống Tuyển Sinh
              </h1>
              <p className={styles.authSubtitle} style={{ color: '#cbd5e1' }}>
                Nền tảng quản lý hồ sơ tuyển sinh hiện đại
              </p>
            </div>
            <Outlet />
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

export default AuthLayout;