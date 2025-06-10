import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Modal, Form, Input, Space, Tooltip, Popconfirm, message, Switch, InputNumber, Tag, Row, Col, Card, Avatar, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, BookOutlined, BankOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import majorAdminService from '../services/majorAdminService';
import { MajorFE } from '../../major/types';

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
  universityId: string;
  description?: string;
  admissionQuota?: number;
  isActive?: boolean;
}

const AdminManageMajors: React.FC = () => {
  const [majors, setMajors] = useState<MajorFE[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMajor, setEditingMajor] = useState<MajorFE | null>(null);
  const [form] = Form.useForm<MajorFormData>();
  const [universities, setUniversities] = useState<{ id: string; name: string; code: string }[]>([]);
  
  const [searchText, setSearchText] = useState('');
  const [universitiesLoading, setUniversitiesLoading] = useState(true);const [pagination, setPagination] = useState({
    current: 1, 
    pageSize: 5, 
    total: 0, 
    showSizeChanger: true, 
    pageSizeOptions: ['5', '10', '20']
  });  const fetchMajors = useCallback(async (page?: number, size?: number, search?: string) => {
    setLoading(true);
    try {
      const currentPage = page || pagination.current;
      const currentSize = size || pagination.pageSize;
      const currentSearch = search !== undefined ? search : searchText;
      
      console.log('Fetching majors with params:', { 
        page: currentPage, 
        limit: currentSize, 
        search: currentSearch
      });
      
      const response = await majorAdminService.getAll({ 
        page: currentPage, 
        limit: currentSize, 
        search: currentSearch
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
  }, [searchText, pagination.current, pagination.pageSize]);  useEffect(() => {
    fetchMajors(1, pagination.pageSize, '');
    loadUniversities();
  }, []);  const loadUniversities = async () => {
    try {
      setUniversitiesLoading(true);
      console.log('Loading universities...');
      const response = await majorAdminService.getUniversitiesForSelect();
      console.log('Universities response:', response);
      
      if (response.success && response.data) {
        // Filter out invalid universities and ensure unique IDs
        const validUniversities = response.data.filter(university => 
          university && university.id && university.name
        );
        console.log('Valid universities:', validUniversities);
        setUniversities(validUniversities);
      } else {
        console.error('Failed to load universities:', response.message);
        message.error(response.message || 'Lỗi khi tải danh sách trường đại học');
      }
    } catch (error) {
      console.error('Error loading universities:', error);
      message.error('Lỗi khi tải danh sách trường đại học');
    } finally {
      setUniversitiesLoading(false);
    }
  };
  const handleTableChange: TableProps<MajorFE>['onChange'] = (newPagination) => {
    fetchMajors(newPagination.current, newPagination.pageSize, searchText);
  };  const handleAdd = () => {
    console.log('Opening add modal...');
    setEditingMajor(null);
    form.resetFields();
    
    // Set default values explicitly
    const defaultValues = { 
      isActive: true, 
      admissionQuota: 0,
      universityId: undefined,
      name: '',
      code: '',
      description: ''
    };
    
    console.log('Setting default form values:', defaultValues);
    form.setFieldsValue(defaultValues);
    
    // Double check after setting
    setTimeout(() => {
      console.log('Form values after reset:', form.getFieldsValue());
    }, 100);
    
    setIsModalVisible(true);
  };
  
  const handleEdit = (record: MajorFE) => {
    setEditingMajor(record);
    form.setFieldsValue({
        name: record.name,
        code: record.code,
        universityId: record.universityId,
        description: record.description,
        admissionQuota: record.admissionQuota,
        isActive: record.isActive
    });
    setIsModalVisible(true);
  };const handleDelete = async (id: string) => {
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
        await fetchMajors(targetPage, pagination.pageSize, searchText);
      } else { 
        console.error('Delete failed:', response.message);
        message.error(response.message || 'Xóa ngành thất bại.'); 
      }
    } catch (error) { 
      console.error('Delete error:', error);
      message.error('Lỗi khi xóa ngành.'); 
    } finally {
      setLoading(false);
    }  };  const handleModalOk = async () => {
    try {
      console.log('Starting form validation...');
      console.log('Current form values before validation:', form.getFieldsValue());
      console.log('Universities available:', universities);
      
      const values = await form.validateFields();
      setLoading(true);
      
      console.log('Form validation passed! Values:', values);
      
      let response;
      if (editingMajor) {
        // Update major - exclude universityId from update data
        const { universityId, ...updateData } = values;
        console.log('Updating major with data:', updateData);
        response = await majorAdminService.update(editingMajor.id, updateData);
      } else {
        // Create new major - ensure universityId is correctly mapped
        const createData = {
          name: values.name,
          code: values.code,
          description: values.description,
          admissionQuota: values.admissionQuota || 0,
          isActive: values.isActive !== false, // Default to true if not specified
          university: values.universityId // Map universityId to university field
        };
        console.log('Creating major with data:', createData);
        response = await majorAdminService.create(createData);
      }

      if (response.success) {
        message.success(editingMajor ? 'Cập nhật ngành thành công!' : 'Thêm ngành thành công!');
        setIsModalVisible(false);
        form.resetFields();
        // Refresh the data after successful create/update
        await fetchMajors(pagination.current, pagination.pageSize, searchText);
      } else { 
        console.error('Service error:', response);
        message.error(response.message || (editingMajor ? 'Cập nhật thất bại.' : 'Thêm mới thất bại.')); 
      }
    } catch (info) { 
      console.log('Validate Failed:', info); 
      console.log('Form fields with errors:', info.errorFields);
      message.error('Vui lòng kiểm tra lại thông tin.'); 
    } 
    finally { 
      setLoading(false); 
    }
  };const handleSearch = (value: string) => { 
    setSearchText(value); 
    fetchMajors(1, pagination.pageSize, value); 
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

          {/* Filters and Actions */}          <Row gutter={[24, 16]} style={{ marginBottom: '32px' }}>
            <Col xs={24} sm={12} md={16}><Input.Search
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
              />            </Col>
            <Col xs={24} sm={24} md={8}>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setSearchText('');
                    fetchMajors(1, pagination.pageSize, '');
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
            }            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={() => {
              setIsModalVisible(false);
              form.resetFields();
              setEditingMajor(null);
            }}
            confirmLoading={loading}
            okText={editingMajor ? "Cập Nhật" : "Thêm Mới"}
            cancelText="Hủy"
            destroyOnClose={true}
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
          >            <Form 
              form={form} 
              layout="vertical" 
              name="majorFormAdmin"
              style={{ marginTop: '24px' }}            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="universityId"
                    label={<span style={{ fontWeight: '600', color: COLORS.text }}>Trường Đại Học</span>}
                    rules={[{ required: true, message: 'Vui lòng chọn trường đại học!' }]}
                  >                    <Select 
                      size="large" 
                      placeholder={universitiesLoading ? "Đang tải..." : "Chọn trường đại học"}
                      showSearch
                      allowClear
                      loading={universitiesLoading}
                      value={form.getFieldValue('universityId')}
                      onChange={(value) => {
                        console.log('University selected:', value);
                        form.setFieldsValue({ universityId: value });
                        // Trigger validation for this field
                        form.validateFields(['universityId']);
                      }}
                      filterOption={(input, option) =>
                        (option?.children?.toString().toLowerCase() ?? '').includes(input.toLowerCase())
                      }
                      disabled={!!editingMajor || universitiesLoading} // Disable khi edit hoặc đang load
                    >
                      {universities.map(university => (
                        <Option key={university.id} value={university.id}>
                          {university.name} ({university.code})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>                <Col span={12}>
                  <Form.Item
                    name="name"
                    label={<span style={{ fontWeight: '600', color: COLORS.text }}>Tên Ngành</span>}
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên ngành!' },
                      { min: 2, message: 'Tên ngành phải có ít nhất 2 ký tự!' }
                    ]}
                  >
                    <Input size="large" placeholder="Nhập tên ngành học" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="code"
                    label={<span style={{ fontWeight: '600', color: COLORS.text }}>Mã Ngành</span>}
                    rules={[
                      { required: true, message: 'Vui lòng nhập mã ngành!' },
                      { min: 2, message: 'Mã ngành phải có ít nhất 2 ký tự!' },
                      { max: 10, message: 'Mã ngành không được quá 10 ký tự!' }
                    ]}
                  >
                    <Input 
                      size="large" 
                      placeholder="Nhập mã ngành" 
                      style={{ textTransform: 'uppercase' }}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        form.setFieldsValue({ code: value });
                      }}
                    />
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