import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Modal, Form, Input, Space, Tooltip, Popconfirm, message, Switch, Select, Tag, Card, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { TableProps, PaginationProps } from 'antd';
import subjectGroupAdminService from '../services/subjectGroupAdminService';
import { SubjectGroupFE } from '../../subjectGroup/types';

const { Title, Paragraph } = Typography;
const { Option } = Select;

interface SubjectGroupFormData {
  code: string;
  name: string;
  subjects: string[]; // Sẽ dùng Select mode="tags" để nhập
  isActive?: boolean;
}

// Danh sách các môn học phổ biến (có thể lấy từ API nếu cần)
const COMMON_SUBJECTS = [
  'Toán', 'Vật Lý', 'Hóa Học', 'Sinh Học', 'Ngữ Văn', 'Lịch Sử', 'Địa Lý', 
  'Tiếng Anh', 'Tiếng Pháp', 'Tiếng Nhật', 'Tiếng Trung', 'Tiếng Nga', 'Tiếng Đức',
  'Giáo dục công dân', 'Tin học'
];

const AdminManageSubjectGroups: React.FC = () => {
  const [subjectGroups, setSubjectGroups] = useState<SubjectGroupFE[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubjectGroup, setEditingSubjectGroup] = useState<SubjectGroupFE | null>(null);
  const [form] = Form.useForm<SubjectGroupFormData>();
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '50']
  });

  const fetchSubjectGroups = useCallback(async (page = pagination.current, size = pagination.pageSize, search = searchText) => {
    setLoading(true);
    try {
      const response = await subjectGroupAdminService.getAll({ page, limit: size, search });
      if (response.success && response.data) {
        setSubjectGroups(response.data);
        setPagination(prev => ({ ...prev, total: response.total || 0, current: page, pageSize: size }));
      } else {
        message.error(response.message || 'Không thể tải danh sách tổ hợp môn.');
      }
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu tổ hợp môn.');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchText]);

  useEffect(() => {
    fetchSubjectGroups();
  }, [fetchSubjectGroups]);

  const handleTableChange: TableProps<SubjectGroupFE>['onChange'] = (newPagination) => {
    fetchSubjectGroups(newPagination.current, newPagination.pageSize, searchText);
  };

  const handleAdd = () => {
    setEditingSubjectGroup(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true, subjects: [] });
    setIsModalVisible(true);
  };

  const handleEdit = (record: SubjectGroupFE) => {
    setEditingSubjectGroup(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await subjectGroupAdminService.delete(id);
      if (response.success) {
        message.success('Xóa tổ hợp môn thành công!');
        fetchSubjectGroups(); 
      } else {
        message.error(response.message || 'Xóa tổ hợp môn thất bại.');
      }
    } catch (error) {
      message.error('Lỗi khi xóa tổ hợp môn.');
    } finally {
        setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      // Đảm bảo subjects là mảng các string, không có giá trị rỗng hoặc trùng lặp
      const processedSubjects = Array.from(new Set(values.subjects.map(s => s.trim()).filter(s => s)));
      if (processedSubjects.length === 0) {
        message.error('Tổ hợp môn phải có ít nhất một môn học.');
        return;
      }
      const dataToSubmit = { ...values, subjects: processedSubjects };

      setLoading(true);
      let response;
      if (editingSubjectGroup) {
        response = await subjectGroupAdminService.update(editingSubjectGroup.id, dataToSubmit);
      } else {
        response = await subjectGroupAdminService.create(dataToSubmit);
      }

      if (response.success) {
        message.success(editingSubjectGroup ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        setIsModalVisible(false);
        fetchSubjectGroups(); 
      } else {
        message.error(response.message || (editingSubjectGroup ? 'Cập nhật thất bại.' : 'Thêm mới thất bại.'));
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
    fetchSubjectGroups(1, pagination.pageSize, value);
  };

  const columns: TableProps<SubjectGroupFE>['columns'] = [
    { title: 'Mã Tổ Hợp', dataIndex: 'code', key: 'code', width: 150, sorter: (a,b) => a.code.localeCompare(b.code) },
    { title: 'Tên Tổ Hợp / Các Môn', dataIndex: 'name', key: 'name', sorter: (a,b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div>
          <Typography.Text strong>{text}</Typography.Text>
          <br />
          <Space wrap size={[0, 8]}>
            {record.subjects.map(subject => <Tag key={subject} color="blue">{subject}</Tag>)}
          </Space>
        </div>
      )
    },
    { title: 'Trạng thái', dataIndex: 'isActive', key: 'isActive', width: 120, align: 'center', render: (isActive: boolean) => isActive ? <Tag color="success">Hoạt động</Tag> : <Tag color="error">Ẩn</Tag>, filters: [{text: 'Hoạt động', value: true}, {text: 'Ẩn', value: false}], onFilter: (value, record) => record.isActive === value},
    {
      title: 'Hành Động',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_: any, record: SubjectGroupFE) => (
        <Space size="middle">
          <Tooltip title="Sửa">
            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Popconfirm title="Bạn có chắc muốn xóa tổ hợp này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
             <Tooltip title="Xóa">
                <Button type="primary" shape="circle" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản Lý Tổ Hợp Môn Xét Tuyển" className="shadow-lg rounded-lg">
      <Paragraph className="text-gray-600 mb-6">
        Thêm mới, chỉnh sửa hoặc xóa các tổ hợp môn được sử dụng trong hệ thống.
      </Paragraph>
      <Row justify="space-between" align="middle" className="mb-4">
        <Col xs={24} sm={12} md={10} lg={8}>
            <Input.Search 
                placeholder="Tìm theo tên hoặc mã tổ hợp..."
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
                allowClear
                loading={loading && !!searchText}
            />
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => fetchSubjectGroups(1, pagination.pageSize, '')} loading={loading}>
              Tải lại
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
              Thêm Tổ Hợp Mới
            </Button>
          </Space>
        </Col>
      </Row>
      <Table 
        columns={columns} 
        dataSource={subjectGroups} 
        rowKey="id" 
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}
        bordered
        className="shadow rounded-lg overflow-hidden"
      />
      <Modal
        title={editingSubjectGroup ? "Chỉnh Sửa Tổ Hợp Môn" : "Thêm Tổ Hợp Môn Mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        okText={editingSubjectGroup ? "Lưu thay đổi" : "Thêm mới"}
        cancelText="Hủy"
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical" name="subjectGroupFormAdmin">
          <Form.Item name="code" label="Mã Tổ Hợp (ví dụ: A00, D07)" rules={[{ required: true, message: 'Vui lòng nhập mã tổ hợp!' }]}>
            <Input placeholder="A00" />
          </Form.Item>
          <Form.Item name="name" label="Tên Tổ Hợp (ví dụ: Toán, Lý, Hóa)" rules={[{ required: true, message: 'Vui lòng nhập tên tổ hợp!' }]}>
            <Input placeholder="Toán, Vật Lý, Hóa Học" />
          </Form.Item>
          <Form.Item 
            name="subjects" 
            label="Các Môn Học Trong Tổ Hợp" 
            rules={[{ required: true, type: 'array', min: 1, message: 'Vui lòng chọn ít nhất một môn học!' }]}
          >
            <Select
              mode="tags" // Cho phép nhập tự do và chọn từ danh sách gợi ý
              style={{ width: '100%' }}
              placeholder="Nhập tên môn và nhấn Enter, hoặc chọn từ gợi ý"
              tokenSeparators={[',']} // Có thể dùng dấu phẩy để tách các tag
            >
              {COMMON_SUBJECTS.map(subject => (
                <Option key={subject} value={subject}>{subject}</Option>
              ))}
            </Select>
          </Form.Item>
           <Form.Item name="isActive" label="Trạng thái hiển thị" valuePropName="checked">
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Ẩn" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
export default AdminManageSubjectGroups;