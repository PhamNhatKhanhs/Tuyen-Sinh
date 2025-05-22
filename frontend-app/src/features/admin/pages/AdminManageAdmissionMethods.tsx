import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Modal, Form, Input, Space, Tooltip, Popconfirm, message, Switch, Pagination } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { TableProps, PaginationProps } from 'antd';
import admissionMethodAdminService from '../services/admissionMethodAdminService';
import { AdmissionMethodFE } from '../../admissionMethod/types';

const { Title, Paragraph } = Typography;

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
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10, // Số lượng item mỗi trang
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '50']
  });

  const fetchMethods = useCallback(async (page = pagination.current, size = pagination.pageSize, search = searchText) => {
    setLoading(true);
    try {
      const response = await admissionMethodAdminService.getAll({ page, limit: size, search });
      if (response.success && response.data) {
        setMethods(response.data);
        setPagination(prev => ({ ...prev, total: response.total || 0, current: page, pageSize: size }));
      } else {
        message.error(response.message || 'Không thể tải danh sách phương thức xét tuyển.');
      }
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu phương thức xét tuyển.');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchText]);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

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
        fetchMethods(); // Tải lại danh sách
      } else {
        message.error(response.message || 'Xóa phương thức thất bại.');
      }
    } catch (error) {
      message.error('Lỗi khi xóa phương thức.');
    } finally {
        setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      let response;
      if (editingMethod) {
        response = await admissionMethodAdminService.update(editingMethod.id, values);
      } else {
        response = await admissionMethodAdminService.create(values);
      }

      if (response.success) {
        message.success(editingMethod ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        setIsModalVisible(false);
        fetchMethods(); 
      } else {
        message.error(response.message || (editingMethod ? 'Cập nhật thất bại.' : 'Thêm mới thất bại.'));
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
    fetchMethods(1, pagination.pageSize, value);
  };

  const columns: TableProps<AdmissionMethodFE>['columns'] = [
    { title: 'Tên Phương Thức', dataIndex: 'name', key: 'name', sorter: (a,b) => a.name.localeCompare(b.name) },
    { title: 'Mã (Code)', dataIndex: 'code', key: 'code', width: 150, sorter: (a,b) => (a.code || '').localeCompare(b.code || '') },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true, responsive: ['md'] },
    { title: 'Trạng thái', dataIndex: 'isActive', key: 'isActive', width: 120, align: 'center', render: (isActive: boolean) => isActive ? <Tag color="success">Hoạt động</Tag> : <Tag color="error">Ẩn</Tag>, filters: [{text: 'Hoạt động', value: true}, {text: 'Ẩn', value: false}], onFilter: (value, record) => record.isActive === value},
    {
      title: 'Hành Động',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_: any, record: AdmissionMethodFE) => (
        <Space size="middle">
          <Tooltip title="Sửa">
            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Popconfirm title="Bạn có chắc muốn xóa phương thức này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
             <Tooltip title="Xóa">
                <Button type="primary" shape="circle" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản Lý Phương Thức Xét Tuyển" className="shadow-lg rounded-lg">
      <Paragraph className="text-gray-600 mb-6">
        Thêm mới, chỉnh sửa hoặc xóa các phương thức xét tuyển của hệ thống.
      </Paragraph>
      <Row justify="space-between" align="middle" className="mb-4">
        <Col xs={24} sm={12} md={10} lg={8}>
            <Input.Search 
                placeholder="Tìm theo tên hoặc mã..."
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
                allowClear
                loading={loading && !!searchText}
            />
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => fetchMethods(1, pagination.pageSize, '')} loading={loading}>
              Tải lại
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
              Thêm Phương Thức Mới
            </Button>
          </Space>
        </Col>
      </Row>
      <Table 
        columns={columns} 
        dataSource={methods} 
        rowKey="id" 
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}
        bordered
        className="shadow rounded-lg overflow-hidden"
      />
      <Modal
        title={editingMethod ? "Chỉnh Sửa Phương Thức Xét Tuyển" : "Thêm Phương Thức Mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        okText={editingMethod ? "Lưu thay đổi" : "Thêm mới"}
        cancelText="Hủy"
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical" name="admissionMethodFormAdmin">
          <Form.Item name="name" label="Tên Phương Thức" rules={[{ required: true, message: 'Vui lòng nhập tên phương thức!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="Mã Phương Thức (tùy chọn, ví dụ: PTXT01)">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả ngắn">
            <Input.TextArea rows={3} />
          </Form.Item>
           <Form.Item name="isActive" label="Trạng thái hiển thị" valuePropName="checked">
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Ẩn" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
export default AdminManageAdmissionMethods;