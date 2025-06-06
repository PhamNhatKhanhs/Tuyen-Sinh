import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Space, Tooltip, Popconfirm, message, Switch, Select, Input, Row, Col, Card, Tag, Form, Empty, Alert } from 'antd';
import { EditOutlined, ReloadOutlined, SearchOutlined, FilterOutlined, UserSwitchOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { TableProps, PaginationProps } from 'antd';
import userAdminService from '../services/userAdminService';
import type { User } from '../../auth/types';
import dayjs from 'dayjs'; // Để format ngày tháng

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const USER_ROLES = [
    { value: 'candidate', label: 'Thí sinh' },
    { value: 'admin', label: 'Quản trị viên' },
];

const AdminManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<{
    search: string;
    role?: 'candidate' | 'admin';
  }>({
    search: '',
    role: undefined,
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
        ...filters,
        page: pagination.current,
        limit: pagination.pageSize,
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
  }, [pagination.current, pagination.pageSize, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleTableChange: TableProps<User>['onChange'] = (newPagination, _filters, sorter) => {
    fetchUsers(newPagination.current, newPagination.pageSize, sorter as any);
  };

  const handleFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  const handleFilterSelectChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  const onApplyFilters = () => {
      fetchUsers(1, pagination.pageSize); 
  };
   const onResetFilters = () => {
    setFilters({ search: '', role: undefined });
    // fetchUsers(1, pagination.pageSize); // Sẽ được trigger bởi useEffect của fetchUsers
  };

  const handleToggleUserStatus = async (userId: string, currentIsActive?: boolean) => {
    if (typeof currentIsActive === 'undefined') return;
    const newIsActive = !currentIsActive;
    try {
        setLoading(true); // Có thể dùng loading riêng cho từng row
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
        setLoading(false);
    }
  };


  const columns: TableProps<User>['columns'] = [
    { title: 'ID Người Dùng', dataIndex: 'id', key: 'id', width: 220, ellipsis: true, render: (text) => <Text copyable>{text}</Text>},
    { title: 'Họ Tên', dataIndex: 'fullName', key: 'fullName', ellipsis: true, sorter: (a,b) => (a.fullName || '').localeCompare(b.fullName || '') },
    { title: 'Email', dataIndex: 'email', key: 'email', ellipsis: true, sorter: (a,b) => a.email.localeCompare(b.email) },
    { title: 'Vai Trò', dataIndex: 'role', key: 'role', width: 150, align: 'center', 
      render: (role: string) => <Tag color={role === 'admin' ? 'volcano' : 'geekblue'}>{role.toUpperCase()}</Tag>,
      filters: USER_ROLES.map(r => ({text: r.label, value: r.value})),
      // onFilter: (value, record) => record.role === value, // Sẽ xử lý filter qua state
    },
    // { title: 'Ngày Tạo', dataIndex: 'createdAt', key: 'createdAt', width: 180, align: 'center', 
    //   render: (text?: string) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : 'N/A',
    //   sorter: (a,b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
    // },
    { title: 'Trạng Thái', dataIndex: 'isActive', key: 'isActive', width: 120, align: 'center', 
      render: (isActive: boolean, record: User) => (
        <Switch 
            checkedChildren={<CheckCircleOutlined />} 
            unCheckedChildren={<CloseCircleOutlined />} 
            checked={isActive} 
            onChange={() => handleToggleUserStatus(record.id, record.isActive)}
            loading={loading} // Có thể thêm loading riêng cho từng switch
        />
      ),
      filters: [{text: 'Hoạt động', value: true}, {text: 'Vô hiệu hóa', value: false}],
      // onFilter: (value, record) => record.isActive === value,
    },
    // {
    //   title: 'Hành Động',
    //   key: 'action',
    //   width: 100,
    //   align: 'center',
    //   render: (_: any, record: User) => (
    //     <Tooltip title="Chỉnh sửa (Tương lai)">
    //       <Button type="text" shape="circle" icon={<EditOutlined />} disabled />
    //     </Tooltip>
    //   ),
    // },
  ];

  return (
    <Card title={<Title level={3} className="!mb-0">Quản Lý Người Dùng</Title>} className="shadow-lg rounded-lg">
      <Paragraph className="text-gray-600 mb-6">Xem và quản lý các tài khoản người dùng trong hệ thống.</Paragraph>
      
      <Card title={<><FilterOutlined /> Bộ lọc người dùng</>} className="mb-6 shadow-sm rounded-lg" variant="borderless" size="small">
        <Row gutter={[16,16]} align="bottom">
            <Col xs={24} sm={12} md={10} lg={8}>
                <Form.Item label="Tìm kiếm Email/Họ tên" className="!mb-0">
                <Input
                    name="search"
                    prefix={<SearchOutlined />}
                    placeholder="Nhập email hoặc họ tên..."
                    value={filters.search}
                    onChange={handleFilterInputChange}
                    allowClear
                />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label="Vai trò" className="!mb-0">
                <Select
                    placeholder="Tất cả vai trò"
                    style={{ width: '100%' }}
                    allowClear
                    value={filters.role}
                    onChange={value => handleFilterSelectChange('role', value)}
                    options={USER_ROLES}
                />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={3} lg={3}>
                <Button icon={<FilterOutlined />} onClick={onApplyFilters} loading={loading} type="primary" block>Lọc</Button>
            </Col>
             <Col xs={24} sm={12} md={3} lg={3}>
                <Button icon={<ReloadOutlined />} onClick={onResetFilters} loading={loading} block>Reset</Button>
            </Col>
        </Row>
      </Card>

      {error && !loading && <Alert message={error} type="error" showIcon className="mb-4" />}
      
      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="id" 
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
        className="shadow rounded-lg overflow-hidden"
        bordered
        locale={{ emptyText: <Empty description="Không có người dùng nào phù hợp." /> }}
       />
    </Card>
  );
};
export default AdminManageUsers;
