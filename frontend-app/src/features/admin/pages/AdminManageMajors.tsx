import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Modal, Form, Input, Space, Tooltip, Popconfirm, message, Switch, InputNumber, Select, Tag, Row, Col, Card, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, BookOutlined, BankOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import majorAdminService from '../services/majorAdminService';
import { MajorFE } from '../../major/types';
import { UniversityFE } from '../../university/types';

const { Title, Paragraph } = Typography;
const { Option } = Select;

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
};

interface MajorFormData {
  name: string;
  code: string;
  university: string; // Sẽ là universityId
  description?: string;
  admissionQuota?: number;
  isActive?: boolean;
}

const AdminManageMajors: React.FC = () => {
  const [majors, setMajors] = useState<MajorFE[]>([]);
  const [universitiesForFilter, setUniversitiesForFilter] = useState<Pick<UniversityFE, 'id' | 'name' | 'code'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMajor, setEditingMajor] = useState<MajorFE | null>(null);
  const [form] = Form.useForm<MajorFormData>();
  
  const [filterUniversityId, setFilterUniversityId] = useState<string | undefined>(undefined);
  const [searchText, setSearchText] = useState('');  const [pagination, setPagination] = useState({
    current: 1, 
    pageSize: 5, 
    total: 0, 
    showSizeChanger: true, 
    pageSizeOptions: ['5', '10', '20']
  });  const fetchMajors = useCallback(async (page?: number, size?: number, search?: string, uniId?: string) => {
    setLoading(true);
    try {
      const currentPage = page || pagination.current;
      const currentSize = size || pagination.pageSize;
      const currentSearch = search !== undefined ? search : searchText;
      const currentUniId = uniId !== undefined ? uniId : filterUniversityId;
      
      console.log('Fetching majors with params:', { 
        page: currentPage, 
        limit: currentSize, 
        search: currentSearch, 
        universityId: currentUniId 
      });
      
      const response = await majorAdminService.getAll({ 
        page: currentPage, 
        limit: currentSize, 
        search: currentSearch, 
        universityId: currentUniId 
      });
      
      console.log('Response from service:', response);
      
      if (response.success && response.data && Array.isArray(response.data)) {
        // Validate data before setting
        const validData = response.data.filter(major => major && major.id);
        console.log('Valid majors data:', validData);
        
        setMajors(validData);
        setPagination(prev => ({ 
          ...prev, 
          total: response.total || 0, 
          current: currentPage, 
          pageSize: currentSize 
        }));
      } else {
        console.error('Invalid response structure:', response);
        setMajors([]);
        message.error(response.message || 'Không thể tải danh sách ngành.');
      }
    } catch (error) { 
      console.error('Error fetching majors:', error);
      setMajors([]);
      message.error('Lỗi khi tải dữ liệu ngành.'); 
    } 
    finally { setLoading(false); }
  }, [searchText, filterUniversityId, pagination.current, pagination.pageSize]);  useEffect(() => {
    // Fetch universities for filter dropdown
    const fetchUniversitiesForFilter = async () => {
        const res = await majorAdminService.getUniversitiesForSelect();
        if (res.success && res.data) {
            setUniversitiesForFilter(res.data);
        }
    };
    fetchUniversitiesForFilter();
    fetchMajors(1, pagination.pageSize, '', undefined);
  }, []); // Empty dependency array to run only once

  const handleTableChange: TableProps<MajorFE>['onChange'] = (newPagination) => {
    fetchMajors(newPagination.current, newPagination.pageSize, searchText, filterUniversityId);
  };

  const handleAdd = () => {
    setEditingMajor(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true, admissionQuota: 0 });
    setIsModalVisible(true);
  };

  const handleEdit = (record: MajorFE) => {
    setEditingMajor(record);
    form.setFieldsValue({
        ...record,
        university: record.universityId, // form field là 'university', data là 'universityId'
    });
    setIsModalVisible(true);
  };  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      console.log('Deleting major with ID:', id);
      
      const response = await majorAdminService.delete(id);
      console.log('Delete response:', response);
      
      if (response.success) {
        message.success('Xóa ngành thành công!');
        // Check if current page becomes empty after deletion
        const newTotal = Math.max(0, (pagination.total || 0) - 1);
        const maxPage = Math.ceil(newTotal / pagination.pageSize) || 1;
        const targetPage = pagination.current > maxPage ? maxPage : pagination.current;
        
        // Refresh the data
        await fetchMajors(targetPage, pagination.pageSize, searchText, filterUniversityId);
      } else { 
        console.error('Delete failed:', response.message);
        message.error(response.message || 'Xóa ngành thất bại.'); 
      }
    } catch (error) { 
      console.error('Delete error:', error);
      message.error('Lỗi khi xóa ngành.'); 
    } finally {
      setLoading(false);
    }
  };
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      let response;

      if (editingMajor) {
        // Không gửi universityId khi update vì BE không cho phép thay đổi trường của ngành
        const { university, ...updateData } = values;
        response = await majorAdminService.update(editingMajor.id, updateData);      } else {
        // Tạo object phù hợp với interface của create method
        const createData = {
          name: values.name,
          code: values.code,
          universityId: values.university, // universityId từ MajorFE interface
          university: values.university, // university field mong đợi bởi create method
          description: values.description,
          admissionQuota: values.admissionQuota,
          isActive: values.isActive
        };
        response = await majorAdminService.create(createData);
      }      if (response.success) {
        message.success(editingMajor ? 'Cập nhật ngành thành công!' : 'Thêm ngành thành công!');
        setIsModalVisible(false);
        // Refresh the data after successful create/update
        await fetchMajors(pagination.current, pagination.pageSize, searchText, filterUniversityId);
      } else { message.error(response.message || (editingMajor ? 'Cập nhật thất bại.' : 'Thêm mới thất bại.')); }
    } catch (info) { console.log('Validate Failed:', info); message.error('Vui lòng kiểm tra lại thông tin.'); } 
    finally { setLoading(false); }
  };
    const handleSearch = (value: string) => { 
    setSearchText(value); 
    fetchMajors(1, pagination.pageSize, value, filterUniversityId); 
  };
  
  const handleFilterUniversity = (value: string | undefined) => { 
    setFilterUniversityId(value); 
    fetchMajors(1, pagination.pageSize, searchText, value); 
  };

  const columns: TableProps<MajorFE>['columns'] = [
    {
      title: 'Ngành Học',
      key: 'major',
      render: (_: any, record: MajorFE) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar
            style={{
              backgroundColor: COLORS.primary,
              color: COLORS.white,
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
            icon={<BookOutlined />}
          />
          <div>
            <div style={{ 
              fontWeight: '600', 
              fontSize: '16px', 
              color: COLORS.text,
              marginBottom: '4px'
            }}>
              {record.name}
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: COLORS.textLight,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Tag color="blue" style={{ margin: 0, fontSize: '12px' }}>
                {record.code}
              </Tag>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Trường Đại Học',
      key: 'university',
      render: (_: any, record: MajorFE) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BankOutlined style={{ color: COLORS.accent, fontSize: '16px' }} />
          <span style={{ color: COLORS.text, fontWeight: '500' }}>
            {record.universityName || record.universityId}
          </span>
        </div>
      ),
      responsive: ['md'],
    },
    {
      title: 'Chỉ Tiêu',
      dataIndex: 'admissionQuota',
      key: 'admissionQuota',
      align: 'center',
      width: 120,
      render: (quota: number) => (
        <div style={{
          background: COLORS.blue50,
          color: COLORS.blue500,
          padding: '6px 12px',
          borderRadius: '20px',
          fontWeight: '600',
          fontSize: '14px',
          display: 'inline-block'
        }}>
          {quota || 0}
        </div>
      ),
      responsive: ['sm'],
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'isActive',
      key: 'isActive',
      align: 'center',
      width: 140,
      render: (isActive: boolean) => (
        <Tag
          color={isActive ? 'success' : 'error'}
          style={{
            borderRadius: '20px',
            padding: '4px 16px',
            fontWeight: '600',
            fontSize: '12px',
            border: 'none'
          }}
        >
          {isActive ? 'Hoạt Động' : 'Ẩn'}
        </Tag>
      ),
    },
    {
      title: 'Hành Động',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_: any, record: MajorFE) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{
                backgroundColor: COLORS.primary,
                borderColor: COLORS.primary,
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa ngành học này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                type="primary"
                shape="circle"
                danger
                icon={<DeleteOutlined />}
                style={{
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <>
      <style>{`
        .modern-major-management {
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }
        
        .modern-major-management .ant-table-thead > tr > th {
          background: linear-gradient(135deg, ${COLORS.gray50} 0%, ${COLORS.gray100} 100%) !important;
          color: ${COLORS.text} !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          border: none !important;
          padding: 20px 16px !important;
        }
        
        .modern-major-management .ant-table-tbody > tr > td {
          padding: 20px 16px !important;
          border: none !important;
          border-bottom: 1px solid ${COLORS.gray100} !important;
        }
        
        .modern-major-management .ant-table-tbody > tr:hover > td {
          background: ${COLORS.blue50} !important;
        }
        
        .modern-major-management .ant-table {
          border-radius: 16px !important;
          overflow: hidden !important;
        }
        
        .modern-major-management .ant-input,
        .modern-major-management .ant-select-selector {
          border-radius: 12px !important;
          border-color: ${COLORS.gray200} !important;
          transition: all 0.3s ease !important;
        }
        
        .modern-major-management .ant-input:focus,
        .modern-major-management .ant-select-focused .ant-select-selector {
          border-color: ${COLORS.primary} !important;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1) !important;
        }
        
        .modern-major-management .ant-btn {
          border-radius: 12px !important;
          font-weight: 500 !important;
          transition: all 0.3s ease !important;
        }
        
        .modern-major-management .ant-btn:hover {
          transform: translateY(-1px) !important;
        }
        
        .modern-major-management .ant-modal-content {
          border-radius: 16px !important;
        }
        
        .modern-major-management .ant-modal-header {
          border-bottom: 1px solid ${COLORS.gray100} !important;
        }
        
        @media (max-width: 768px) {
          .modern-major-management .mobile-stack {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>
      
      <div className="modern-major-management" style={{ 
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
                icon={<BookOutlined />} 
              />
              <div>
                <Title level={2} style={{ color: COLORS.white, margin: 0, fontSize: '32px', fontWeight: '700' }}>
                  Quản Lý Ngành Học
                </Title>
                <Paragraph style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  margin: 0, 
                  fontSize: '16px',
                  marginTop: '8px'
                }}>
                  Quản lý thông tin các ngành học và chỉ tiêu tuyển sinh
                </Paragraph>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <Row gutter={[24, 16]} style={{ marginBottom: '32px' }}>
            <Col xs={24} sm={12} md={8}>              <Input.Search
                placeholder="Tìm kiếm theo tên hoặc mã ngành..."
                onSearch={handleSearch}
                enterButton={
                  <Button 
                    type="primary" 
                    icon={<SearchOutlined />}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      color: '#ffffff'
                    }}
                  />
                }
                allowClear
                loading={loading && !!searchText}
                size="large"
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                showSearch
                placeholder="Lọc theo trường đại học"
                onChange={handleFilterUniversity}
                style={{ width: '100%' }}
                allowClear
                loading={universitiesForFilter.length === 0 && loading}
                filterOption={(input, option) => {
                  if (!option) return false;
                  const label = option.label?.toString().toLowerCase() || '';
                  const value = option.value?.toString().toLowerCase() || '';
                  return label.includes(input.toLowerCase()) || value.includes(input.toLowerCase());
                }}
                value={filterUniversityId}
                size="large"
              >
                {universitiesForFilter.map(uni => (
                  <Option key={uni.id} value={uni.id} label={`${uni.name} (${uni.code})`}>
                    {uni.name} ({uni.code})
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setSearchText('');
                    setFilterUniversityId(undefined);
                    fetchMajors(1, pagination.pageSize, '', undefined);
                  }}
                  loading={loading}
                  size="large"
                  style={{
                    borderRadius: '12px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  Tải lại
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                  size="large"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.accent} 0%, #059669 100%)`,
                    borderColor: COLORS.accent,
                    borderRadius: '12px',
                    height: '48px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  Thêm Ngành Mới
                </Button>
              </div>
            </Col>
          </Row>

          {/* Table */}
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <Table
              columns={columns}
              dataSource={majors}
              rowKey="id"
              loading={loading}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} ngành học`,
                style: { margin: '24px 0 0 0' }
              }}
              onChange={handleTableChange}
              scroll={{ x: 'max-content' }}
            />
          </div>

          {/* Modal */}
          <Modal
            title={
              <div style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: COLORS.text,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <SafetyCertificateOutlined style={{ color: COLORS.primary }} />
                {editingMajor ? "Chỉnh Sửa Ngành Học" : "Thêm Ngành Học Mới"}
              </div>
            }
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={() => setIsModalVisible(false)}
            confirmLoading={loading}
            okText={editingMajor ? "Cập Nhật" : "Thêm Mới"}
            cancelText="Hủy"
            destroyOnClose
            width={680}
            okButtonProps={{
              style: {
                background: `linear-gradient(135deg, ${COLORS.accent} 0%, #059669 100%)`,
                borderColor: COLORS.accent,
                borderRadius: '8px',
                height: '40px',
                fontWeight: '600'
              }
            }}
            cancelButtonProps={{
              style: {
                borderRadius: '8px',
                height: '40px'
              }
            }}
          >
            <Form 
              form={form} 
              layout="vertical" 
              name="majorFormAdmin"
              style={{ marginTop: '24px' }}
            >
              <Form.Item
                name="university"
                label={<span style={{ fontWeight: '600', color: COLORS.text }}>Trường Đại Học</span>}
                rules={[{ required: true, message: 'Vui lòng chọn trường đại học!' }]}
              >
                <Select
                  placeholder="Chọn trường đại học"
                  showSearch
                  filterOption={(input, option) => {
                    if (!option) return false;
                    const label = option.label?.toString().toLowerCase() || '';
                    const value = option.value?.toString().toLowerCase() || '';
                    return label.includes(input.toLowerCase()) || value.includes(input.toLowerCase());
                  }}
                  disabled={!!editingMajor}
                  size="large"
                  style={{ borderRadius: '8px' }}
                >
                  {universitiesForFilter.map(uni => (
                    <Option key={uni.id} value={uni.id} label={`${uni.name} (${uni.code})`}>
                      {uni.name} ({uni.code})
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label={<span style={{ fontWeight: '600', color: COLORS.text }}>Tên Ngành</span>}
                    rules={[{ required: true, message: 'Vui lòng nhập tên ngành!' }]}
                  >
                    <Input size="large" placeholder="Nhập tên ngành học" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="code"
                    label={<span style={{ fontWeight: '600', color: COLORS.text }}>Mã Ngành</span>}
                    rules={[{ required: true, message: 'Vui lòng nhập mã ngành!' }]}
                  >
                    <Input size="large" placeholder="Nhập mã ngành" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="admissionQuota"
                label={<span style={{ fontWeight: '600', color: COLORS.text }}>Chỉ Tiêu Tuyển Sinh</span>}
                rules={[{ type: 'number', min: 0, message: 'Chỉ tiêu phải là số không âm' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Nhập chỉ tiêu tuyển sinh"
                  size="large"
                  min={0}
                />
              </Form.Item>

              <Form.Item
                name="description"
                label={<span style={{ fontWeight: '600', color: COLORS.text }}>Mô Tả</span>}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Nhập mô tả ngành học (tùy chọn)"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="isActive"
                label={<span style={{ fontWeight: '600', color: COLORS.text }}>Trạng Thái</span>}
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Hoạt Động"
                  unCheckedChildren="Ẩn"
                  style={{
                    backgroundColor: COLORS.accent
                  }}
                />
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </div>
    </>
  );
};
export default AdminManageMajors;