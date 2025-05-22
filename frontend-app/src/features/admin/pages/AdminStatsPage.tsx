import React, { useState, useEffect } from 'react'; // Bỏ useCallback nếu không dùng
import { Typography, Row, Col, Card, Spin, Alert, Statistic, Select, message, Empty } from 'antd';
import { BarChartOutlined, PieChartOutlined, ReconciliationOutlined, SnippetsOutlined, BankOutlined, SolutionOutlined } from '@ant-design/icons';
import { Column, Pie } from '@ant-design/charts';
import statsAdminService, { ApplicationOverviewStats, ApplicationsByUniversityStat, ApplicationsByMajorStat } from '../services/statsAdminService';
import universityAdminService from '../services/universityAdminService';
import { UniversityFE } from '../../university/types';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const AdminStatsPage: React.FC = () => {
  const [overviewStats, setOverviewStats] = useState<ApplicationOverviewStats | null>(null);
  const [uniStats, setUniStats] = useState<ApplicationsByUniversityStat[]>([]);
  const [majorStats, setMajorStats] = useState<ApplicationsByMajorStat[]>([]);
  
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingUniStats, setLoadingUniStats] = useState(true);
  const [loadingMajorStats, setLoadingMajorStats] = useState(true);
  
  const [error, setError] = useState<string | null>(null);

  const [universitiesForFilter, setUniversitiesForFilter] = useState<Pick<UniversityFE, 'id' | 'name' | 'code'>[]>([]);
  const [selectedUniversityForMajorStats, setSelectedUniversityForMajorStats] = useState<string | undefined>(undefined);
  const [loadingFilterData, setLoadingFilterData] = useState(false); // ĐẢM BẢO ĐÃ KHAI BÁO

  useEffect(() => {
    const fetchOverview = async () => {
      setLoadingOverview(true);
      const res = await statsAdminService.getApplicationOverview();
      if (res.success && res.data) setOverviewStats(res.data);
      else { setError(res.message || 'Lỗi tải thống kê tổng quan.'); message.error(res.message || 'Lỗi tải thống kê tổng quan.'); }
      setLoadingOverview(false);
    };

    const fetchUniStats = async () => {
      setLoadingUniStats(true);
      const res = await statsAdminService.getApplicationsByUniversity();
      if (res.success && res.data) setUniStats(res.data);
      else { setError(res.message || 'Lỗi tải thống kê theo trường.'); message.error(res.message || 'Lỗi tải thống kê theo trường.');}
      setLoadingUniStats(false);
    };
    
    const fetchUniversitiesForFilter = async () => {
        setLoadingFilterData(true); // Bắt đầu loading
        const res = await universityAdminService.getAll({limit: 1000, sortBy: 'name'});
        if(res.success && res.data) setUniversitiesForFilter(res.data);
        setLoadingFilterData(false); // Kết thúc loading
    };

    fetchOverview();
    fetchUniStats();
    fetchUniversitiesForFilter();
  }, []);

  useEffect(() => {
    const fetchMajorStats = async () => {
      setLoadingMajorStats(true);
      const res = await statsAdminService.getApplicationsByMajor({ universityId: selectedUniversityForMajorStats });
      if (res.success && res.data) setMajorStats(res.data);
      else { setError(res.message || 'Lỗi tải thống kê theo ngành.'); message.error(res.message || 'Lỗi tải thống kê theo ngành.');}
      setLoadingMajorStats(false);
    };
    fetchMajorStats();
  }, [selectedUniversityForMajorStats]);


  const overviewChartData = overviewStats ? [
    { type: 'Chờ duyệt', value: overviewStats.pending },
    { type: 'Đang xử lý', value: overviewStats.processing || 0 },
    { type: 'Cần bổ sung', value: overviewStats.additional_required || 0 },
    { type: 'Đã duyệt', value: overviewStats.approved },
    { type: 'Từ chối', value: overviewStats.rejected },
    { type: 'Đã hủy', value: overviewStats.cancelled || 0 },
  ].filter(item => item.value > 0) : [];

  const uniChartData = uniStats.map(stat => ({
    name: stat.universityName,
    value: stat.totalApplications,
  })).slice(0, 10); 

  const majorChartData = majorStats.map(stat => ({
    name: `${stat.majorName} (${stat.universityName || stat.universityCode || 'N/A'})`, 
    value: stat.totalApplications,
  })).slice(0, 15);

  return (
    <div className="space-y-8">
      <Title level={2} className="text-center !mb-2"><BarChartOutlined /> Thống Kê Hệ Thống Tuyển Sinh</Title>
      <Paragraph className="text-center text-gray-600 mb-8">Tổng quan về số liệu hồ sơ và tình hình tuyển sinh.</Paragraph>

      {error && <Alert message={error} type="error" showIcon className="mb-6" />}

      <Card title={<><SnippetsOutlined /> Tổng Quan Hồ Sơ</>} loading={loadingOverview} className="shadow-lg rounded-lg" variant="outlined"> {/* SỬA bordered */}
        {overviewStats && (
          <Row gutter={[16, 24]}>
            <Col xs={24} sm={12} md={8} lg={4}><Statistic title="Tổng Hồ Sơ" value={overviewStats.total} prefix={<ReconciliationOutlined />} /></Col>
            <Col xs={24} sm={12} md={8} lg={4}><Statistic title="Chờ Duyệt" value={overviewStats.pending} valueStyle={{color: '#faad14'}}/></Col>
            <Col xs={24} sm={12} md={8} lg={4}><Statistic title="Đang Xử Lý" value={overviewStats.processing || 0} valueStyle={{color: '#1890ff'}}/></Col>
            <Col xs={24} sm={12} md={8} lg={4}><Statistic title="Đã Duyệt" value={overviewStats.approved} valueStyle={{color: '#52c41a'}}/></Col>
            <Col xs={24} sm={12} md={8} lg={4}><Statistic title="Từ Chối" value={overviewStats.rejected} valueStyle={{color: '#ff4d4f'}}/></Col>
            <Col xs={24} sm={12} md={8} lg={4}><Statistic title="Cần Bổ Sung" value={overviewStats.additional_required || 0} valueStyle={{color: '#fa8c16'}}/></Col>
             {overviewChartData.length > 0 && (
                <Col span={24} className="mt-6">
                    <Title level={5} className="text-center">Phân Bố Trạng Thái Hồ Sơ</Title>
                    <Pie data={overviewChartData} angleField="value" colorField="type" radius={0.8} 
                         label={{ type: 'outer', content: '{name}\n{percentage}' }} 
                         legend={{position: 'bottom'}}
                         height={300}
                    />
                </Col>
             )}
          </Row>
        )}
      </Card>

      <Card title={<><BankOutlined /> Số Lượng Hồ Sơ Theo Trường (Top 10)</>} loading={loadingUniStats} className="shadow-lg rounded-lg" variant="outlined"> {/* SỬA bordered */}
        {uniStats.length > 0 ? (
            <Column 
                data={uniChartData} 
                xField="name" 
                yField="value" 
                seriesField="name"
                label={{ position: 'middle', style: { fill: '#FFFFFF', opacity: 0.8 } }}
                xAxis={{ label: { autoHide: true, autoRotate: true } }}
                meta={{ name: { alias: 'Tên Trường' }, value: { alias: 'Số Hồ Sơ' } }}
                height={400}
                tooltip={{ title: (name) => name, formatter: (datum) => ({ name: 'Số hồ sơ', value: datum.value }) }}
            />
        ) : (
            !loadingUniStats && <Empty description="Chưa có dữ liệu thống kê theo trường." />
        )}
      </Card>

      <Card title={<><SolutionOutlined /> Số Lượng Hồ Sơ Theo Ngành (Top 15)</>} loading={loadingMajorStats} className="shadow-lg rounded-lg" variant="outlined"> {/* SỬA bordered */}
        <Row gutter={[16,16]} className="mb-4">
            <Col xs={24} sm={12}>
                <Select
                    placeholder="Lọc theo trường (để xem ngành của trường đó)"
                    style={{ width: '100%' }}
                    allowClear
                    showSearch
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    value={selectedUniversityForMajorStats}
                    onChange={(value) => setSelectedUniversityForMajorStats(value)}
                    loading={universitiesForFilter.length === 0 && loadingFilterData} // Dòng 144 ở đây
                >
                    {universitiesForFilter.map(uni => (
                        <Option key={uni.id} value={uni.id} label={uni.name}>{uni.name} ({uni.code})</Option>
                    ))}
                </Select>
            </Col>
        </Row>
        {majorStats.length > 0 ? (
             <Column 
                data={majorChartData} 
                xField="name" 
                yField="value" 
                seriesField="name"
                label={{ position: 'middle', style: { fill: '#FFFFFF', opacity: 0.8 } }}
                xAxis={{ label: { autoHide: true, autoRotate: true, } }}
                meta={{ name: { alias: 'Tên Ngành (Trường)' }, value: { alias: 'Số Hồ Sơ' } }}
                height={400}
                tooltip={{ title: (name) => name, formatter: (datum) => ({ name: 'Số hồ sơ', value: datum.value }) }}
            />
        ) : (
            !loadingMajorStats && <Empty description={selectedUniversityForMajorStats ? "Trường này chưa có hồ sơ nào theo ngành." : "Chọn trường để xem thống kê ngành hoặc chưa có dữ liệu."} />
        )}
      </Card>
    </div>
  );
};
export default AdminStatsPage;
