import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Space, Tooltip, Popconfirm, message, Switch, Select, Input, Row, Col, Card, Tag, Form, Empty, Alert, Avatar, Modal } from 'antd';
import { EditOutlined, ReloadOutlined, SearchOutlined, UserSwitchOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined, TeamOutlined, DeleteOutlined, SwapOutlined } from '@ant-design/icons';
import type { TableProps, PaginationProps } from 'antd';
import userAdminService from '../services/userAdminService';
import type { User } from '../../auth/types';

const { Title, Paragraph, Text } = Typography;
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
  red50: '#fef2f2',
  red500: '#ef4444',
  purple50: '#faf5ff',
  purple500: '#a855f7',
  orange50: '#fff7ed',
  orange500: '#f97316',
};

const USER_ROLES = [
    { value: 'candidate', label: 'Thí sinh', color: 'geekblue', icon: <UserOutlined /> },
    { value: 'admin', label: 'Quản trị viên', color: 'volcano', icon: <TeamOutlined /> },
];

const AdminManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Modal states
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleForm] = Form.useForm();
  const [roleModalLoading, setRoleModalLoading] = useState(false); // Loading riêng cho modal
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null); // Loading cho delete với userId
  const [statusLoading, setStatusLoading] = useState<string | null>(null); // Loading cho toggle status
    const [filters, setFilters] = useState<{
    search: string;
  }>({
    search: '',
  });

  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1, pageSize: 10, total: 0, showSizeChanger: true, pageSizeOptions: ['10', '20', '50']
  });
  const fetchUsers = useCallback(async (
    page = pagination.current,
    size = pagination.pageSize,
    sorter?: { field?: string; order?: 'ascend' | 'descend' | undefined }
  ) => {
    setLoading(true); setError(null);
    try {
      const params: any = {
        search: filters.search,
        page,
        limit: size,
      };
      if (sorter && sorter.field && sorter.order) {
        params.sortBy = sorter.field;
        params.sortOrder = sorter.order === 'ascend' ? 'asc' as const : sorter.order === 'descend' ? 'desc' as const : undefined;
      }
      const response = await userAdminService.getAllUsers(params);
      if (response.success && response.data) {
        setUsers(response.data);
        setPagination(prev => ({ ...prev, total: response.total || 0, current: page, pageSize: size }));
      } else { 
        message.error(response.message || 'Không thể tải danh sách người dùng.');
        setError(response.message || 'Không thể tải danh sách người dùng.');
      }
    } catch (err: any) { 
        message.error(err.message || 'Lỗi khi tải dữ liệu người dùng.');
        setError(err.message || 'Lỗi khi tải dữ liệu người dùng.');
    } 
    finally { setLoading(false); }
  }, [pagination.current, pagination.pageSize, filters.search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleTableChange: TableProps<User>['onChange'] = (newPagination, _filters, sorter) => {
    fetchUsers(newPagination.current, newPagination.pageSize, sorter as any);
  };  const handleFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };const handleToggleUserStatus = async (userId: string, currentIsActive?: boolean) => {
    if (typeof currentIsActive === 'undefined') return;
    const newIsActive = !currentIsActive;
    try {
        setStatusLoading(userId); // Set loading cho user cụ thể
        const response = await userAdminService.updateUserStatus(userId, newIsActive);
        if (response.success) {
            message.success(`Đã ${newIsActive ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản.`);
            // Cập nhật lại user trong danh sách hiện tại hoặc fetch lại toàn bộ
            setUsers(prevUsers => prevUsers.map(u => u.id === userId ? {...u, isActive: newIsActive} : u));
        } else {
            message.error(response.message || 'Cập nhật trạng thái thất bại.');
        }
    } catch (error) {
        message.error('Lỗi khi cập nhật trạng thái người dùng.');
    } finally {
        setStatusLoading(null); // Tắt loading
    }
  };

  const handleOpenRoleModal = (user: User) => {
    setSelectedUser(user);
    roleForm.setFieldsValue({ role: user.role });
    setIsRoleModalVisible(true);
  };  const handleUpdateRole = async () => {
    if (!selectedUser) {
      console.log('No selected user');
      return;
    }
    
    console.log('Starting role update for user:', selectedUser.id);
    
    try {
      const values = await roleForm.validateFields();
      console.log('Form values:', values);
      
      setRoleModalLoading(true); // Sử dụng loading riêng cho modal
      console.log('Modal loading set to true');
      
      const response = await userAdminService.updateUserRole(selectedUser.id, values.role);
      console.log('API response:', response);
      
      if (response.success) {
        message.success('Cập nhật quyền người dùng thành công!');
        setIsRoleModalVisible(false);
        setSelectedUser(null);
        roleForm.resetFields();
        // Cập nhật user trong danh sách
        setUsers(prevUsers => prevUsers.map(u => u.id === selectedUser.id ? {...u, role: values.role} : u));
        console.log('Role updated successfully');
      } else {
        message.error(response.message || 'Cập nhật quyền thất bại.');
        console.error('API error:', response.message);
      }
    } catch (error) {
      console.error('Error updating role:', error);
      message.error('Lỗi khi cập nhật quyền người dùng.');
    } finally {
      console.log('Setting modal loading to false');
      setRoleModalLoading(false); // Tắt loading riêng cho modal
    }
  };const handleDeleteUser = async (userId: string) => {
    try {
      setDeleteLoading(userId); // Set loading cho user cụ thể
      const response = await userAdminService.deleteUser(userId);
      if (response.success) {
        message.success('Xóa người dùng thành công!');
        // Xóa user khỏi danh sách hiện tại
        setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      } else {
        message.error(response.message || 'Xóa người dùng thất bại.');
      }
    } catch (error) {
      message.error('Lỗi khi xóa người dùng.');
    } finally {
      setDeleteLoading(null); // Tắt loading
    }
  };

  const columns: TableProps<User>['columns'] = [
    {
      title: 'Thông Tin Người Dùng',
      key: 'user_info',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar
            size={48}
            style={{
              backgroundColor: record.role === 'admin' ? COLORS.orange500 : COLORS.primary,
              fontSize: '16px',
              fontWeight: 'bold'
            }}
            icon={record.role === 'admin' ? <TeamOutlined /> : <UserOutlined />}
          >
            {record.fullName ? record.fullName.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <div>
            <div style={{ 
              fontWeight: 600, 
              fontSize: '14px', 
              color: COLORS.dark,
              marginBottom: '4px'
            }}>
              {record.fullName || 'Chưa cập nhật'}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: COLORS.textLight,
              marginBottom: '4px'
            }}>
              {record.email}
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: COLORS.textLight
            }}>
              ID: <Text copyable style={{ fontSize: '10px' }}>{record.id}</Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Vai Trò', 
      dataIndex: 'role', 
      key: 'role', 
      width: 150, 
      align: 'center',
      render: (role: string) => {
        const roleConfig = USER_ROLES.find(r => r.value === role);
        return (
          <Tag 
            color={roleConfig?.color || 'default'} 
            icon={roleConfig?.icon}
            style={{
              borderRadius: '20px',
              padding: '4px 12px',
              fontWeight: 500,
              fontSize: '12px'
            }}
          >
            {roleConfig?.label.toUpperCase() || role.toUpperCase()}
          </Tag>
        );
      },
      filters: USER_ROLES.map(r => ({text: r.label, value: r.value})),
    },    {
      title: 'Trạng Thái', 
      dataIndex: 'isActive', 
      key: 'isActive', 
      width: 150, 
      align: 'center',      render: (isActive: boolean, record: User) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Switch 
            checkedChildren={<CheckCircleOutlined />} 
            unCheckedChildren={<CloseCircleOutlined />} 
            checked={isActive} 
            onChange={() => handleToggleUserStatus(record.id, record.isActive)}
            loading={statusLoading === record.id} // Loading riêng cho từng user
            style={{
              backgroundColor: isActive ? COLORS.green500 : COLORS.red500
            }}
          />
          <Text 
            style={{ 
              fontSize: '11px', 
              color: isActive ? COLORS.green500 : COLORS.red500,
              fontWeight: 500
            }}
          >
            {isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
          </Text>
        </div>
      ),
      filters: [{text: 'Hoạt động', value: true}, {text: 'Vô hiệu hóa', value: false}],
    },
    {
      title: 'Thao Tác',
      key: 'action',
      width: 160,
      align: 'center',
      render: (_, record: User) => (
        <Space size="small">
          <Tooltip title="Thay đổi quyền">
            <Button
              shape="circle"
              icon={<SwapOutlined style={{ color: '#ffffff' }} />}
              onClick={() => handleOpenRoleModal(record)}
              style={{
                backgroundColor: COLORS.warning,
                borderColor: COLORS.warning,
                boxShadow: `0 2px 4px ${COLORS.warning}30`
              }}
            />
          </Tooltip>          <Popconfirm
            title="Xóa người dùng"
            description={`Bạn có chắc chắn muốn xóa người dùng "${record.fullName || record.email}"?`}
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{
              style: {
                backgroundColor: COLORS.danger,
                borderColor: COLORS.danger
              }
            }}
          >
            <Tooltip title="Xóa người dùng">
              <Button
                shape="circle"
                icon={<DeleteOutlined style={{ color: '#ffffff' }} />}
                loading={deleteLoading === record.id}
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
  ];
  return (
    <>
      <style>{`
        .modern-users-management {
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }
        
        .modern-users-management .ant-table-thead > tr > th {
          background: linear-gradient(135deg, ${COLORS.gray50} 0%, ${COLORS.gray100} 100%) !important;
          color: ${COLORS.text} !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          border: none !important;
          padding: 20px 16px !important;
        }
        
        .modern-users-management .ant-table-tbody > tr > td {
          padding: 20px 16px !important;
          border: none !important;
          border-bottom: 1px solid ${COLORS.gray100} !important;
        }
        
        .modern-users-management .ant-table-tbody > tr:hover > td {
          background: ${COLORS.blue50} !important;
        }
        
        .modern-users-management .ant-table {
          border-radius: 16px !important;
          overflow: hidden !important;
        }
        
        .modern-users-management .ant-input,
        .modern-users-management .ant-select-selector {
          border-radius: 12px !important;
          border-color: ${COLORS.gray200} !important;
          transition: all 0.3s ease !important;
        }
        
        .modern-users-management .ant-input:focus,
        .modern-users-management .ant-select-focused .ant-select-selector {
          border-color: ${COLORS.primary} !important;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1) !important;
        }
        
        .modern-users-management .ant-btn {
          border-radius: 12px !important;
          font-weight: 500 !important;
          transition: all 0.3s ease !important;
        }
        
        .modern-users-management .ant-btn:hover {
          transform: translateY(-1px) !important;
        }
        
        .modern-users-management .ant-switch-checked {
          background-color: ${COLORS.green500} !important;
        }
        
        .modern-users-management .ant-switch:not(.ant-switch-checked) {
          background-color: ${COLORS.red500} !important;
        }
        
        @media (max-width: 768px) {
          .modern-users-management .mobile-stack {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>
      
      <div className="modern-users-management" style={{ 
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
                icon={<TeamOutlined />} 
              />
              <div>
                <Title level={2} style={{ color: COLORS.white, margin: 0, fontSize: '32px', fontWeight: '700' }}>
                  Quản Lý Người Dùng
                </Title>
                <Paragraph style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  margin: 0, 
                  fontSize: '16px',
                  marginTop: '8px'
                }}>
                  Xem và quản lý các tài khoản người dùng trong hệ thống
                </Paragraph>
              </div>
            </div>
          </div>          {/* Search Section */}
          <Card 
            style={{
              marginBottom: '32px',
              borderRadius: '16px',
              border: `1px solid ${COLORS.gray200}`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
            size="small"
          >
            <Row gutter={[16,16]} align="middle">
              <Col xs={24} sm={18} md={20} lg={22}>                <Input
                  name="search"
                  prefix={<SearchOutlined />}
                  placeholder="Tìm kiếm theo email hoặc họ tên..."
                  value={filters.search}
                  onChange={handleFilterInputChange}
                  onPressEnter={() => fetchUsers(1, pagination.pageSize)}
                  allowClear
                  style={{ height: '42px' }}
                />
              </Col>
              <Col xs={24} sm={6} md={4} lg={2}>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={() => fetchUsers()} 
                  loading={loading} 
                  block
                  style={{
                    height: '42px',
                    border: `2px solid ${COLORS.primary}`,
                    color: COLORS.primary,
                    fontWeight: 500
                  }}
                >
                  Tải lại
                </Button>
              </Col>
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
          
          {/* Table Section */}
          <Table 
            columns={columns} 
            dataSource={users} 
            rowKey="id" 
            loading={loading}
            pagination={{
              ...pagination,
              style: { marginTop: '32px' },
              showTotal: (total, range) => 
                `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} người dùng`,
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
            }}            locale={{ emptyText: <Empty description="Không có người dùng nào phù hợp với tiêu chí lọc." /> }}
          />

          {/* Role Change Modal */}
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
                    backgroundColor: COLORS.warning,
                  }}
                  icon={<SwapOutlined />}
                />
                Thay Đổi Quyền Người Dùng
              </div>
            }
            open={isRoleModalVisible}
            onOk={handleUpdateRole}            onCancel={() => {
              setIsRoleModalVisible(false); 
              setSelectedUser(null); 
              roleForm.resetFields();
            }}
            confirmLoading={roleModalLoading}
            okText="Lưu thay đổi"
            cancelText="Hủy"
            destroyOnClose
            okButtonProps={{
              style: {
                background: `linear-gradient(135deg, ${COLORS.warning} 0%, #d97706 100%)`,
                border: 'none',
                height: '42px',
                borderRadius: '12px',
                fontWeight: 600,
                boxShadow: `0 4px 12px ${COLORS.warning}30`
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
              background: `linear-gradient(135deg, ${COLORS.gray50} 0%, ${COLORS.orange50} 100%)`,
              padding: '24px',
              borderRadius: '16px',
              margin: '16px 0'
            }}>
              <Form form={roleForm} layout="vertical">
                <div style={{ marginBottom: '16px' }}>
                  <Title level={5} style={{ color: COLORS.dark, margin: 0 }}>
                    Người dùng: <Text strong style={{ color: COLORS.primary }}>{selectedUser?.fullName || selectedUser?.email}</Text>
                  </Title>
                  <Paragraph style={{ color: COLORS.textLight, margin: 0, marginTop: '4px' }}>
                    Email: <Text style={{ color: COLORS.dark }}>{selectedUser?.email}</Text>
                  </Paragraph>
                </div>
                
                <Form.Item
                  name="role"
                  label={<span style={{ fontWeight: 600, color: COLORS.dark, fontSize: '15px' }}>Quyền mới</span>}
                  rules={[{required: true, message: "Vui lòng chọn quyền!"}]}
                >
                  <Select 
                    placeholder="Chọn quyền"
                    style={{ height: '44px' }}
                  >
                    {USER_ROLES.map(role => (
                      <Option key={role.value} value={role.value}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {role.icon}
                          {role.label}
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            </div>
          </Modal>
        </Card>
      </div>
    </>
  );
};
export default AdminManageUsers;
