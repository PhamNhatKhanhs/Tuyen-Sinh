import React, { useState, useEffect, useCallback } from 'react';
import { 
    Typography, Table, Button, Modal, Form, Select, Space, Tooltip, Tag, 
    Input, DatePicker, Card, Row, Col, Spin, Alert, Descriptions, List, message, Empty 
} from 'antd';
import { 
    EyeOutlined, EditOutlined, ReloadOutlined, FilterOutlined, SearchOutlined, 
    FilePdfOutlined, FileImageOutlined, FileTextOutlined, InfoCircleOutlined,
    UserOutlined // Thêm UserOutlined cho candidate info
} from '@ant-design/icons';
import type { TableProps, PaginationProps } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';

import applicationAdminService from '../services/applicationAdminService';
import { ApplicationAdminListItemFE, ApplicationDetailBE, CandidateProfileSnapshot } from '../../application/types';
import { UploadedFileResponse } from '../../upload/types';
import { User } from '../../auth/store/authSlice';

import universityAdminService from '../services/universityAdminService';
import majorAdminService from '../services/majorAdminService';
import { UniversityFE } from '../../university/types';
import { MajorFE } from '../../major/types';



const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const APPLICATION_STATUSES = [
    { value: 'pending', label: 'Chờ duyệt', color: 'processing' },
    { value: 'processing', label: 'Đang xử lý', color: 'blue' },
    { value: 'additional_required', label: 'Cần bổ sung', color: 'warning' },
    { value: 'approved', label: 'Đã duyệt', color: 'success' },
    { value: 'rejected', label: 'Từ chối', color: 'error' },
    { value: 'cancelled', label: 'Đã hủy', color: 'default' },
];

