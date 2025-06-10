import React, { useState, useEffect, useCallback } from 'react';
import { 
    Typography, Table, Button, Modal, Form, Select, Space, Tooltip, Tag, 
    Input, DatePicker, Card, Row, Col, Spin, Alert, Descriptions, List, message, Empty, Avatar 
} from 'antd';
import { 
  EyeOutlined, EditOutlined, FilterOutlined, SearchOutlined, 
  FilePdfOutlined, FileImageOutlined, FileTextOutlined, InfoCircleOutlined,
  UserOutlined, FolderOpenOutlined, CheckCircleOutlined, CloseCircleOutlined,
  ClockCircleOutlined, ExclamationCircleOutlined, MinusCircleOutlined, FileSearchOutlined
} from '@ant-design/icons';
import type { TableProps, PaginationProps } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';

import applicationAdminService from '../services/applicationAdminService';
import { ApplicationAdminListItemFE, ApplicationDetailBE } from '../../application/types';
import { UploadedFileResponse } from '../../upload/types';
import type { User } from '../../auth/types';

import universityAdminService from '../services/universityAdminService';
import majorAdminService from '../services/majorAdminService';
import { UniversityFE } from '../../university/types';
import { MajorFE } from '../../major/types';



const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
};

const APPLICATION_STATUSES = [
  { value: 'pending', label: 'Chờ duyệt', color: 'processing', icon: <ClockCircleOutlined /> },
  { value: 'processing', label: 'Đang xử lý', color: 'blue', icon: <FileSearchOutlined /> },
  { value: 'additional_required', label: 'Cần bổ sung', color: 'warning', icon: <ExclamationCircleOutlined /> },
  { value: 'approved', label: 'Đã duyệt', color: 'success', icon: <CheckCircleOutlined /> },
  { value: 'rejected', label: 'Từ chối', color: 'error', icon: <CloseCircleOutlined /> },
  { value: 'cancelled', label: 'Đã hủy', color: 'default', icon: <MinusCircleOutlined /> },
];

const getStatusTag = (statusValue?: ApplicationDetailBE['status']) => {
  if (!statusValue) return <Tag color="default">KHÔNG RÕ</Tag>;
  const statusObj = APPLICATION_STATUSES.find(s => s.value === statusValue);
  return (
    <Tag 
      color={statusObj?.color || 'default'} 
      icon={statusObj?.icon}
      style={{
        borderRadius: '20px',
        padding: '4px 12px',
        fontWeight: 500,
        fontSize: '12px'
      }}
    >
      {statusObj?.label.toUpperCase() || statusValue.toUpperCase()}
    </Tag>
  );
};

const getDocumentIcon = (fileType?: string) => {
    if (fileType?.includes('pdf')) return <FilePdfOutlined className="text-red-600 text-2xl" />;
    if (fileType?.includes('image')) return <FileImageOutlined className="text-blue-600 text-2xl" />;
    return <FileTextOutlined className="text-gray-600 text-2xl" />;
};

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i - 2).map(year => ({ label: year.toString(), value: year }));


