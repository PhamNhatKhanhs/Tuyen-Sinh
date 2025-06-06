import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Modal, Form, Input, Space, Tooltip, Popconfirm, message, Switch, InputNumber, Select, Pagination, Tag, Row, Col, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import type { TableProps, PaginationProps } from 'antd';
import majorAdminService from '../services/majorAdminService';
import { MajorFE } from '../../major/types';
import { UniversityFE } from '../../university/types'; // Cần để hiển thị tên trường và lọc

const { Title: PageAdminTitle, Paragraph: PageAdminParagraph } = Typography; // Đổi tên để tránh xung đột
const { Option: AntdAdminOption } = Select; // Đổi tên

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
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1, pageSize: 5, total: 0, showSizeChanger: true, pageSizeOptions: ['5', '10', '20']
  });

  const fetchMajors = useCallback(async (page = pagination.current, size = pagination.pageSize, search = searchText, uniId = filterUniversityId) => {
    setLoading(true);
    try {
      const response = await majorAdminService.getAll({ page, limit: size, search, universityId: uniId });
      if (response.success && response.data) {
        setMajors(response.data);
        setPagination(prev => ({ ...prev, total: response.total || 0, current: page, pageSize: size }));
      } else {
        message.error(response.message || 'Không thể tải danh sách ngành.');
      }
    } catch (error) { message.error('Lỗi khi tải dữ liệu ngành.'); } 
    finally { setLoading(false); }
  }, [pagination.current, pagination.pageSize, searchText, filterUniversityId]);

  useEffect(() => {
    // Fetch universities for filter dropdown
    const fetchUniversitiesForFilter = async () => {
        const res = await majorAdminService.getUniversitiesForSelect(); // Dùng hàm mới trong majorAdminService
        if (res.success && res.data) {
            setUniversitiesForFilter(res.data);
        }
    };
    fetchUniversitiesForFilter();
    fetchMajors();
  }, [fetchMajors]);

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
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await majorAdminService.delete(id);
      if (response.success) {
        message.success('Xóa ngành thành công!');
        fetchMajors(); 
      } else { message.error(response.message || 'Xóa ngành thất bại.'); }
    } catch (error) { message.error('Lỗi khi xóa ngành.'); }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      let response;
      const majorDataSubmit = { ...values, university: values.university }; // Đảm bảo university là ID

      if (editingMajor) {
        // Không gửi universityId khi update vì BE không cho phép thay đổi trường của ngành
        const { university, ...updateData } = majorDataSubmit;
        response = await majorAdminService.update(editingMajor.id, updateData);
      } else {
        response = await majorAdminService.create(majorDataSubmit);
      }

      if (response.success) {
        message.success(editingMajor ? 'Cập nhật ngành thành công!' : 'Thêm ngành thành công!');
        setIsModalVisible(false);
        fetchMajors(); 
      } else { message.error(response.message || (editingMajor ? 'Cập nhật thất bại.' : 'Thêm mới thất bại.')); }
    } catch (info) { console.log('Validate Failed:', info); message.error('Vui lòng kiểm tra lại thông tin.'); } 
    finally { setLoading(false); }
  };
  
  const handleSearch = (value: string) => { setSearchText(value); fetchMajors(1, pagination.pageSize, value, filterUniversityId); };
  const handleFilterUniversity = (value: string | undefined) => { setFilterUniversityId(value); fetchMajors(1, pagination.pageSize, searchText, value); };


  const columns: TableProps<MajorFE>['columns'] = [
    { title: 'Mã Ngành', dataIndex: 'code', key: 'code', width: 120 },
    { title: 'Tên Ngành', dataIndex: 'name', key: 'name' },
    { title: 'Thuộc Trường', dataIndex: 'universityName', key: 'universityName', render: (text, record) => record.universityName || record.universityId, responsive: ['md'] },
    { title: 'Chỉ Tiêu', dataIndex: 'admissionQuota', key: 'admissionQuota', align: 'right', width: 100, responsive: ['sm'] },
    { title: 'Trạng thái', dataIndex: 'isActive', key: 'isActive', render: (isActive: boolean) => isActive ? <Tag color="success">Hoạt động</Tag> : <Tag color="error">Ẩn</Tag>, width: 120, align: 'center' },
    { title: 'Hành Động', key: 'action', width: 120, align: 'center', render: (_: any, record: MajorFE) => ( <Space size="small"> <Tooltip title="Sửa"><Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => handleEdit(record)} /></Tooltip> <Popconfirm title="Xóa ngành này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}><Tooltip title="Xóa"><Button type="primary" shape="circle" danger icon={<DeleteOutlined />} /></Tooltip></Popconfirm> </Space> ), },
  ];

  return (
    <Card title="Quản Lý Danh Sách Ngành Học" className="shadow-lg rounded-lg">
      <PageAdminParagraph className="text-gray-600 mb-6">Quản lý thông tin các ngành học, chỉ tiêu tuyển sinh cho từng trường.</PageAdminParagraph>
      <Row gutter={[16, 16]} justify="space-between" align="middle" className="mb-4">
        <Col xs={24} sm={12} md={8}>
          <Input.Search placeholder="Tìm theo tên hoặc mã ngành..." onSearch={handleSearch} enterButton={<SearchOutlined />} allowClear loading={loading && !!searchText}/>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Select
            showSearch
            placeholder="Lọc theo trường đại học"
            onChange={handleFilterUniversity}
            style={{ width: '100%' }}
            allowClear
            loading={universitiesForFilter.length === 0 && loading} // Chỉ loading khi chưa có dữ liệu trường
            filterOption={(input, option) => (option?.label?.toString().toLowerCase().includes(input.toLowerCase()) || option?.value?.toString().toLowerCase().includes(input.toLowerCase()))}
            value={filterUniversityId}
          >
            {universitiesForFilter.map(uni => <AntdAdminOption key={uni.id} value={uni.id} label={`${uni.name} (${uni.code})`}>{uni.name} ({uni.code})</AntdAdminOption>)}
          </Select>
        </Col>
        <Col xs={24} sm={24} md={8} className="text-right">
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => fetchMajors(1, pagination.pageSize, '', undefined)} loading={loading}>Tải lại</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} className="bg-green-600 hover:bg-green-700">Thêm Ngành Mới</Button>
          </Space>
        </Col>
      </Row>
      <Table columns={columns} dataSource={majors} rowKey="id" loading={loading} pagination={pagination} onChange={handleTableChange} scroll={{ x: 'max-content' }} bordered className="shadow rounded-lg overflow-hidden"/>
      <Modal title={editingMajor ? "Chỉnh Sửa Ngành Học" : "Thêm Ngành Học Mới"} open={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)} confirmLoading={loading} okText={editingMajor ? "Lưu" : "Thêm"} cancelText="Hủy" destroyOnClose width={600}>
        <Form form={form} layout="vertical" name="majorFormAdmin">
          <Form.Item name="university" label="Trường Đại Học" rules={[{ required: true, message: 'Vui lòng chọn trường!' }]}>
            <Select placeholder="Chọn trường" showSearch filterOption={(input, option) => (option?.label?.toString().toLowerCase().includes(input.toLowerCase()) || option?.value?.toString().toLowerCase().includes(input.toLowerCase()))} disabled={!!editingMajor}>
              {universitiesForFilter.map(uni => <AntdAdminOption key={uni.id} value={uni.id} label={`${uni.name} (${uni.code})`}>{uni.name} ({uni.code})</AntdAdminOption>)}
            </Select>
          </Form.Item>
          <Form.Item name="name" label="Tên Ngành" rules={[{ required: true, message: 'Vui lòng nhập tên ngành!' }]}><Input /></Form.Item>
          <Form.Item name="code" label="Mã Ngành (của trường)" rules={[{ required: true, message: 'Vui lòng nhập mã ngành!' }]}><Input /></Form.Item>
          <Form.Item name="admissionQuota" label="Chỉ tiêu tuyển sinh" rules={[{ type: 'number', min: 0, message: 'Chỉ tiêu phải là số không âm'}]}><InputNumber style={{width: '100%'}} placeholder="0" /></Form.Item>
          <Form.Item name="description" label="Mô tả ngắn"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="isActive" label="Trạng thái hiển thị" valuePropName="checked"><Switch checkedChildren="Hoạt động" unCheckedChildren="Ẩn" /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
export default AdminManageMajors;