const getStatusTag = (statusValue?: ApplicationDetailBE['status']) => {
  if (!statusValue) return <Tag color="default">KHÔNG RÕ</Tag>;
  const statusObj = APPLICATION_STATUSES.find(s => s.value === statusValue);
  return <Tag color={statusObj?.color || 'default'} className="font-semibold px-2 py-1 text-xs">{statusObj?.label.toUpperCase() || statusValue.toUpperCase()}</Tag>;
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
        sortBy: 'submissionDate', sortOrder: 'desc',
      };
      const response = await applicationAdminService.getAll(params);
      if (response.success && response.data) {
        setApplications(response.data);
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


  const handleTableChange: TableProps<ApplicationAdminListItemFE>['onChange'] = (newPagination, tableFilters, sorterResult) => {
    // Xử lý sorter nếu cần
    // const sorterParams = Array.isArray(sorterResult) ? sorterResult[0] : sorterResult;
    // const sortBy = sorterParams.field as string;
    // const sortOrder = sorterParams.order === 'ascend' ? 'asc' : 'desc';
    // setFilters(prev => ({...prev, sortBy, sortOrder})); // Cần thêm sortBy, sortOrder vào state filters
    fetchApplications(newPagination.current, newPagination.pageSize);
  };
  
  const handleFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target; // Chỉ lấy value cho Input
    setFilters(prev => ({ ...prev, searchCandidate: value }));
  };
  const handleFilterSelectChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value, ...(name === 'universityId' && { majorId: undefined }) }));
  };
   const handleDateRangeChange: RangePickerProps['onChange'] = (dates) => {
    setFilters(prev => ({ ...prev, dateRange: dates as [dayjs.Dayjs, dayjs.Dayjs] | null }));
  };

  const onApplyFilters = () => {
      fetchApplications(1, pagination.pageSize); 
  };
  const onResetFilters = () => {
    setFilters({
        searchCandidate: '',
        universityId: undefined,
        majorId: undefined,
        status: undefined,
        year: new Date().getFullYear(),
        dateRange: null,
    });
    // fetchApplications(1, pagination.pageSize); // Sẽ được trigger bởi useEffect của fetchApplications khi filters thay đổi
  };


  const handleViewDetails = async (applicationId: string) => {
    setLoadingDetail(true);
    setSelectedApplicationDetail(null); 
    setIsDetailModalVisible(true);
    try {
        const response = await applicationAdminService.getById(applicationId);
        if (response.success && response.data) {
            setSelectedApplicationDetail(response.data);
        } else {
            message.error(response.message || "Không thể tải chi tiết hồ sơ.");
            setIsDetailModalVisible(false); 
        }
    } catch (err: any) {
        message.error(err.message || "Lỗi khi tải chi tiết hồ sơ.");
        setIsDetailModalVisible(false); 
    } finally {
        setLoadingDetail(false);
    }
  };

  const handleOpenStatusModal = (application: ApplicationAdminListItemFE) => {
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
  };

  const columns: TableProps<ApplicationAdminListItemFE>['columns'] = [
    { title: 'Mã HS', dataIndex: 'id', key: 'id', width: 180, render: (text) => <Text strong copyable>{text}</Text>, fixed: 'left', sorter: (a,b) => a.id.localeCompare(b.id) },
    { title: 'Thí Sinh', dataIndex: 'candidateName', key: 'candidateName', width: 200, ellipsis: true, sorter: (a,b) => (a.candidateName || '').localeCompare(b.candidateName || '') },
    { title: 'Email TS', dataIndex: 'candidateEmail', key: 'candidateEmail', width: 220, ellipsis: true, responsive: ['lg'], sorter: (a,b) => (a.candidateEmail || '').localeCompare(b.candidateEmail || '') },
    { title: 'Trường ĐK', dataIndex: 'universityName', key: 'universityName', width: 250, ellipsis: true, sorter: (a,b) => (a.universityName || '').localeCompare(b.universityName || '') },
    { title: 'Ngành ĐK', dataIndex: 'majorName', key: 'majorName', width: 250, ellipsis: true, sorter: (a,b) => (a.majorName || '').localeCompare(b.majorName || '') },
    { title: 'Năm XT', dataIndex: 'year', key: 'year', width: 80, align: 'center', sorter: (a,b) => a.year - b.year },
    { title: 'Ngày Nộp', dataIndex: 'submissionDate', key: 'submissionDate', width: 120, align: 'center', sorter: (a,b) => new Date(a.submissionDate.split('/').reverse().join('-')).getTime() - new Date(b.submissionDate.split('/').reverse().join('-')).getTime() },
    { title: 'Trạng Thái', dataIndex: 'status', key: 'status', render: getStatusTag, width: 150, align: 'center', fixed: 'right',
      filters: APPLICATION_STATUSES.map(s => ({text: s.label, value: s.value})),
      // onFilter được xử lý qua state `filters` và nút "Lọc"
    },
    {
      title: 'Hành Động',
      key: 'action',
      width: 100, // Giảm width nếu chỉ có 2 nút
      align: 'center',
      fixed: 'right',
      render: (_: any, record: ApplicationAdminListItemFE) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết hồ sơ">
            <Button type="text" shape="circle" icon={<EyeOutlined className="text-blue-600"/>} onClick={() => handleViewDetails(record.id)} />
          </Tooltip>
          <Tooltip title="Cập nhật trạng thái">
            <Button type="text" shape="circle" icon={<EditOutlined className="text-green-600"/>} onClick={() => handleOpenStatusModal(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card title={<Title level={3} className="!mb-0">Quản Lý Hồ Sơ Tuyển Sinh</Title>} className="shadow-lg rounded-lg">
      <Paragraph className="text-gray-600 mb-6">
        Xem, duyệt và quản lý trạng thái các hồ sơ đăng ký của thí sinh.
      </Paragraph>
      
      <Card title={<><FilterOutlined /> Bộ lọc hồ sơ</>} className="mb-6 shadow-sm rounded-lg" bordered={false} size="small">
        <Row gutter={[16,16]} align="bottom">
            <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label="Tìm kiếm thí sinh/Mã HS" className="!mb-0">
                <Input
                    name="searchCandidate" 
                    prefix={<SearchOutlined />}
                    placeholder="Tên, Email, Mã HS..."
                    value={filters.searchCandidate}
                    onChange={handleFilterInputChange}
                    allowClear
                />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={5}>
                <Form.Item label="Trạng thái" className="!mb-0">
                <Select
                    placeholder="Tất cả trạng thái"
                    style={{ width: '100%' }}
                    allowClear
                    value={filters.status}
                    onChange={value => handleFilterSelectChange('status', value)}
                    options={APPLICATION_STATUSES}
                />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label="Trường ĐH" className="!mb-0">
                <Select placeholder="Tất cả trường" style={{ width: '100%' }} allowClear value={filters.universityId} onChange={value => handleFilterSelectChange('universityId', value)} loading={loadingFilterData && universitiesForFilter.length === 0} showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>
                    {universitiesForFilter.map(u => <Option key={u.id} value={u.id} label={u.name}>{u.name} ({u.code})</Option>)}
                </Select>
                </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={7}>
                 <Form.Item label="Ngành học" className="!mb-0">
                <Select placeholder="Tất cả ngành" style={{ width: '100%' }} allowClear value={filters.majorId} onChange={value => handleFilterSelectChange('majorId', value)} loading={loadingFilterData && !!filters.universityId} disabled={!filters.universityId} showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>
                    {majorsForFilter.map(m => <Option key={m.id} value={m.id} label={m.name}>{m.name} ({m.code})</Option>)}
                </Select>
                </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={5}>
                <Form.Item label="Năm XT" className="!mb-0">
                <Select placeholder="Tất cả năm" style={{ width: '100%' }} allowClear value={filters.year} onChange={value => handleFilterSelectChange('year', value)} options={yearOptions} />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={7}>
                <Form.Item label="Ngày nộp" className="!mb-0">
                <RangePicker style={{ width: '100%' }} value={filters.dateRange} onChange={handleDateRangeChange} />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
                <Button icon={<FilterOutlined />} onClick={onApplyFilters} loading={loading} type="primary" block>Lọc</Button>
            </Col>
             <Col xs={24} sm={12} md={8} lg={3}>
                <Button icon={<ReloadOutlined />} onClick={onResetFilters} loading={loading} block>Reset Filter</Button>
            </Col>
        </Row>
      </Card>

      {error && !loading && <Alert message={error} type="error" showIcon className="mb-4" />}
      
      <Table 
        columns={columns} 
        dataSource={applications} 
        rowKey="id" 
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 1500 }}
        className="shadow rounded-lg overflow-hidden"
        bordered
        locale={{ emptyText: <Empty description="Không có hồ sơ nào phù hợp với tiêu chí lọc." /> }}
       />

       <Modal
        title={<Title level={4} className="!m-0 text-indigo-700">Chi Tiết Hồ Sơ Tuyển Sinh</Title>}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={<Button type="primary" onClick={() => setIsDetailModalVisible(false)}>Đóng</Button>}
        width={900}
        destroyOnHidden
       >
        {loadingDetail && <div className="text-center py-8"><Spin size="large" tip="Đang tải chi tiết..." /></div>}
        {!loadingDetail && selectedApplicationDetail && (
            <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} layout="vertical" size="small">
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


                <Descriptions.Item label="Trường Đăng Ký" span={2}>{typeof selectedApplicationDetail.university === 'object' ? `${selectedApplicationDetail.university.name} (${selectedApplicationDetail.university.code})` : 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Ngành Đăng Ký">{typeof selectedApplicationDetail.major === 'object' ? `${selectedApplicationDetail.major.name} (${selectedApplicationDetail.major.code})` : 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Phương Thức XT">{typeof selectedApplicationDetail.admissionMethod === 'object' ? selectedApplicationDetail.admissionMethod.name : 'N/A'}</Descriptions.Item>
                
                {selectedApplicationDetail.subjectGroup && typeof selectedApplicationDetail.subjectGroup === 'object' && (
                    <Descriptions.Item label="Tổ Hợp Môn">{`${selectedApplicationDetail.subjectGroup.name} (${selectedApplicationDetail.subjectGroup.code})`}</Descriptions.Item>
                )}

                {selectedApplicationDetail.examScores && Object.keys(selectedApplicationDetail.examScores).length > 0 && (
                    <Descriptions.Item label="Điểm Thi Tổ Hợp" span={2}>
                        <Space wrap>
                            {Object.entries(selectedApplicationDetail.examScores).map(([subject, score]) => (
                                <Tag color="geekblue" key={subject} className="text-sm px-2 py-1">{subject}: <Text strong>{score}</Text></Tag>
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
                                            href={doc.filePath ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api','')}/${doc.filePath}` : '#'}
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            key="download"
                                            icon={getDocumentIcon(doc.fileType || '')}
                                            disabled={!doc.filePath}
                                            size="small"
                                        >
                                            Xem/Tải
                                        </Button>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={getDocumentIcon(doc.fileType || '')}
                                        title={<Text strong className="text-sm">{doc.originalName || 'Không rõ tên file'}</Text>}
                                        description={<Text type="secondary" className="text-xs">Loại: {doc.documentType || 'Không rõ'} - {doc.fileSize ? (doc.fileSize / (1024*1024)).toFixed(2) + ' MB' : 'Không rõ dung lượng'}</Text>}
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
        )}
       </Modal>

       <Modal
        title={<Title level={4} className="!m-0 text-indigo-700">Cập Nhật Trạng Thái Hồ Sơ</Title>}
        open={isStatusModalVisible}
        onOk={handleUpdateStatus}
        onCancel={() => {setIsStatusModalVisible(false); setProcessingApplication(null); statusForm.resetFields();}}
        confirmLoading={loading}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        destroyOnHidden
       >
        <Form form={statusForm} layout="vertical">
            <Title level={5}>Hồ sơ: <Text copyable>{processingApplication?.id}</Text></Title>
            <Paragraph>Thí sinh: <Text strong>{processingApplication?.candidateName}</Text></Paragraph>
            <Form.Item
                name="status"
                label="Trạng thái mới"
                rules={[{required: true, message: "Vui lòng chọn trạng thái!"}]}
            >
                <Select placeholder="Chọn trạng thái">
                    {APPLICATION_STATUSES.map(s => (
                        <Option key={s.value} value={s.value}>{s.label}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="adminNotes"
                label="Ghi chú của Admin (sẽ được gửi cho thí sinh nếu có)"
            >
                <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu có)..." />
            </Form.Item>
        </Form>
       </Modal>
    </Card>
  );
};
export default AdminManageApplications;