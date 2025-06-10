import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Modal, Form, Input, Space, Tooltip, Popconfirm, message, Switch, Row, Col, Tag, Card, Badge } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, GlobalOutlined, EnvironmentOutlined, BookOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import type { TableProps, PaginationProps } from 'antd';
import universityAdminService from '../services/universityAdminService';
import { UniversityFE } from '../../university/types'; // Sử dụng lại type

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
  };
  // Modern color palette and styling constants
  const COLORS = {
    primary: '#2563eb',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    background: '#f8fafc',
    surface: '#ffffff',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      muted: '#94a3b8'
    },
    border: '#e2e8f0',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };

  const cardStyle: React.CSSProperties = {
    background: COLORS.surface,
    borderRadius: '16px',
    border: `1px solid ${COLORS.border}`,
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    overflow: 'hidden'
  };

  const headerStyle: React.CSSProperties = {
    background: COLORS.gradient,
    color: 'white',
    padding: '24px',
    margin: '-1px -1px 0 -1px',
    borderRadius: '16px 16px 0 0'
  };

  const columns: TableProps<UniversityFE>['columns'] = [
    {
      title: 'Logo',
      dataIndex: 'logoUrl',
      key: 'logo',
      width: 80,
      render: (logoUrl: string, record: UniversityFE) => (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: logoUrl ? 'transparent' : COLORS.gradient,
          overflow: 'hidden'
        }}>
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={record.name}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                borderRadius: '12px'
              }}              onError={(e) => {
                const imgElement = e.target as HTMLImageElement;
                const nextElement = imgElement.nextElementSibling as HTMLElement;
                imgElement.style.display = 'none';
                if (nextElement) {
                  nextElement.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <div style={{ 
            display: logoUrl ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            {record.name.charAt(0).toUpperCase()}
          </div>
        </div>
      )
    },
    { 
      title: 'Mã Trường', 
      dataIndex: 'code', 
      key: 'code', 
      width: 120,
      sorter: (a,b) => a.code.localeCompare(b.code),
      render: (code: string) => (
        <Tag color="blue" style={{ 
          fontWeight: '500',
          fontSize: '12px',
          padding: '4px 8px',
          borderRadius: '6px'
        }}>
          {code}
        </Tag>
      )
    },
    { 
      title: 'Thông Tin Trường', 
      dataIndex: 'name', 
      key: 'name', 
      sorter: (a,b) => a.name.localeCompare(b.name),
      render: (name: string, record: UniversityFE) => (
        <div>
          <div style={{ 
            fontWeight: '600', 
            color: COLORS.text.primary,
            marginBottom: '4px',
            fontSize: '14px'
          }}>
            {name}
          </div>
          {record.address && (
            <div style={{ 
              color: COLORS.text.secondary, 
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <EnvironmentOutlined />
              {record.address}
            </div>
          )}
          {record.website && (
            <div style={{ marginTop: '4px' }}>
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
            </div>
          )}
        </div>
      )
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      width: 120,
      render: (isActive: boolean) => (
        <Badge 
          status={isActive ? "success" : "default"} 
          text={
            <span style={{ 
              color: isActive ? COLORS.success : COLORS.text.muted,
              fontWeight: '500',
              fontSize: '12px'
            }}>
              {isActive ? 'Hoạt động' : 'Ẩn'}
            </span>
          }
        />
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
      render: (_: any, record: UniversityFE) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="primary" 
              size="small"
              shape="circle" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
              style={{
                background: COLORS.primary,
                border: 'none',
                boxShadow: '0 2px 4px rgb(37 99 235 / 0.2)'
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
                danger 
                size="small"
                shape="circle" 
                icon={<DeleteOutlined />}
                style={{
                  boxShadow: '0 2px 4px rgb(239 68 68 / 0.2)'
                }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div style={{ 
      padding: '24px',
      background: COLORS.background,
      minHeight: '100vh'
    }}>
      <Card style={cardStyle}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookOutlined style={{ fontSize: '20px' }} />
            </div>
            <Title level={2} style={{ 
              color: 'white', 
              margin: 0,
              fontSize: '24px',
              fontWeight: '700'
            }}>
              Quản Lý Trường Đại Học
            </Title>
          </div>
          <Paragraph style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            margin: 0,
            fontSize: '14px'
          }}>
            Thêm mới, chỉnh sửa hoặc xóa thông tin các trường đại học trong hệ thống
          </Paragraph>
        </div>
        
        <div style={{ padding: '24px' }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={14} md={12} lg={10}>
              <Input.Search
                placeholder="Tìm kiếm theo tên hoặc mã trường..."
                onSearch={handleSearch}
                enterButton={
                  <Button 
                    type="primary" 
                    icon={<SearchOutlined />}
                    style={{
                      background: COLORS.primary,
                      border: 'none',
                      borderRadius: '0 8px 8px 0'
                    }}
                  />
                }
                allowClear
                loading={loading && !!searchText}
                size="large"
                style={{
                  borderRadius: '8px'
                }}
              />
            </Col>
            <Col>
              <Space size="middle">
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={() => fetchUniversities(1, pagination.pageSize, '')} 
                  loading={loading}
                  size="large"
                  style={{
                    borderRadius: '8px',
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.text.secondary
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
                    background: COLORS.success,
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(16 185 129 / 0.25)',
                    fontWeight: '600'
                  }}
                >
                  Thêm Trường Mới
                </Button>
              </Space>
            </Col>
          </Row>

          <div style={{
            background: COLORS.surface,
            borderRadius: '12px',
            border: `1px solid ${COLORS.border}`,
            overflow: 'hidden',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
          }}>
            <Table 
              columns={columns} 
              dataSource={universities} 
              rowKey="id" 
              loading={loading}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => (
                  <Text style={{ color: COLORS.text.secondary, fontSize: '14px' }}>
                    Hiển thị {range[0]}-{range[1]} của {total} trường
                  </Text>
                ),
                style: { 
                  padding: '16px 24px',
                  background: COLORS.background
                }
              }}
              onChange={handleTableChange}
              scroll={{ x: 'max-content' }}
              showHeader={true}
              size="middle"
              style={{
                background: 'transparent'
              }}              rowClassName={(_record, index) => 
                index % 2 === 0 ? '' : 'ant-table-row-alternate'
              }
            />
          </div>
        </div>
      </Card>

      <Modal
        title={
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            padding: '8px 0'
          }}>
            <div style={{
              background: COLORS.gradient,
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookOutlined style={{ color: 'white', fontSize: '16px' }} />
            </div>
            <span style={{ 
              fontSize: '18px', 
              fontWeight: '600',
              color: COLORS.text.primary
            }}>
              {editingUniversity ? "Chỉnh Sửa Thông Tin Trường" : "Thêm Trường Đại Học Mới"}
            </span>
          </div>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        okText={editingUniversity ? "Lưu thay đổi" : "Thêm mới"}
        cancelText="Hủy"
        destroyOnClose
        width={700}
        style={{
          borderRadius: '16px'
        }}
        styles={{
          header: {
            background: COLORS.background,
            borderBottom: `1px solid ${COLORS.border}`,
            borderRadius: '16px 16px 0 0'
          },
          body: {
            padding: '24px'
          }
        }}
        okButtonProps={{
          style: {
            background: editingUniversity ? COLORS.primary : COLORS.success,
            border: 'none',
            borderRadius: '8px',
            height: '40px',
            fontWeight: '600',
            boxShadow: editingUniversity 
              ? '0 4px 6px -1px rgb(37 99 235 / 0.25)'
              : '0 4px 6px -1px rgb(16 185 129 / 0.25)'
          }
        }}
        cancelButtonProps={{
          style: {
            borderRadius: '8px',
            height: '40px',
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary
          }
        }}
      >
        <Form form={form} layout="vertical" name="universityFormAdmin">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="name" 
                label={<span style={{ fontWeight: '600', color: COLORS.text.primary }}>Tên Trường</span>} 
                rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}
              >
                <Input size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="code" 
                label={<span style={{ fontWeight: '600', color: COLORS.text.primary }}>Mã Trường</span>} 
                rules={[{ required: true, message: 'Vui lòng nhập mã trường!' }]}
              >
                <Input size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item 
            name="address" 
            label={<span style={{ fontWeight: '600', color: COLORS.text.primary }}>Địa Chỉ</span>}
          >
            <Input.TextArea 
              rows={2} 
              style={{ borderRadius: '8px' }}
              placeholder="Nhập địa chỉ trường đại học..."
            />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="website" 
                label={<span style={{ fontWeight: '600', color: COLORS.text.primary }}>Website</span>} 
                rules={[{ type: 'url', message: 'Địa chỉ website không hợp lệ!'}]}
              >
                <Input 
                  size="large" 
                  style={{ borderRadius: '8px' }}
                  placeholder="https://example.edu.vn"
                  prefix={<GlobalOutlined style={{ color: COLORS.text.muted }} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="logoUrl" 
                label={<span style={{ fontWeight: '600', color: COLORS.text.primary }}>URL Logo</span>} 
                rules={[{ type: 'url', message: 'URL logo không hợp lệ!'}]}
              >
                <Input 
                  size="large" 
                  style={{ borderRadius: '8px' }}
                  placeholder="https://example.com/logo.png"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item 
            name="description" 
            label={<span style={{ fontWeight: '600', color: COLORS.text.primary }}>Mô tả</span>}
          >
            <Input.TextArea 
              rows={3} 
              style={{ borderRadius: '8px' }}
              placeholder="Nhập mô tả ngắn về trường đại học..."
            />
          </Form.Item>
          
          <Form.Item 
            name="isActive" 
            label={<span style={{ fontWeight: '600', color: COLORS.text.primary }}>Trạng thái hiển thị</span>} 
            valuePropName="checked"
          >
            <Switch 
              checkedChildren={<><EyeOutlined /> Hoạt động</>} 
              unCheckedChildren={<><EyeInvisibleOutlined /> Ẩn</>}
              style={{
                background: '#d1d5db'
              }}
            />
          </Form.Item>
        </Form>
      </Modal>      <style>
        {`
        .ant-table-row-alternate {
          background-color: ${COLORS.background} !important;
        }
        .ant-table-row:hover > td {
          background-color: ${COLORS.background} !important;
        }
        .ant-table-thead > tr > th {
          background-color: ${COLORS.background} !important;
          border-bottom: 2px solid ${COLORS.border} !important;
          font-weight: 600 !important;
          color: ${COLORS.text.primary} !important;
          padding: 16px !important;
        }
        .ant-table-tbody > tr > td {
          padding: 16px !important;
          border-bottom: 1px solid ${COLORS.border} !important;
        }
        `}
      </style>
    </div>
  );
};
export default AdminManageUniversities;