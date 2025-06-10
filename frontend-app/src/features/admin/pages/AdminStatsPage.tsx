import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Row, Col, Card, Alert, Empty, Avatar } from 'antd';
import { BarChartOutlined, ReconciliationOutlined, SnippetsOutlined, BankOutlined, SolutionOutlined, TrophyOutlined, RiseOutlined, FallOutlined, DashboardOutlined } from '@ant-design/icons';
import { Column, Pie } from '@ant-design/charts';
import statsAdminService, { ApplicationOverviewStats, ApplicationsByUniversityStat, ApplicationsByMajorStat } from '../services/statsAdminService';

const { Title, Paragraph } = Typography;

// Modern color palette
const COLORS = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  secondary: '#f1f5f9',
  accent: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  dark: '#0f172a',
  darkSecondary: '#1e293b',
  text: '#334155',
  textLight: '#64748b',
  white: '#ffffff',
  gray50: '#f8fafc',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  blue50: '#eff6ff',
  blue500: '#3b82f6',
  green50: '#f0fdf4',
  green500: '#22c55e',
  red50: '#fef2f2',
  red500: '#ef4444',
  purple50: '#faf5ff',
  purple500: '#a855f7',
  orange50: '#fff7ed',
  orange500: '#f97316',
  yellow50: '#fefce8',
  yellow500: '#eab308',
  cyan50: '#ecfeff',
  cyan500: '#06b6d4',
};

