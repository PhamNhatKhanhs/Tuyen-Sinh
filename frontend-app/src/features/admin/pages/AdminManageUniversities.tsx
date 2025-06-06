import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Modal, Form, Input, Space, Tooltip, Popconfirm, message, Switch, InputNumber, Pagination, Row, Col, Tag, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { TableProps, PaginationProps } from 'antd';
import universityAdminService from '../services/universityAdminService';
import { UniversityFE } from '../../university/types'; // Sử dụng lại type

const { Title, Paragraph } = Typography;

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

  const columns: TableProps<UniversityFE>['columns'] = [
    { title: 'Mã Trường', dataIndex: 'code', key: 'code', sorter: (a,b) => a.code.localeCompare(b.code) },
    { title: 'Tên Trường', dataIndex: 'name', key: 'name', sorter: (a,b) => a.name.localeCompare(b.name) },
    { title: 'Địa Chỉ', dataIndex: 'address', key: 'address', responsive: ['md'] },
    { title: 'Website', dataIndex: 'website', key: 'website', render: (text:string) => text ? <a href={text} target="_blank" rel="noopener noreferrer">{text}</a> : '-', responsive: ['lg']},
    { title: 'Trạng thái', dataIndex: 'isActive', key: 'isActive', render: (isActive: boolean) => isActive ? <Tag color="success">Hoạt động</Tag> : <Tag color="error">Ẩn</Tag>, filters: [{text: 'Hoạt động', value: true}, {text: 'Ẩn', value: false}], onFilter: (value, record) => record.isActive === value},
    {
      title: 'Hành Động',
      key: 'action',
      render: (_: any, record: UniversityFE) => (
        <Space size="middle">
          <Tooltip title="Sửa">
            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Popconfirm title="Bạn có chắc muốn xóa trường này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
             <Tooltip title="Xóa">
                <Button type="primary" shape="circle" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản Lý Danh Sách Trường Đại Học" className="shadow-lg rounded-lg">
      <Paragraph className="text-gray-600 mb-6">
        Thêm mới, chỉnh sửa hoặc xóa thông tin các trường đại học trong hệ thống.
      </Paragraph>
      <Row justify="space-between" align="middle" className="mb-4">
        <Col xs={24} sm={12} md={10} lg={8}>
            <Input.Search 
                placeholder="Tìm theo tên hoặc mã trường..."
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
                allowClear
                loading={loading && !!searchText}
            />
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => fetchUniversities(1, pagination.pageSize, '')} loading={loading}>
              Tải lại
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
              Thêm Trường Mới
            </Button>
          </Space>
        </Col>
      </Row>
      <Table 
        columns={columns} 
        dataSource={universities} 
        rowKey="id" 
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}
        bordered
        className="shadow rounded-lg overflow-hidden"
      />
      <Modal
        title={editingUniversity ? "Chỉnh Sửa Thông Tin Trường" : "Thêm Trường Đại Học Mới"}
        open={isModalVisible} // Sửa 'visible' thành 'open' cho AntD v5+
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        okText={editingUniversity ? "Lưu thay đổi" : "Thêm mới"}
        cancelText="Hủy"
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical" name="universityFormAdmin">
          <Form.Item name="name" label="Tên Trường" rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="Mã Trường" rules={[{ required: true, message: 'Vui lòng nhập mã trường!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Địa Chỉ">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="website" label="Website (ví dụ: https://example.edu.vn)" rules={[{ type: 'url', message: 'Địa chỉ website không hợp lệ!'}]}>
            <Input placeholder="https://example.com"/>
          </Form.Item>
          <Form.Item name="logoUrl" label="URL Logo Trường" rules={[{ type: 'url', message: 'URL logo không hợp lệ!'}]}>
            <Input placeholder="https://example.com/logo.png"/>
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
export default AdminManageUniversities;