const AdminManageApplications: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationAdminListItemFE[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedApplicationDetail, setSelectedApplicationDetail] = useState<ApplicationDetailBE | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [currentViewingApplicationId, setCurrentViewingApplicationId] = useState<string | null>(null);

  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [processingApplication, setProcessingApplication] = useState<ApplicationAdminListItemFE | null>(null);
  const [statusForm] = Form.useForm();

  const [filters, setFilters] = useState<{
    searchCandidate: string;
    universityId?: string;
    majorId?: string;
    status?: ApplicationDetailBE['status'];
    year?: number;
    dateRange?: [dayjs.Dayjs, dayjs.Dayjs] | null;
  }>({
    searchCandidate: '',
    universityId: undefined,
    majorId: undefined,
    status: undefined,
    year: currentYear,
    dateRange: null,
  });

  const [universitiesForFilter, setUniversitiesForFilter] = useState<Pick<UniversityFE, 'id' | 'name' | 'code'>[]>([]);
  const [majorsForFilter, setMajorsForFilter] = useState<Pick<MajorFE, 'id' | 'name' | 'code'>[]>([]);
  const [loadingFilterData, setLoadingFilterData] = useState(false);


  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1, pageSize: 10, total: 0, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100']
  });

  const fetchApplications = useCallback(async (page = pagination.current, size = pagination.pageSize) => {
    setLoading(true); setError(null);
    try {
      const params = {
        page, limit: size,
        searchCandidate: filters.searchCandidate || undefined,
        universityId: filters.universityId,
        majorId: filters.majorId,
        status: filters.status,
        year: filters.year,
        dateFrom: filters.dateRange?.[0]?.startOf('day').toISOString(), // Bắt đầu ngày
        dateTo: filters.dateRange?.[1]?.endOf('day').toISOString(),
        sortBy: 'submissionDate', sortOrder: 'desc' as 'asc' | 'desc' | undefined,
      };
      const response = await applicationAdminService.getAll(params);      if (response.success && response.data) {
        console.log('Applications data received:', response.data);
        // Add defensive filtering to ensure no null/undefined items
        const validApplications = response.data.filter(app => app && app.id);
        setApplications(validApplications);
        setPagination(prev => ({ ...prev, total: response.total || 0, current: page, pageSize: size }));
      } else { 
        message.error(response.message || 'Không thể tải danh sách hồ sơ.'); 
        setError(response.message || 'Không thể tải danh sách hồ sơ.');
      }
    } catch (err: any) { 
        message.error(err.message || 'Lỗi khi tải dữ liệu hồ sơ.'); 
        setError(err.message || 'Lỗi khi tải dữ liệu hồ sơ.');
    } 
    finally { setLoading(false); }
  }, [pagination.current, pagination.pageSize, filters]);

  useEffect(() => {
    const loadFilterData = async () => {
        setLoadingFilterData(true);
        const uniRes = await universityAdminService.getAll({limit: 1000, sortBy: 'name'});
        if(uniRes.success && uniRes.data) setUniversitiesForFilter(uniRes.data);
        setLoadingFilterData(false);
    };
    loadFilterData();
  }, []); 
  
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

   useEffect(() => { 
    setMajorsForFilter([]);
    if (filters.universityId) {
        setLoadingFilterData(true);
        majorAdminService.getAll({ universityId: filters.universityId, limit: 1000, sortBy: 'name' })
            .then(res => {
                if (res.success && res.data) setMajorsForFilter(res.data.map(m => ({id: m.id, name: m.name, code: m.code})));
            }).finally(() => setLoadingFilterData(false));
    }
  }, [filters.universityId]);

  const handleTableChange: TableProps<ApplicationAdminListItemFE>['onChange'] = (newPagination) => {
    fetchApplications(newPagination.current, newPagination.pageSize);
  };
  
  const handleFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target; // Chỉ lấy value cho Input
    setFilters(prev => ({ ...prev, searchCandidate: value }));
  };
  const handleFilterSelectChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value, ...(name === 'universityId' && { majorId: undefined }) }));
  };  const handleDateRangeChange: RangePickerProps['onChange'] = (dates) => {
    setFilters(prev => ({ ...prev, dateRange: dates as [dayjs.Dayjs, dayjs.Dayjs] | null }));
  };
  const handleViewDetails = async (applicationId: string) => {
    console.log('🔍 HandleViewDetails called with ID:', applicationId);
    
    if (!applicationId) {
      console.error('❌ No application ID provided');
      message.error("ID hồ sơ không hợp lệ.");
      return;
    }
      console.log('📝 Setting loading state and opening modal...');
    setCurrentViewingApplicationId(applicationId);
    setLoadingDetail(true);
    setSelectedApplicationDetail(null); 
    setIsDetailModalVisible(true);
      try {
        console.log('🌐 Making API call to getById:', applicationId);
        const response = await applicationAdminService.getById(applicationId);
        console.log('📦 API Response received:', response);
        
        if (response.success && response.data) {
            console.log('✅ Setting application detail data:', response.data);
            setSelectedApplicationDetail(response.data);
        } else {
            console.error('❌ API response unsuccessful:', response);
            
            // Check for specific error messages
            if (response.message?.includes('Token') || response.message?.includes('unauthorized')) {
              message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            } else {
              message.error(response.message || "Không thể tải chi tiết hồ sơ.");
            }
            setIsDetailModalVisible(false); 
        }
    } catch (err: any) {
        console.error('💥 Error in handleViewDetails:', err);
        
        // Check for network or authentication errors
        if (err.response?.status === 401) {
          message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else if (err.response?.status === 403) {
          message.error("Bạn không có quyền xem chi tiết hồ sơ này.");
        } else if (err.response?.status >= 500) {
          message.error("Lỗi máy chủ. Vui lòng thử lại sau.");
        } else {
          message.error(err.message || "Lỗi khi tải chi tiết hồ sơ.");
        }
        setIsDetailModalVisible(false); 
    } finally {
        console.log('🏁 Setting loading to false');
        setLoadingDetail(false);
    }
  };

  const handleOpenStatusModal = (application: ApplicationAdminListItemFE) => {
    if (!application || !application.id) {
      message.error("Thông tin hồ sơ không hợp lệ.");
      return;
    }
    setProcessingApplication(application);
    // Lấy adminNotes từ selectedApplicationDetail nếu nó đang hiển thị chi tiết của hồ sơ này
    const currentDetailIsThisApp = selectedApplicationDetail && selectedApplicationDetail._id === application.id;
    statusForm.setFieldsValue({
        status: application.status,
        adminNotes: currentDetailIsThisApp ? selectedApplicationDetail.adminNotes : '', 
    });
    setIsStatusModalVisible(true);
  };

  const handleUpdateStatus = async () => {
    if (!processingApplication) return;
    try {
        const values = await statusForm.validateFields();
        setLoading(true); 
        const response = await applicationAdminService.updateStatus(processingApplication.id, values);
        if (response.success) {
            message.success('Cập nhật trạng thái hồ sơ thành công!');
            setIsStatusModalVisible(false);
            setProcessingApplication(null);
            statusForm.resetFields();
            fetchApplications(pagination.current, pagination.pageSize); 
            if (selectedApplicationDetail && selectedApplicationDetail._id === processingApplication.id && response.data) {
                setSelectedApplicationDetail(response.data); // Cập nhật chi tiết nếu đang xem
            }
        } else {
            message.error(response.message || 'Cập nhật trạng thái thất bại.');
        }
    } catch (error) {
        message.error('Lỗi khi cập nhật trạng thái.');
    } finally {
        setLoading(false);
    }
  };  const columns: TableProps<ApplicationAdminListItemFE>['columns'] = [
    {
      title: 'Thông Tin Hồ Sơ',
      key: 'application_info',
      render: (_, record) => {
        if (!record) return <div>N/A</div>;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar
              size={48}
              style={{
                backgroundColor: COLORS.primary,
                fontSize: '16px',
                fontWeight: 'bold'
              }}
              icon={<FolderOpenOutlined />}
            >
              HS
            </Avatar>
            <div>
              <div style={{ 
                fontWeight: 600, 
                fontSize: '14px', 
                color: COLORS.dark,
                marginBottom: '4px'
              }}>
                {record?.candidateName || 'N/A'}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: COLORS.textLight,
                marginBottom: '4px'
              }}>
                Mã: <Text copyable style={{ fontSize: '11px' }}>{record?.id || 'N/A'}</Text>
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: COLORS.textLight
              }}>
                {record?.candidateEmail || 'N/A'}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Nguyện Vọng',
      key: 'application_choice',
      render: (_, record) => {
        if (!record) return <div>N/A</div>;
        return (
          <div>
            <div style={{ 
              fontWeight: 500, 
              fontSize: '13px', 
              color: COLORS.dark,
              marginBottom: '4px'
            }}>
              {record?.universityName || 'N/A'}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: COLORS.textLight,
              marginBottom: '4px'
            }}>
              {record?.majorName || 'N/A'}
            </div>
            <Tag 
              style={{
                backgroundColor: COLORS.blue50,
                color: COLORS.blue500,
                border: `1px solid ${COLORS.blue500}20`,
                borderRadius: '6px',
                fontSize: '10px',
                padding: '2px 6px'
              }}
            >
              Năm {record?.year || 'N/A'}
            </Tag>          </div>
        );
      },
    },
    {
      title: 'Ngày Nộp',
      dataIndex: 'submissionDate',
      key: 'submissionDate',
      width: 120,
      align: 'center',
      render: (date: string) => (
        <div style={{ fontSize: '12px', color: COLORS.text }}>
          {date}
        </div>
      ),
      sorter: (a, b) => {
        if (!a?.submissionDate || !b?.submissionDate) return 0;
        const dateA = new Date(a.submissionDate.split('/').reverse().join('-')).getTime();
        const dateB = new Date(b.submissionDate.split('/').reverse().join('-')).getTime();
        return dateA - dateB;
      }
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
      width: 150,
      align: 'center',
      filters: APPLICATION_STATUSES.map(s => ({text: s.label, value: s.value})),
    },
    {
      title: 'Thao Tác',
      key: 'action',
      width: 140,
      align: 'center',      render: (_, record) => {
        if (!record) return <div>N/A</div>;
        return (
          <Space size="small">
            <Tooltip title="Xem chi tiết">
              <Button
                type="primary"
                shape="circle"
                icon={<EyeOutlined style={{ color: '#ffffff' }} />}
                onClick={() => handleViewDetails(record?.id || '')}
                style={{
                  backgroundColor: COLORS.primary,
                  borderColor: COLORS.primary,
                  boxShadow: `0 2px 4px ${COLORS.primary}30`
                }}
              />
            </Tooltip>
            <Tooltip title="Cập nhật trạng thái">
              <Button
                shape="circle"
                icon={<EditOutlined style={{ color: '#ffffff' }} />}
                onClick={() => handleOpenStatusModal(record)}
                style={{
                  backgroundColor: COLORS.accent,
                  borderColor: COLORS.accent,
                  boxShadow: `0 2px 4px ${COLORS.accent}30`
                }}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];
  return (
    <>
      <style>{`
        .modern-applications-management {
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }
        
        .modern-applications-management .ant-table-thead > tr > th {
          background: linear-gradient(135deg, ${COLORS.gray50} 0%, ${COLORS.gray100} 100%) !important;
          color: ${COLORS.text} !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          border: none !important;
          padding: 20px 16px !important;
        }
        
        .modern-applications-management .ant-table-tbody > tr > td {
          padding: 20px 16px !important;
          border: none !important;
          border-bottom: 1px solid ${COLORS.gray100} !important;
        }
        
        .modern-applications-management .ant-table-tbody > tr:hover > td {
          background: ${COLORS.blue50} !important;
        }
        
        .modern-applications-management .ant-table {
          border-radius: 16px !important;
          overflow: hidden !important;
        }
        
        .modern-applications-management .ant-input,
        .modern-applications-management .ant-select-selector {
          border-radius: 12px !important;
          border-color: ${COLORS.gray200} !important;
          transition: all 0.3s ease !important;
        }
        
        .modern-applications-management .ant-input:focus,
        .modern-applications-management .ant-select-focused .ant-select-selector {
          border-color: ${COLORS.primary} !important;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1) !important;
        }
        
        .modern-applications-management .ant-btn {
          border-radius: 12px !important;
          font-weight: 500 !important;
          transition: all 0.3s ease !important;
        }
        
        .modern-applications-management .ant-btn:hover {
          transform: translateY(-1px) !important;
        }
        
        .modern-applications-management .ant-modal-content {
          border-radius: 16px !important;
        }
        
        .modern-applications-management .ant-modal-header {
          border-bottom: 1px solid ${COLORS.gray100} !important;
        }
        
        @media (max-width: 768px) {
          .modern-applications-management .mobile-stack {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>
      
      <div className="modern-applications-management" style={{ 
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
                icon={<FileSearchOutlined />} 
              />
              <div>
                <Title level={2} style={{ color: COLORS.white, margin: 0, fontSize: '32px', fontWeight: '700' }}>
                  Quản Lý Hồ Sơ Tuyển Sinh
                </Title>
                <Paragraph style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  margin: 0, 
                  fontSize: '16px',
                  marginTop: '8px'
                }}>
                  Xem, duyệt và quản lý trạng thái các hồ sơ đăng ký của thí sinh
                </Paragraph>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FilterOutlined style={{ color: COLORS.primary }} />
                <span style={{ color: COLORS.dark, fontWeight: 600 }}>Bộ lọc hồ sơ</span>
              </div>
            }
            style={{
              marginBottom: '32px',
              borderRadius: '16px',
              border: `1px solid ${COLORS.gray200}`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
            size="small"
          >
            <Row gutter={[16,16]} align="bottom">
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label={<span style={{ fontWeight: 600, color: COLORS.dark }}>Tìm kiếm thí sinh/Mã HS</span>} className="!mb-0">
                  <Input
                    name="searchCandidate" 
                    prefix={<SearchOutlined />}
                    placeholder="Tên, Email, Mã HS..."
                    value={filters.searchCandidate}
                    onChange={handleFilterInputChange}
                    allowClear
                    style={{ height: '42px' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={5}>
                <Form.Item label={<span style={{ fontWeight: 600, color: COLORS.dark }}>Trạng thái</span>} className="!mb-0">
                  <Select
                    placeholder="Tất cả trạng thái"
                    style={{ width: '100%', height: '42px' }}
                    allowClear
                    value={filters.status}
                    onChange={value => handleFilterSelectChange('status', value)}
                    options={APPLICATION_STATUSES}
                  />
                </Form.Item>
              </Col>              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label={<span style={{ fontWeight: 600, color: COLORS.dark }}>Trường ĐH</span>} className="!mb-0">
                  <Select 
                    placeholder="Tất cả trường" 
                    style={{ width: '100%', height: '42px' }} 
                    allowClear 
                    value={filters.universityId} 
                    onChange={value => handleFilterSelectChange('universityId', value)} 
                    loading={loadingFilterData && universitiesForFilter.length === 0} 
                    showSearch 
                    filterOption={(input, option) => (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())}
                  >
                    {universitiesForFilter.map(u => <Option key={u.id} value={u.id} label={u.name}>{u.name} ({u.code})</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={7}>
                <Form.Item label={<span style={{ fontWeight: 600, color: COLORS.dark }}>Ngành học</span>} className="!mb-0">
                  <Select 
                    placeholder="Tất cả ngành" 
                    style={{ width: '100%', height: '42px' }} 
                    allowClear 
                    value={filters.majorId} 
                    onChange={value => handleFilterSelectChange('majorId', value)} 
                    loading={loadingFilterData && !!filters.universityId} 
                    disabled={!filters.universityId} 
                    showSearch 
                    filterOption={(input, option) => (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())}
                  >
                    {majorsForFilter.map(m => <Option key={m.id} value={m.id} label={m.name}>{m.name} ({m.code})</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={5}>
                <Form.Item label={<span style={{ fontWeight: 600, color: COLORS.dark }}>Năm XT</span>} className="!mb-0">
                  <Select 
                    placeholder="Tất cả năm" 
                    style={{ width: '100%', height: '42px' }} 
                    allowClear 
                    value={filters.year} 
                    onChange={value => handleFilterSelectChange('year', value)} 
                    options={yearOptions} 
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={7}>
                <Form.Item label={<span style={{ fontWeight: 600, color: COLORS.dark }}>Ngày nộp</span>} className="!mb-0">
                  <RangePicker 
                    style={{ width: '100%', height: '42px' }} 
                    value={filters.dateRange} 
                    onChange={handleDateRangeChange} 
                  />
                </Form.Item>              </Col>
              {/* Commented out Filter and Reset buttons as requested */}
              {/* <Col xs={24} sm={12} md={8} lg={4}>
                <Button 
                  icon={<FilterOutlined />} 
                  onClick={onApplyFilters} 
                  loading={loading} 
                  type="primary" 
                  block
                  style={{
                    height: '42px',
                    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                    border: 'none',
                    fontWeight: 600,
                    boxShadow: `0 4px 12px ${COLORS.primary}30`
                  }}
                >
                  Lọc
                </Button>
              </Col>
              <Col xs={24} sm={12} md={8} lg={3}>
                <Button 
                  onClick={onResetFilters} 
                  loading={loading} 
                  block
                  style={{
                    height: '42px',
                    border: `2px solid ${COLORS.gray200}`,
                    color: COLORS.text,
                    fontWeight: 500
                  }}
                >
                  Reset
                </Button>
              </Col> */}
            </Row>
          </Card>

          {error && !loading && (
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
          
          {/* Table Section */}          <Table 
            columns={columns} 
            dataSource={applications?.filter(app => app && app.id) || []} 
            rowKey="id" 
            loading={loading}
            pagination={{
              ...pagination,
              style: { marginTop: '32px' },
              showTotal: (total, range) => 
                `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} hồ sơ`,
              simple: false,
              showQuickJumper: false,
              showSizeChanger: true
            }}
            onChange={handleTableChange}
            scroll={{ x: 'max-content' }}
            style={{
              background: COLORS.white,
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}
            locale={{ emptyText: <Empty description="Không có hồ sơ nào phù hợp với tiêu chí lọc." /> }}          />

        {/* Detail Modal */}
        <Modal
          title={
            <div style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              color: COLORS.dark,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Avatar
                size={32}
                style={{
                  backgroundColor: COLORS.primary,
                }}
                icon={<FileSearchOutlined />}
              />
              Chi Tiết Hồ Sơ Tuyển Sinh
            </div>
          }          open={isDetailModalVisible}          onCancel={() => {
            setIsDetailModalVisible(false);
            setSelectedApplicationDetail(null);
            setCurrentViewingApplicationId(null);
          }}footer={
            !loadingDetail && !selectedApplicationDetail ? (
              <Space>
                <Button 
                  onClick={() => {
                    setIsDetailModalVisible(false);
                    setSelectedApplicationDetail(null);
                    setCurrentViewingApplicationId(null);
                  }}
                >
                  Đóng
                </Button>
                <Button 
                  type="primary" 
                  onClick={() => {
                    if (currentViewingApplicationId) {
                      handleViewDetails(currentViewingApplicationId);
                    }
                  }}
                  disabled={!currentViewingApplicationId}
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                    border: 'none',
                    height: '42px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    boxShadow: `0 4px 12px ${COLORS.primary}30`
                  }}
                >
                  Thử lại
                </Button>
              </Space>
            ) : (
              <Button 
                type="primary" 
                onClick={() => {
                  setIsDetailModalVisible(false);
                  setSelectedApplicationDetail(null);
                  setCurrentViewingApplicationId(null);
                }}
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                  border: 'none',
                  height: '42px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  boxShadow: `0 4px 12px ${COLORS.primary}30`
                }}
              >
                Đóng
              </Button>
            )
          }
          width={900}
          destroyOnClose
        >          {loadingDetail && (
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px', color: COLORS.textLight }}>
                Đang tải chi tiết hồ sơ...
              </div>
            </div>
          )}          {!loadingDetail && !selectedApplicationDetail && (
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <Alert
                message="Không thể tải chi tiết hồ sơ"
                description={
                  <div>
                    <p>Vui lòng thử lại hoặc kiểm tra kết nối mạng.</p>
                    <p>Nếu vấn đề vẫn tiếp tục, hãy liên hệ với quản trị viên.</p>
                    <details style={{ marginTop: '8px', fontSize: '12px', color: COLORS.textLight }}>
                      <summary style={{ cursor: 'pointer' }}>Chi tiết debug</summary>
                      <div style={{ marginTop: '8px', textAlign: 'left', fontFamily: 'monospace' }}>
                        <div>API Endpoint: GET /admin/applications/[id]</div>
                        <div>Base URL: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}</div>
                        <div>Token: {localStorage.getItem('authToken') ? 'Có' : 'Không có'}</div>
                        <div>Hãy mở Console (F12) để xem log chi tiết</div>
                      </div>
                    </details>
                  </div>
                }
                type="error"
                showIcon
                style={{
                  borderRadius: '12px',
                  border: `1px solid ${COLORS.red500}20`,
                  textAlign: 'left'
                }}
              />
            </div>
          )}{!loadingDetail && selectedApplicationDetail && (
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.gray50} 0%, ${COLORS.blue50} 100%)`,
              padding: '24px',
              borderRadius: '16px',
              margin: '16px 0'
            }}>
              <Descriptions 
                bordered 
                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} 
                layout="vertical" 
                size="small"
                style={{
                  background: COLORS.white,
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              >
                <Descriptions.Item label="Mã Hồ Sơ" span={2} contentStyle={{fontWeight: 'bold'}}>{selectedApplicationDetail._id}</Descriptions.Item>
                <Descriptions.Item label="Trạng Thái">{getStatusTag(selectedApplicationDetail.status)}</Descriptions.Item>
                <Descriptions.Item label="Ngày Nộp">{new Date(selectedApplicationDetail.submissionDate).toLocaleString('vi-VN')}</Descriptions.Item>
                
                <Descriptions.Item label="Thí Sinh" span={2} contentStyle={{fontWeight: 'bold'}}>
                    <Space><UserOutlined /> {selectedApplicationDetail.candidateProfileSnapshot?.fullName || 'N/A'}</Space>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày Sinh">{selectedApplicationDetail.candidateProfileSnapshot?.dob ? new Date(selectedApplicationDetail.candidateProfileSnapshot.dob).toLocaleDateString('vi-VN') : 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="CCCD/CMND">{selectedApplicationDetail.candidateProfileSnapshot?.idNumber || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Email Liên Hệ">{selectedApplicationDetail.candidateProfileSnapshot?.email || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Số Điện Thoại">{selectedApplicationDetail.candidateProfileSnapshot?.phoneNumber || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ thường trú" span={2}>{selectedApplicationDetail.candidateProfileSnapshot?.permanentAddress || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Khu vực ưu tiên">{selectedApplicationDetail.candidateProfileSnapshot?.priorityArea || 'Không'}</Descriptions.Item>
                <Descriptions.Item label="Đối tượng ưu tiên">{(selectedApplicationDetail.candidateProfileSnapshot?.priorityObjects || []).join(', ') || 'Không'}</Descriptions.Item>
                
                <Descriptions.Item label="Trường THPT">{selectedApplicationDetail.candidateProfileSnapshot?.highSchoolName || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Năm Tốt Nghiệp">{selectedApplicationDetail.candidateProfileSnapshot?.graduationYear || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Điểm TB Lớp 12">{selectedApplicationDetail.candidateProfileSnapshot?.gpa12 ?? 'N/A'}</Descriptions.Item>

                <Descriptions.Item label="Trường Đăng Ký" span={2}>
                  {selectedApplicationDetail.university && typeof selectedApplicationDetail.university === 'object' 
                    ? `${selectedApplicationDetail.university.name || 'N/A'} (${selectedApplicationDetail.university.code || 'N/A'})` 
                    : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Ngành Đăng Ký">
                  {selectedApplicationDetail.major && typeof selectedApplicationDetail.major === 'object' 
                    ? `${selectedApplicationDetail.major.name || 'N/A'} (${selectedApplicationDetail.major.code || 'N/A'})` 
                    : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Phương Thức XT">
                  {selectedApplicationDetail.admissionMethod && typeof selectedApplicationDetail.admissionMethod === 'object' 
                    ? selectedApplicationDetail.admissionMethod.name || 'N/A' 
                    : 'N/A'}
                </Descriptions.Item>
                
                {selectedApplicationDetail.subjectGroup && typeof selectedApplicationDetail.subjectGroup === 'object' && (
                    <Descriptions.Item label="Tổ Hợp Môn">
                      {`${selectedApplicationDetail.subjectGroup.name || 'N/A'} (${selectedApplicationDetail.subjectGroup.code || 'N/A'})`}
                    </Descriptions.Item>
                )}

                {selectedApplicationDetail.examScores && Object.keys(selectedApplicationDetail.examScores).length > 0 && (
                    <Descriptions.Item label="Điểm Thi Tổ Hợp" span={2}>
                        <Space wrap>
                            {Object.entries(selectedApplicationDetail.examScores).map(([subject, score]) => (
                                <Tag color="geekblue" key={subject} style={{ fontSize: '12px', padding: '4px 8px' }}>{subject}: <Text strong>{score}</Text></Tag>
                            ))}
                        </Space>
                    </Descriptions.Item>
                )}

                <Descriptions.Item label="Minh Chứng Đính Kèm" span={2}>
                    {selectedApplicationDetail.documents && selectedApplicationDetail.documents.length > 0 ? (
                        <List
                            size="small"
                            itemLayout="horizontal"
                            dataSource={selectedApplicationDetail.documents}
                            renderItem={(doc: UploadedFileResponse) => (
                                <List.Item
                                    actions={[
                                        <Button 
                                            type="link" 
                                            href={doc.filePath ? `${process.env.REACT_APP_API_BASE_URL?.replace('/api','')}/${doc.filePath}` : '#'}
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            key="download"
                                            icon={getDocumentIcon(doc.documentType || '')}
                                            disabled={!doc.filePath}
                                            size="small"
                                        >
                                            Xem/Tải
                                        </Button>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={getDocumentIcon(doc.documentType || '')}
                                        title={<Text strong style={{ fontSize: '13px' }}>{doc.originalName || 'Không rõ tên file'}</Text>}
                                        description={<Text type="secondary" style={{ fontSize: '11px' }}>Loại: {doc.documentType || 'Không rõ'} - {doc.fileSize ? (doc.fileSize / (1024*1024)).toFixed(2) + ' MB' : 'Không rõ dung lượng'}</Text>}
                                    />
                                </List.Item>
                            )}
                        />
                    ) : <Text type="secondary">Không có minh chứng nào.</Text>}
                </Descriptions.Item>
                {selectedApplicationDetail.adminNotes && (
                    <Descriptions.Item label="Ghi Chú Từ Ban Tuyển Sinh" span={2}>
                        <Alert message={selectedApplicationDetail.adminNotes} type="info" icon={<InfoCircleOutlined />} />
                    </Descriptions.Item>
                )}
                 {selectedApplicationDetail.lastProcessedBy && typeof selectedApplicationDetail.lastProcessedBy === 'object' && (
                    <Descriptions.Item label="Xử lý bởi Admin" span={2}>
                        <Text>{(selectedApplicationDetail.lastProcessedBy as User).fullName || (selectedApplicationDetail.lastProcessedBy as User).email}</Text>
                        {selectedApplicationDetail.processedAt && <Text type="secondary"> lúc {new Date(selectedApplicationDetail.processedAt).toLocaleString('vi-VN')}</Text>}
                    </Descriptions.Item>
                )}
              </Descriptions>
            </div>
          )}
        </Modal>

        {/* Status Update Modal */}
        <Modal
          title={
            <div style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              color: COLORS.dark,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Avatar
                size={32}
                style={{
                  backgroundColor: COLORS.accent,
                }}
                icon={<EditOutlined />}
              />
              Cập Nhật Trạng Thái Hồ Sơ
            </div>
          }
          open={isStatusModalVisible}
          onOk={handleUpdateStatus}
          onCancel={() => {setIsStatusModalVisible(false); setProcessingApplication(null); statusForm.resetFields();}}
          confirmLoading={loading}
          okText="Lưu thay đổi"
          cancelText="Hủy"
          destroyOnClose
          okButtonProps={{
            style: {
              background: `linear-gradient(135deg, ${COLORS.accent} 0%, #059669 100%)`,
              border: 'none',
              height: '42px',
              borderRadius: '12px',
              fontWeight: 600,
              boxShadow: `0 4px 12px ${COLORS.accent}30`
            }
          }}
          cancelButtonProps={{
            style: {
              height: '42px',
              borderRadius: '12px',
              border: `2px solid ${COLORS.gray200}`,
              color: COLORS.text,
              fontWeight: 500
            }
          }}
        >
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.gray50} 0%, ${COLORS.blue50} 100%)`,
            padding: '24px',
            borderRadius: '16px',
            margin: '16px 0'
          }}>
            <Form form={statusForm} layout="vertical">
              <div style={{ marginBottom: '16px' }}>
                <Title level={5} style={{ color: COLORS.dark, margin: 0 }}>
                  Hồ sơ: <Text copyable style={{ color: COLORS.primary }}>{processingApplication?.id}</Text>
                </Title>
                <Paragraph style={{ color: COLORS.textLight, margin: 0, marginTop: '4px' }}>
                  Thí sinh: <Text strong style={{ color: COLORS.dark }}>{processingApplication?.candidateName}</Text>
                </Paragraph>
              </div>
              
              <Form.Item
                name="status"
                label={<span style={{ fontWeight: 600, color: COLORS.dark, fontSize: '15px' }}>Trạng thái mới</span>}
                rules={[{required: true, message: "Vui lòng chọn trạng thái!"}]}
              >
                <Select 
                  placeholder="Chọn trạng thái"
                  style={{ height: '44px' }}
                >
                  {APPLICATION_STATUSES.map(s => (
                    <Option key={s.value} value={s.value}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {s.icon}
                        {s.label}
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                name="adminNotes"
                label={<span style={{ fontWeight: 600, color: COLORS.dark, fontSize: '15px' }}>Ghi chú của Admin (sẽ được gửi cho thí sinh nếu có)</span>}
              >
                <Input.TextArea 
                  rows={3} 
                  placeholder="Nhập ghi chú (nếu có)..." 
                  style={{
                    borderRadius: '12px',
                    border: `2px solid ${COLORS.gray200}`
                  }}
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>
        </Card>
      </div>
    </>
  );
};
export default AdminManageApplications;