const AdminStatsPage: React.FC = () => {
  const [overviewStats, setOverviewStats] = useState<ApplicationOverviewStats | null>(null);
  const [uniStats, setUniStats] = useState<ApplicationsByUniversityStat[]>([]);
  const [majorStats, setMajorStats] = useState<ApplicationsByMajorStat[]>([]);
  
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingUniStats, setLoadingUniStats] = useState(true);
  const [loadingMajorStats, setLoadingMajorStats] = useState(true);
  
  const [error, setError] = useState<string | null>(null);

  const fetchOverviewStats = useCallback(async () => {
    try {
      setLoadingOverview(true);
      const response = await statsAdminService.getApplicationOverview();
      if (response.success && response.data) {
        setOverviewStats(response.data);
      } else {
        setError(response.message || 'Không thể tải thống kê tổng quan.');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải thống kê tổng quan.');
    } finally {
      setLoadingOverview(false);
    }
  }, []);

  const fetchUniversityStats = useCallback(async () => {
    try {
      setLoadingUniStats(true);
      const response = await statsAdminService.getApplicationsByUniversity();
      if (response.success && response.data) {
        setUniStats(response.data);
      } else {
        setError(response.message || 'Không thể tải thống kê theo trường.');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải thống kê theo trường.');
    } finally {
      setLoadingUniStats(false);
    }
  }, []);
  const fetchMajorStats = useCallback(async () => {
    try {
      setLoadingMajorStats(true);
      const response = await statsAdminService.getApplicationsByMajor({});
      if (response.success && response.data) {
        setMajorStats(response.data);
      } else {
        setError(response.message || 'Không thể tải thống kê theo ngành.');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải thống kê theo ngành.');
    } finally {
      setLoadingMajorStats(false);
    }
  }, []);  useEffect(() => {
    let mounted = true;

    const loadInitialData = async () => {
      if (!mounted) return;
      
      // Load main stats in parallel for better performance
      await Promise.allSettled([
        fetchOverviewStats(),
        fetchUniversityStats(),
        fetchMajorStats()
      ]);
    };

    loadInitialData();

    return () => {
      mounted = false;
    };
  }, [fetchOverviewStats, fetchUniversityStats, fetchMajorStats]);const overviewChartData = overviewStats ? [
    { type: 'Chờ duyệt', value: overviewStats.pending || 0 },
    { type: 'Đang xử lý', value: overviewStats.processing || 0 },
    { type: 'Cần bổ sung', value: overviewStats.additional_required || 0 },
    { type: 'Đã duyệt', value: overviewStats.approved || 0 },
    { type: 'Từ chối', value: overviewStats.rejected || 0 },
    { type: 'Đã hủy', value: overviewStats.cancelled || 0 },
  ].filter(item => item.value > 0) : [];

  const hasValidOverviewData = overviewChartData.length > 0 && overviewChartData.some(item => item.value > 0);const uniChartData = uniStats.length > 0 
    ? uniStats.map(stat => ({
        name: stat.universityName,
        value: stat.totalApplications,
      })).slice(0, 10).filter(item => item.value > 0)
    : [];
  const majorChartData = majorStats.length > 0 
    ? majorStats.map(stat => ({
        name: `${stat.majorName} (${stat.universityName || stat.universityCode || 'N/A'})`, 
        value: stat.totalApplications,
      })).slice(0, 15).filter(item => item.value > 0)
    : [];
  return (
    <>
      <style>{`
        .modern-stats-management {
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }
        
        .modern-stats-management .ant-card {
          border-radius: 16px !important;
          border: 1px solid ${COLORS.gray200} !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
          overflow: hidden !important;
        }
        
        .modern-stats-management .ant-card-head {
          background: linear-gradient(135deg, ${COLORS.gray50} 0%, ${COLORS.gray100} 100%) !important;
          border-bottom: 1px solid ${COLORS.gray100} !important;
          padding: 20px 24px !important;
        }
        
        .modern-stats-management .ant-card-head-title {
          font-weight: 600 !important;
          font-size: 16px !important;
          color: ${COLORS.dark} !important;
        }
        
        .modern-stats-management .ant-card-body {
          padding: 24px !important;
        }
        
        .modern-stats-management .ant-statistic {
          text-align: center !important;
        }
        
        .modern-stats-management .ant-statistic-title {
          color: ${COLORS.textLight} !important;
          font-weight: 500 !important;
          font-size: 14px !important;
          margin-bottom: 8px !important;
        }
        
        .modern-stats-management .ant-statistic-content {
          font-size: 24px !important;
          font-weight: 700 !important;
        }
        
        .modern-stats-management .ant-select-selector {
          border-radius: 12px !important;
          border-color: ${COLORS.gray200} !important;
          transition: all 0.3s ease !important;
        }
        
        .modern-stats-management .ant-select-focused .ant-select-selector {
          border-color: ${COLORS.primary} !important;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1) !important;
        }
        
        .stats-card {
          background: ${COLORS.white};
          border-radius: 16px;
          padding: 20px;
          border: 1px solid ${COLORS.gray200};
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .stats-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .stats-card-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: ${COLORS.white};
          margin-bottom: 16px;
        }
        
        .stats-card-total { background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%); }
        .stats-card-pending { background: linear-gradient(135deg, ${COLORS.warning} 0%, #d97706 100%); }
        .stats-card-processing { background: linear-gradient(135deg, ${COLORS.blue500} 0%, #1d4ed8 100%); }
        .stats-card-approved { background: linear-gradient(135deg, ${COLORS.green500} 0%, #15803d 100%); }
        .stats-card-rejected { background: linear-gradient(135deg, ${COLORS.red500} 0%, #dc2626 100%); }
        .stats-card-additional { background: linear-gradient(135deg, ${COLORS.orange500} 0%, #ea580c 100%); }
        
        .stats-card-value {
          font-size: 32px;
          font-weight: 700;
          color: ${COLORS.dark};
          margin-bottom: 4px;
        }
        
        .stats-card-label {
          font-size: 14px;
          color: ${COLORS.textLight};
          font-weight: 500;
        }
        
        @media (max-width: 768px) {
          .modern-stats-management .mobile-stack {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>
      
      <div className="modern-stats-management" style={{ 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        minHeight: '100vh',
        padding: '24px'
      }}>
        <Card 
          style={{
            background: COLORS.white,
            borderRadius: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: 'none',
            overflow: 'hidden'
          }}
        >
          {/* Header Section */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
            color: COLORS.white,
            padding: '40px',
            margin: '-24px -24px 32px -24px',
            borderRadius: '24px 24px 0 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <Avatar 
                size={64}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: COLORS.white,
                  fontSize: '28px'
                }}
                icon={<DashboardOutlined />} 
              />
              <div>
                <Title level={2} style={{ color: COLORS.white, margin: 0, fontSize: '32px', fontWeight: '700' }}>
                  Thống Kê Hệ Thống Tuyển Sinh
                </Title>
                <Paragraph style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  margin: 0, 
                  fontSize: '16px',
                  marginTop: '8px'
                }}>
                  Tổng quan về số liệu hồ sơ và tình hình tuyển sinh toàn hệ thống
                </Paragraph>
              </div>
            </div>
          </div>

          {error && (
            <Alert 
              message={error} 
              type="error" 
              showIcon 
              style={{ 
                marginBottom: '24px',
                borderRadius: '12px',
                border: `1px solid ${COLORS.red500}20`
              }} 
            />
          )}

          {/* Overview Stats Cards */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SnippetsOutlined style={{ color: COLORS.primary }} />
                <span style={{ color: COLORS.dark, fontWeight: 600 }}>Tổng quan hồ sơ</span>
              </div>
            }
            loading={loadingOverview}
            style={{
              marginBottom: '32px',
              borderRadius: '16px',
              border: `1px solid ${COLORS.gray200}`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
          >
            {overviewStats && (
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} md={8} lg={4}>
                  <div className="stats-card">
                    <div className="stats-card-icon stats-card-total">
                      <ReconciliationOutlined />
                    </div>
                    <div className="stats-card-value">{overviewStats.total}</div>
                    <div className="stats-card-label">Tổng Hồ Sơ</div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                  <div className="stats-card">
                    <div className="stats-card-icon stats-card-pending">
                      <RiseOutlined />
                    </div>
                    <div className="stats-card-value">{overviewStats.pending}</div>
                    <div className="stats-card-label">Chờ Duyệt</div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                  <div className="stats-card">
                    <div className="stats-card-icon stats-card-processing">
                      <BarChartOutlined />
                    </div>
                    <div className="stats-card-value">{overviewStats.processing || 0}</div>
                    <div className="stats-card-label">Đang Xử Lý</div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                  <div className="stats-card">
                    <div className="stats-card-icon stats-card-approved">
                      <TrophyOutlined />
                    </div>
                    <div className="stats-card-value">{overviewStats.approved}</div>
                    <div className="stats-card-label">Đã Duyệt</div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                  <div className="stats-card">
                    <div className="stats-card-icon stats-card-rejected">
                      <FallOutlined />
                    </div>
                    <div className="stats-card-value">{overviewStats.rejected}</div>
                    <div className="stats-card-label">Từ Chối</div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                  <div className="stats-card">
                    <div className="stats-card-icon stats-card-additional">
                      <SnippetsOutlined />
                    </div>
                    <div className="stats-card-value">{overviewStats.additional_required || 0}</div>
                    <div className="stats-card-label">Cần Bổ Sung</div>
                  </div>
                </Col>                {hasValidOverviewData && (
                  <Col span={24} style={{ marginTop: '32px' }}>
                    <div style={{
                      background: `linear-gradient(135deg, ${COLORS.gray50} 0%, ${COLORS.blue50} 100%)`,
                      padding: '24px',
                      borderRadius: '16px',
                      border: `1px solid ${COLORS.gray200}`
                    }}>                      <Title level={4} style={{ 
                        textAlign: 'center', 
                        color: COLORS.dark,
                        marginBottom: '24px'
                      }}>
                        Phân Bổ Theo Trạng Thái
                      </Title>                      {overviewChartData.length > 0 ? (
                        <div style={{ position: 'relative' }}>
                          <Pie 
                            data={overviewChartData} 
                            angleField="value" 
                            colorField="type" 
                            radius={0.8}
                            innerRadius={0.3}
                            label={{
                              type: 'inner',
                              offset: '-30%',
                              content: '{value}',
                              style: {
                                fontSize: 14,
                                textAlign: 'center',
                                fill: '#fff',
                                fontWeight: 'bold'
                              }
                            }}
                            legend={{ 
                              position: 'bottom',
                              flipPage: false,
                              itemName: {
                                style: {
                                  fill: COLORS.dark,
                                  fontSize: 14
                                }
                              }
                            }}
                            height={350}
                            color={[
                              COLORS.warning,
                              COLORS.green500,
                              COLORS.red500,
                              COLORS.purple500,
                              COLORS.blue500,
                              COLORS.orange500
                            ]}
                            tooltip={{
                              formatter: (datum: any) => {
                                return { name: datum.type, value: `${datum.value} hồ sơ` };
                              }
                            }}
                            statistic={{
                              title: {
                                style: {
                                  fontSize: '16px',
                                  fontWeight: 'bold',
                                  color: COLORS.textLight
                                },
                                content: 'Tổng cộng'
                              },
                              content: {
                                style: {
                                  fontSize: '24px',
                                  fontWeight: 'bold',
                                  color: COLORS.primary
                                },
                                content: overviewStats?.total?.toString() || '0'
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <Empty description="Chưa có dữ liệu để hiển thị biểu đồ" />
                      )}
                    </div>
                  </Col>
                )}
              </Row>
            )}
          </Card>

          {/* University Stats */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BankOutlined style={{ color: COLORS.primary }} />
                <span style={{ color: COLORS.dark, fontWeight: 600 }}>Số lượng hồ sơ theo trường (Top 10)</span>
              </div>
            }
            loading={loadingUniStats}
            style={{
              marginBottom: '32px',
              borderRadius: '16px',
              border: `1px solid ${COLORS.gray200}`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
          >
            {uniStats.length > 0 ? (
              <div style={{
                background: `linear-gradient(135deg, ${COLORS.gray50} 0%, ${COLORS.green50} 100%)`,
                padding: '24px',
                borderRadius: '16px',
                border: `1px solid ${COLORS.gray200}`
              }}>                <Column 
                  data={uniChartData} 
                  xField="name" 
                  yField="value" 
                  xAxis={{ 
                    label: { 
                      autoHide: true, 
                      autoRotate: true,
                      style: {
                        fill: COLORS.text
                      }
                    }
                  }}
                  yAxis={{
                    label: {
                      style: {
                        fill: COLORS.text
                      }
                    }
                  }}
                  meta={{ 
                    name: { alias: 'Tên Trường' }, 
                    value: { alias: 'Số Hồ Sơ' } 
                  }}
                  height={400}
                  tooltip={{ 
                    formatter: (datum: any) => ({ 
                      name: 'Số hồ sơ', 
                      value: datum.value 
                    })
                  }}
                  color={COLORS.primary}
                  columnStyle={{
                    radius: [4, 4, 0, 0]
                  }}
                />
              </div>
            ) : (
              !loadingUniStats && <Empty description="Chưa có dữ liệu thống kê theo trường." />
            )}
          </Card>          {/* Major Stats */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SolutionOutlined style={{ color: COLORS.primary }} />
                <span style={{ color: COLORS.dark, fontWeight: 600 }}>Số lượng hồ sơ theo ngành (Top 15)</span>
              </div>
            }
            loading={loadingMajorStats}
            style={{
              borderRadius: '16px',
              border: `1px solid ${COLORS.gray200}`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
          >            {majorStats.length > 0 ? (
              <div style={{
                background: `linear-gradient(135deg, ${COLORS.gray50} 0%, ${COLORS.purple50} 100%)`,
                padding: '24px',
                borderRadius: '16px',
                border: `1px solid ${COLORS.gray200}`
              }}>
                <Column 
                  data={majorChartData} 
                  xField="name" 
                  yField="value" 
                  xAxis={{ 
                    label: { 
                      autoHide: true, 
                      autoRotate: true,
                      style: {
                        fill: COLORS.text
                      }
                    }
                  }}
                  yAxis={{
                    label: {
                      style: {
                        fill: COLORS.text
                      }
                    }
                  }}
                  meta={{ 
                    name: { alias: 'Tên Ngành' }, 
                    value: { alias: 'Số Hồ Sơ' } 
                  }}
                  height={400}
                  tooltip={{ 
                    formatter: (datum: any) => ({ 
                      name: 'Số hồ sơ', 
                      value: datum.value 
                    })
                  }}
                  color={COLORS.purple500}
                  columnStyle={{
                    radius: [4, 4, 0, 0]
                  }}
                />
              </div>
            ) : (
              !loadingMajorStats && <Empty description="Chưa có dữ liệu thống kê theo ngành." />
            )}
          </Card>
        </Card>
      </div>
    </>
  );
};
export default AdminStatsPage;
