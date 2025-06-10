import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Modal, Form, Input, Space, Tooltip, Popconfirm, message, Switch, Row, Col, Tag, Card, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, GlobalOutlined, EnvironmentOutlined, BookOutlined, EyeOutlined, EyeInvisibleOutlined, BankOutlined } from '@ant-design/icons';
import type { TableProps, PaginationProps } from 'antd';
import universityAdminService from '../services/universityAdminService';
import { UniversityFE } from '../../university/types';

const { Title, Paragraph, Text } = Typography;

interface UniversityFormData {
  name: string;
  code: string;
  address?: string;
  website?: string;
  logoUrl?: string;
  description?: string;
  isActive?: boolean;
}

const AdminManageUniversities: React.FC = () => {
  const [universities, setUniversities] = useState<UniversityFE[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<UniversityFE | null>(null);
  const [form] = Form.useForm<UniversityFormData>();
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 5, // Số lượng item mỗi trang
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20']
  });

  const fetchUniversities = useCallback(async (page = pagination.current, size = pagination.pageSize, search = searchText) => {
    setLoading(true);
    try {
      const response = await universityAdminService.getAll({ page, limit: size, search });
      if (response.success && response.data) {
        setUniversities(response.data);
        setPagination(prev => ({ ...prev, total: response.total || 0, current: page, pageSize: size }));
      } else {
        message.error(response.message || 'Không thể tải danh sách trường.');
      }
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu trường.');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchText]); // Thêm searchText vào dependencies

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]); // fetchUniversities đã có dependencies của nó

  const handleTableChange: TableProps<UniversityFE>['onChange'] = (newPagination) => {
    fetchUniversities(newPagination.current, newPagination.pageSize, searchText);
  };

  const handleAdd = () => {
    setEditingUniversity(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true }); // Mặc định là active khi thêm mới
    setIsModalVisible(true);
  };

  const handleEdit = (record: UniversityFE) => {
    setEditingUniversity(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await universityAdminService.delete(id);
      if (response.success) {
        message.success('Xóa trường thành công!');
        fetchUniversities(); // Tải lại danh sách
      } else {
        message.error(response.message || 'Xóa trường thất bại.');
      }
    } catch (error) {
      message.error('Lỗi khi xóa trường.');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      let response;
      if (editingUniversity) {
        response = await universityAdminService.update(editingUniversity.id, values);
      } else {
        response = await universityAdminService.create(values);
      }

      if (response.success) {
        message.success(editingUniversity ? 'Cập nhật trường thành công!' : 'Thêm trường thành công!');
        setIsModalVisible(false);
        fetchUniversities(); // Tải lại danh sách
      } else {
        message.error(response.message || (editingUniversity ? 'Cập nhật thất bại.' : 'Thêm mới thất bại.'));
      }
    } catch (info) {
      console.log('Validate Failed:', info);
      message.error('Vui lòng kiểm tra lại thông tin đã nhập.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (value: string) => {
    setSearchText(value);
    // fetchUniversities sẽ được gọi lại do searchText là dependency của fetchUniversities trong useEffect
    // hoặc gọi trực tiếp fetchUniversities(1, pagination.pageSize, value); để về trang 1
    fetchUniversities(1, pagination.pageSize, value);
  };  // Modern color palette consistent with other admin pages
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
  const columns: TableProps<UniversityFE>['columns'] = [
    {
      title: 'Thông Tin Trường',
      key: 'university_info',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar
            size={48}
            style={{
              backgroundColor: COLORS.primary,
              color: COLORS.white,
              fontSize: '16px',
              fontWeight: 'bold'
            }}
            src={record.logoUrl}
            icon={<BankOutlined />}
          >
            {!record.logoUrl && record.name.charAt(0)}
          </Avatar>
          <div>
            <div style={{ 
              fontWeight: 600, 
              fontSize: '14px', 
              color: COLORS.dark,
              marginBottom: '4px'
            }}>
              {record.name}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: COLORS.textLight,
              marginBottom: '4px'
            }}>
              Mã: <Text copyable style={{ fontSize: '11px' }}>{record.code}</Text>
            </div>
            {record.address && (
              <div style={{ 
                fontSize: '11px', 
                color: COLORS.textLight,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <EnvironmentOutlined style={{ color: COLORS.textLight }} />
                {record.address}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Website',
      key: 'website',
      width: 120,
      render: (_, record) => (
        record.website ? (
          <a 
            href={record.website} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: COLORS.primary,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none'
            }}
          >
            <GlobalOutlined />
            Website
          </a>
        ) : (
          <Text style={{ color: COLORS.textLight, fontSize: '12px' }}>-</Text>
        )
      )
    },
    { 
      title: 'Trạng Thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      width: 120,
      align: 'center',
      render: (isActive: boolean) => (
        <Tag 
          color={isActive ? 'success' : 'default'}
          style={{
            borderRadius: '20px',
            padding: '4px 12px',
            fontWeight: 500,
            fontSize: '12px'
          }}
        >
          {isActive ? 'Hoạt Động' : 'Ẩn'}
        </Tag>
      ), 
      filters: [
        {text: 'Hoạt động', value: true}, 
        {text: 'Ẩn', value: false}
      ], 
      onFilter: (value, record) => record.isActive === value
    },
    {
      title: 'Hành Động',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_: any, record: UniversityFE) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="primary" 
              shape="circle"
              icon={<EditOutlined style={{ color: '#ffffff' }} />} 
              onClick={() => handleEdit(record)}
              style={{
                backgroundColor: COLORS.primary,
                borderColor: COLORS.primary,
                boxShadow: `0 2px 4px ${COLORS.primary}30`
              }}
            />
          </Tooltip>
          <Popconfirm 
            title="Xác nhận xóa" 
            description="Bạn có chắc muốn xóa trường này?" 
            onConfirm={() => handleDelete(record.id)} 
            okText="Xóa" 
            cancelText="Hủy" 
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button 
                shape="circle" 
                icon={<DeleteOutlined style={{ color: '#ffffff' }} />}
                style={{
                  backgroundColor: COLORS.danger,
                  borderColor: COLORS.danger,
                  boxShadow: `0 2px 4px ${COLORS.danger}30`
                }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];return (
    <>
      <style>{`
        .modern-university-management {
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }
        
        .modern-university-management .ant-card {
          border-radius: 16px !important;
          border: 1px solid ${COLORS.gray200} !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
          overflow: hidden !important;
        }
        
        .modern-university-management .ant-card-head {
          background: linear-gradient(135deg, ${COLORS.gray50} 0%, ${COLORS.gray100} 100%) !important;
          border-bottom: 1px solid ${COLORS.gray100} !important;
          padding: 20px 24px !important;
        }
        
        .modern-university-management .ant-card-head-title {
          font-weight: 600 !important;
          font-size: 16px !important;
          color: ${COLORS.dark} !important;
        }
        
        .modern-university-management .ant-card-body {
          padding: 24px !important;
        }
        
        .modern-university-management .ant-table-thead > tr > th {
          background: linear-gradient(135deg, ${COLORS.gray50} 0%, ${COLORS.gray100} 100%) !important;
          color: ${COLORS.text} !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          border: none !important;
          padding: 20px 16px !important;
        }
        
        .modern-university-management .ant-table-tbody > tr > td {
          padding: 20px 16px !important;
          border: none !important;
          border-bottom: 1px solid ${COLORS.gray100} !important;
        }
        
        .modern-university-management .ant-table-tbody > tr:hover > td {
          background: ${COLORS.blue50} !important;
        }
        
        .modern-university-management .ant-table {
          border-radius: 16px !important;
          overflow: hidden !important;
        }
        
        .modern-university-management .ant-input,
        .modern-university-management .ant-select-selector {
          border-radius: 12px !important;
          border-color: ${COLORS.gray200} !important;
          transition: all 0.3s ease !important;
        }
        
        .modern-university-management .ant-input:focus,
        .modern-university-management .ant-select-focused .ant-select-selector {
          border-color: ${COLORS.primary} !important;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1) !important;
        }
        
        .modern-university-management .ant-btn {
          border-radius: 12px !important;
          font-weight: 500 !important;
          transition: all 0.3s ease !important;
        }
        
        .modern-university-management .ant-btn:hover {
          transform: translateY(-1px) !important;
        }
        
        @media (max-width: 768px) {
          .modern-university-management .mobile-stack {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>
      
      <div className="modern-university-management" style={{ 
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
                icon={<BankOutlined />} 
              />
              <div>
                <Title level={2} style={{ color: COLORS.white, margin: 0, fontSize: '32px', fontWeight: '700' }}>
                  Quản Lý Trường Đại Học
                </Title>
                <Paragraph style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  margin: 0, 
                  fontSize: '16px',
                  marginTop: '8px'
                }}>
                  Thêm mới, chỉnh sửa và quản lý thông tin các trường đại học trong hệ thống
                </Paragraph>
              </div>
            </div>
          </div>

          {/* Search and Actions */}
          <Row gutter={[16, 16]} align="middle" style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={16} md={12} lg={14}>
              <Input.Search
                placeholder="Tìm kiếm theo tên hoặc mã trường..."
                onSearch={handleSearch}
                enterButton={
                  <Button 
                    type="primary"
                    icon={<SearchOutlined />}
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.accent} 0%, #059669 100%)`,
                      border: 'none',
                      height: '40px',
                      fontWeight: 600
                    }}
                  >
                    Tìm kiếm
                  </Button>
                }
                allowClear
                loading={loading && !!searchText}
                size="large"
                style={{ borderRadius: '12px' }}
              />
            </Col>
            <Col xs={24} sm={8} md={12} lg={10}>
              <div className="mobile-stack" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={() => fetchUniversities(1, pagination.pageSize, '')} 
                  loading={loading}
                  style={{
                    height: '40px',
                    borderRadius: '12px',
                    border: `2px solid ${COLORS.gray200}`,
                    color: COLORS.text,
                    fontWeight: 500
                  }}
                >
                  Tải lại
                </Button>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={handleAdd}
                  style={{
                    height: '40px',
                    background: `linear-gradient(135deg, ${COLORS.accent} 0%, #059669 100%)`,
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 600,
                    boxShadow: `0 4px 12px ${COLORS.accent}30`
                  }}
                >
                  Thêm Trường Mới
                </Button>
              </div>
            </Col>
          </Row>

          {/* Table Section */}
          <Table 
            columns={columns} 
            dataSource={universities} 
            rowKey="id" 
            loading={loading}
            pagination={{
              ...pagination,
              style: { marginTop: '32px' },
              showTotal: (total, range) => 
                `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} trường`,
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
          />
        </Card>

        {/* Modal */}
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
                icon={<BankOutlined />}
              />
              {editingUniversity ? "Chỉnh Sửa Thông Tin Trường" : "Thêm Trường Đại Học Mới"}
            </div>
          }
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          confirmLoading={loading}
          okText={editingUniversity ? "Cập Nhật" : "Thêm Mới"}
          cancelText="Hủy"
          destroyOnClose
          width={720}
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
            <Form form={form} layout="vertical" name="universityFormAdmin">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item 
                    name="name" 
                    label={<span style={{ fontWeight: '600', color: COLORS.dark, fontSize: '15px' }}>Tên Trường</span>} 
                    rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}
                  >
                    <Input 
                      size="large" 
                      style={{ 
                        borderRadius: '12px',
                        border: `2px solid ${COLORS.gray200}`
                      }} 
                      placeholder="Nhập tên trường đại học..."
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item 
                    name="code" 
                    label={<span style={{ fontWeight: '600', color: COLORS.dark, fontSize: '15px' }}>Mã Trường</span>} 
                    rules={[{ required: true, message: 'Vui lòng nhập mã trường!' }]}
                  >
                    <Input 
                      size="large" 
                      style={{ 
                        borderRadius: '12px',
                        border: `2px solid ${COLORS.gray200}`
                      }} 
                      placeholder="Nhập mã trường (vd: UIT, HCMUT)..."
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item 
                name="address" 
                label={<span style={{ fontWeight: '600', color: COLORS.dark, fontSize: '15px' }}>Địa Chỉ</span>}
              >
                <Input.TextArea 
                  rows={2} 
                  style={{ 
                    borderRadius: '12px',
                    border: `2px solid ${COLORS.gray200}`
                  }}
                  placeholder="Nhập địa chỉ trường đại học..."
                />
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item 
                    name="website" 
                    label={<span style={{ fontWeight: '600', color: COLORS.dark, fontSize: '15px' }}>Website</span>} 
                    rules={[{ type: 'url', message: 'Địa chỉ website không hợp lệ!'}]}
                  >
                    <Input 
                      size="large" 
                      style={{ 
                        borderRadius: '12px',
                        border: `2px solid ${COLORS.gray200}`
                      }}
                      placeholder="https://example.edu.vn"
                      prefix={<GlobalOutlined style={{ color: COLORS.textLight }} />}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item 
                    name="logoUrl" 
                    label={<span style={{ fontWeight: '600', color: COLORS.dark, fontSize: '15px' }}>URL Logo</span>} 
                    rules={[{ type: 'url', message: 'URL logo không hợp lệ!'}]}
                  >
                    <Input 
                      size="large" 
                      style={{ 
                        borderRadius: '12px',
                        border: `2px solid ${COLORS.gray200}`
                      }}
                      placeholder="https://example.com/logo.png"
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item 
                name="description" 
                label={<span style={{ fontWeight: '600', color: COLORS.dark, fontSize: '15px' }}>Mô tả</span>}
              >
                <Input.TextArea 
                  rows={3} 
                  style={{ 
                    borderRadius: '12px',
                    border: `2px solid ${COLORS.gray200}`
                  }}
                  placeholder="Nhập mô tả ngắn về trường đại học..."
                />
              </Form.Item>
              
              <Form.Item 
                name="isActive" 
                label={<span style={{ fontWeight: '600', color: COLORS.dark, fontSize: '15px' }}>Trạng thái hiển thị</span>} 
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={<><EyeOutlined /> Hoạt động</>} 
                  unCheckedChildren={<><EyeInvisibleOutlined /> Ẩn</>}
                  style={{
                    background: COLORS.gray200
                  }}
                />              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </>
  );
};
export default AdminManageUniversities;