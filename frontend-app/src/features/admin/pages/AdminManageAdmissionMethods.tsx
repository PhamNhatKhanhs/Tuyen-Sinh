import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Modal, Form, Input, Space, Tooltip, Popconfirm, message, Switch, Tag, Row, Col, Card, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, SettingOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import admissionMethodAdminService from '../services/admissionMethodAdminService';
import { AdmissionMethodFE } from '../../admissionMethod/types';

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
};

interface AdmissionMethodFormData {
  name: string;
  code?: string;
  description?: string;
  isActive?: boolean;
}

const AdminManageAdmissionMethods: React.FC = () => {
  const [methods, setMethods] = useState<AdmissionMethodFE[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMethod, setEditingMethod] = useState<AdmissionMethodFE | null>(null);
  const [form] = Form.useForm<AdmissionMethodFormData>();
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20']
  });

  const fetchMethods = useCallback(async (page?: number, size?: number, search?: string) => {
    setLoading(true);
    try {
      const currentPage = page || pagination.current;
      const currentSize = size || pagination.pageSize;
      const currentSearch = search !== undefined ? search : searchText;
      
      const response = await admissionMethodAdminService.getAll({ 
        page: currentPage, 
        limit: currentSize, 
        search: currentSearch 
      });
      
      if (response.success && response.data && Array.isArray(response.data)) {
        const validData = response.data.filter(method => method && method.id);
        setMethods(validData);
        setPagination(prev => ({ 
          ...prev, 
          total: response.total || 0, 
          current: currentPage, 
          pageSize: currentSize 
        }));
      } else {
        setMethods([]);
        message.error(response.message || 'Không thể tải danh sách phương thức xét tuyển.');
      }
    } catch (error) {
      console.error('Error fetching methods:', error);
      setMethods([]);
      message.error('Lỗi khi tải dữ liệu phương thức xét tuyển.');
    } finally {
      setLoading(false);
    }
  }, [searchText, pagination.current, pagination.pageSize]);

  useEffect(() => {
    fetchMethods(1, pagination.pageSize, '');
  }, []);

  const handleTableChange: TableProps<AdmissionMethodFE>['onChange'] = (newPagination) => {
    fetchMethods(newPagination.current, newPagination.pageSize, searchText);
  };

  const handleAdd = () => {
    setEditingMethod(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
    setIsModalVisible(true);
  };

  const handleEdit = (record: AdmissionMethodFE) => {
    setEditingMethod(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await admissionMethodAdminService.delete(id);
      if (response.success) {
        message.success('Xóa phương thức thành công!');
        // Check if current page becomes empty after deletion
        const newTotal = Math.max(0, (pagination.total || 0) - 1);
        const maxPage = Math.ceil(newTotal / pagination.pageSize) || 1;
        const targetPage = pagination.current > maxPage ? maxPage : pagination.current;
        
        await fetchMethods(targetPage, pagination.pageSize, searchText);
      } else {
        message.error(response.message || 'Xóa phương thức thất bại.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Lỗi khi xóa phương thức.');
    } finally {
      setLoading(false);
    }
  };  const handleModalOk = async () => {
    try {
      console.log('🔍 [AdmissionMethod Form] Starting form validation...');
      const values = await form.validateFields();
      console.log('✅ [AdmissionMethod Form] Form validated successfully:', values);
      
      // Clean and validate the data
      const cleanedData = {
        name: values.name?.trim(),
        code: values.code?.trim() || undefined,
        description: values.description?.trim() || undefined,
        isActive: values.isActive !== undefined ? values.isActive : true
      };
      
      // Remove empty strings and undefined values
      Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key] === '' || cleanedData[key] === undefined) {
          delete cleanedData[key];
        }
      });
      
      console.log('🧹 [AdmissionMethod Form] Cleaned form data:', cleanedData);
      
      if (!cleanedData.name) {
        message.error('Tên phương thức xét tuyển là bắt buộc!');
        return;
      }
      
      setLoading(true);
      let response;
      
      if (editingMethod) {
        console.log('📝 [AdmissionMethod Form] Updating method:', editingMethod.id);
        response = await admissionMethodAdminService.update(editingMethod.id, cleanedData);
      } else {
        console.log('➕ [AdmissionMethod Form] Creating new method');
        response = await admissionMethodAdminService.create(cleanedData);
      }

      console.log('📋 [AdmissionMethod Form] Service response:', response);

      if (response.success) {
        message.success(editingMethod ? 'Cập nhật phương thức thành công!' : 'Thêm phương thức thành công!');
        setIsModalVisible(false);
        await fetchMethods(pagination.current, pagination.pageSize, searchText);
      } else {
        console.error('❌ [AdmissionMethod Form] Service error:', response.message);
        message.error(response.message || (editingMethod ? 'Cập nhật thất bại.' : 'Thêm mới thất bại.'));
      }
    } catch (info) {
      console.error('❌ [AdmissionMethod Form] Validation failed:', info);
      message.error('Vui lòng kiểm tra lại thông tin đã nhập.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchMethods(1, pagination.pageSize, value);
  };
  const columns: TableProps<AdmissionMethodFE>['columns'] = [
    {
      title: 'Phương Thức Xét Tuyển',
      key: 'method',
      render: (_: any, record: AdmissionMethodFE) => (
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
            icon={<SettingOutlined />}
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
            {record.code && (
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
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Mô Tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      responsive: ['md'],
      render: (description: string) => (
        <div style={{ 
          color: COLORS.textLight,
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          {description || 'Chưa có mô tả'}
        </div>
      ),
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
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            justifyContent: 'center'
          }}
          icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        >
          {isActive ? 'Hoạt Động' : 'Ẩn'}
        </Tag>
      ),
      filters: [
        { text: 'Hoạt động', value: true },
        { text: 'Ẩn', value: false }
      ],
      onFilter: (value, record) => record.isActive === value,
    },
    {
      title: 'Hành Động',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_: any, record: AdmissionMethodFE) => (
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
            description="Bạn có chắc chắn muốn xóa phương thức xét tuyển này?"
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
        .modern-method-management {
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }
        
        .modern-method-management .ant-table-thead > tr > th {
          background: linear-gradient(135deg, ${COLORS.gray50} 0%, ${COLORS.gray100} 100%) !important;
          color: ${COLORS.text} !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          border: none !important;
          padding: 20px 16px !important;
        }
        
        .modern-method-management .ant-table-tbody > tr > td {
          padding: 20px 16px !important;
          border: none !important;
          border-bottom: 1px solid ${COLORS.gray100} !important;
        }
        
        .modern-method-management .ant-table-tbody > tr:hover > td {
          background: ${COLORS.blue50} !important;
        }
        
        .modern-method-management .ant-table {
          border-radius: 16px !important;
          overflow: hidden !important;
        }
        
        .modern-method-management .ant-input,
        .modern-method-management .ant-select-selector {
          border-radius: 12px !important;
          border-color: ${COLORS.gray200} !important;
          transition: all 0.3s ease !important;
        }
        
        .modern-method-management .ant-input:focus,
        .modern-method-management .ant-select-focused .ant-select-selector {
          border-color: ${COLORS.primary} !important;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1) !important;
        }
        
        .modern-method-management .ant-btn {
          border-radius: 12px !important;
          font-weight: 500 !important;
          transition: all 0.3s ease !important;
        }
        
        .modern-method-management .ant-btn:hover {
          transform: translateY(-1px) !important;
        }
        
        .modern-method-management .ant-modal-content {
          border-radius: 16px !important;
        }
        
        .modern-method-management .ant-modal-header {
          border-bottom: 1px solid ${COLORS.gray100} !important;
        }
        
        @media (max-width: 768px) {
          .modern-method-management .mobile-stack {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>
      
      <div className="modern-method-management" style={{ 
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
                icon={<SettingOutlined />} 
              />
              <div>
                <Title level={2} style={{ color: COLORS.white, margin: 0, fontSize: '32px', fontWeight: '700' }}>
                  Quản Lý Phương Thức Xét Tuyển
                </Title>
                <Paragraph style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  margin: 0, 
                  fontSize: '16px',
                  marginTop: '8px'
                }}>
                  Quản lý các phương thức xét tuyển và quy trình tuyển sinh
                </Paragraph>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <Row gutter={[24, 16]} style={{ marginBottom: '32px' }}>
            <Col xs={24} sm={12} md={8}>              <Input.Search
                placeholder="Tìm kiếm theo tên hoặc mã phương thức..."
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
            <Col xs={24} sm={24} md={16}>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => fetchMethods(1, pagination.pageSize, '')}
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
                  Thêm Phương Thức Mới
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
              dataSource={methods}
              rowKey="id"
              loading={loading}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} phương thức`,
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
                <SettingOutlined style={{ color: COLORS.primary }} />
                {editingMethod ? "Chỉnh Sửa Phương Thức Xét Tuyển" : "Thêm Phương Thức Xét Tuyển Mới"}
              </div>
            }
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={() => setIsModalVisible(false)}
            confirmLoading={loading}
            okText={editingMethod ? "Cập Nhật" : "Thêm Mới"}
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
              name="admissionMethodFormAdmin"
              style={{ marginTop: '24px' }}
            >
              <Form.Item
                name="name"
                label={<span style={{ fontWeight: '600', color: COLORS.text }}>Tên Phương Thức</span>}
                rules={[{ required: true, message: 'Vui lòng nhập tên phương thức!' }]}
              >
                <Input size="large" placeholder="Nhập tên phương thức xét tuyển" />
              </Form.Item>

              <Form.Item
                name="code"
                label={<span style={{ fontWeight: '600', color: COLORS.text }}>Mã Phương Thức (Tùy chọn)</span>}
              >
                <Input size="large" placeholder="Ví dụ: PTXT01, DGNL, HOCBA..." />
              </Form.Item>

              <Form.Item
                name="description"
                label={<span style={{ fontWeight: '600', color: COLORS.text }}>Mô Tả</span>}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Nhập mô tả chi tiết về phương thức xét tuyển"
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
export default AdminManageAdmissionMethods;