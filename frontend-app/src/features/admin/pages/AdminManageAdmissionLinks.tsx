import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Modal, Form, Select, Space, Tooltip, Popconfirm, message, Switch, InputNumber, Tag, Row, Col, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import type { TableProps, PaginationProps } from 'antd';

import admissionLinkAdminService, { AdmissionLinkFormData } from '../services/admissionLinkAdminService';
import { AdmissionLinkFE } from '../../admissionLink/types';
import universityAdminService from '../services/universityAdminService';
import majorAdminService from '../services/majorAdminService';
import admissionMethodAdminService from '../services/admissionMethodAdminService';
import subjectGroupAdminService from '../services/subjectGroupAdminService';

import { UniversityFE } from '../../university/types';
import { MajorFE } from '../../major/types';
import { AdmissionMethodFE } from '../../admissionMethod/types';
import { SubjectGroupFE } from '../../subjectGroup/types';


const { Title, Paragraph } = Typography;
const { Option } = Select;

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i - 2).map(year => ({ label: year.toString(), value: year }));


const AdminManageAdmissionLinks: React.FC = () => {
  const [links, setLinks] = useState<AdmissionLinkFE[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLink, setEditingLink] = useState<AdmissionLinkFE | null>(null);
  const [form] = Form.useForm<AdmissionLinkFormData>();
  
  const [universities, setUniversities] = useState<Pick<UniversityFE, 'id' | 'name' | 'code'>[]>([]);
  const [majors, setMajors] = useState<Pick<MajorFE, 'id' | 'name' | 'code'>[]>([]);
  const [admissionMethods, setAdmissionMethods] = useState<Pick<AdmissionMethodFE, 'id' | 'name' | 'code'>[]>([]);
  const [subjectGroups, setSubjectGroups] = useState<Pick<SubjectGroupFE, 'id' | 'name' | 'code' | 'subjects'>[]>([]);

  const [loadingModalData, setLoadingModalData] = useState(false);
  const selectedUniversityInModal = Form.useWatch('university', form); 

  const [filterUniversityId, setFilterUniversityId] = useState<string | undefined>(undefined);
  const [filterMajorId, setFilterMajorId] = useState<string | undefined>(undefined);
  const [filterMethodId, setFilterMethodId] = useState<string | undefined>(undefined);
  const [filterGroupId, setFilterGroupId] = useState<string | undefined>(undefined);
  const [filterYear, setFilterYear] = useState<number | undefined>(currentYear);

  const [majorsForFilter, setMajorsForFilter] = useState<Pick<MajorFE, 'id' | 'name' | 'code'>[]>([]);


  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1, pageSize: 10, total: 0, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100']
  });

  const fetchLinks = useCallback(async (page = pagination.current, size = pagination.pageSize) => {
    setLoading(true);
    try {
      const params = { 
        page, limit: size, 
        universityId: filterUniversityId,
        majorId: filterMajorId,
        admissionMethodId: filterMethodId,
        subjectGroupId: filterGroupId,
        year: filterYear,
        sortBy: 'year', sortOrder: 'desc' 
      };
      const response = await admissionLinkAdminService.getAll(params);
      if (response.success && response.data) {
        setLinks(response.data);
        setPagination(prev => ({ ...prev, total: response.total || 0, current: page, pageSize: size }));
      } else {
        message.error(response.message || 'Không thể tải danh sách liên kết.');
      }
    } catch (error) { message.error('Lỗi khi tải dữ liệu liên kết.'); } 
    finally { setLoading(false); }
  }, [pagination.current, pagination.pageSize, filterUniversityId, filterMajorId, filterMethodId, filterGroupId, filterYear]);

  useEffect(() => {
    const loadInitialDataForSelects = async () => {
        setLoadingModalData(true);
        const [uniRes, methodRes, groupRes] = await Promise.all([
            universityAdminService.getAll({ limit: 1000, sortBy: 'name' }),
            admissionMethodAdminService.getAll({ limit: 1000, sortBy: 'name' }),
            subjectGroupAdminService.getAll({ limit: 1000, sortBy: 'code' })
        ]);
        if (uniRes.success && uniRes.data) setUniversities(uniRes.data.map(u => ({ id: u.id, name: u.name, code: u.code })));
        if (methodRes.success && methodRes.data) setAdmissionMethods(methodRes.data.map(m => ({ id: m.id, name: m.name, code: m.code })));
        if (groupRes.success && groupRes.data) setSubjectGroups(groupRes.data.map(g => ({ id: g.id, name: g.name, code: g.code, subjects: g.subjects })));
        setLoadingModalData(false);
    };
    loadInitialDataForSelects();
  }, []); // Chỉ chạy một lần khi mount

  useEffect(() => { // Fetch links khi component mount hoặc filter thay đổi
    fetchLinks();
  }, [fetchLinks]);


  useEffect(() => { 
    setMajorsForFilter([]);
    if (filterUniversityId) {
        majorAdminService.getAll({ universityId: filterUniversityId, limit: 1000, sortBy: 'name' })
            .then(res => {
                if (res.success && res.data) setMajorsForFilter(res.data.map(m => ({id: m.id, name: m.name, code: m.code})));
            });
    }
  }, [filterUniversityId]);


  useEffect(() => { 
    form.setFieldsValue({ major: undefined, admissionMethod: undefined, subjectGroup: undefined });
    setMajors([]);
    if (selectedUniversityInModal) {
        setLoadingModalData(true);
        majorAdminService.getAll({ universityId: selectedUniversityInModal, limit: 1000, sortBy: 'name' })
            .then(res => {
                if (res.success && res.data) setMajors(res.data.map(m => ({id: m.id, name: m.name, code: m.code})));
            })
            .finally(() => setLoadingModalData(false));
    }
  }, [selectedUniversityInModal, form]);


  const handleTableChange: TableProps<AdmissionLinkFE>['onChange'] = (newPagination) => {
    fetchLinks(newPagination.current, newPagination.pageSize);
  };

  const handleAdd = () => {
    setEditingLink(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true, year: currentYear });
    setMajors([]); 
    setIsModalVisible(true);
  };

  const handleEdit = (record: AdmissionLinkFE) => {
    setEditingLink(record);
    if (record.universityId) { 
        majorAdminService.getAll({ universityId: record.universityId, limit: 1000 }).then(res => {
            if (res.success && res.data) setMajors(res.data.map(m => ({id: m.id, name: m.name, code: m.code})));
        });
    }
    form.setFieldsValue({
        university: record.universityId, 
        major: record.majorId,
        admissionMethod: record.admissionMethodId,
        subjectGroup: record.subjectGroupId,
        year: record.year,
        minScoreRequired: record.minScoreRequired,
        isActive: record.isActive,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await admissionLinkAdminService.delete(id);
      if (response.success) {
        message.success('Xóa liên kết thành công!');
        fetchLinks(pagination.current, pagination.pageSize); 
      } else { message.error(response.message || 'Xóa liên kết thất bại.'); }
    } catch (error) { message.error('Lỗi khi xóa liên kết.'); } 
    finally { setLoading(false); }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields(); 
      const formData: AdmissionLinkFormData = {
          major: values.major, 
          admissionMethod: values.admissionMethod, 
          subjectGroup: values.subjectGroup, 
          year: values.year,
          minScoreRequired: values.minScoreRequired,
          isActive: values.isActive,
      };
      setLoading(true);
      let response;
      if (editingLink) {
        const updateData = { // Chỉ gửi các trường được phép update
            minScoreRequired: formData.minScoreRequired,
            isActive: formData.isActive
        }
        response = await admissionLinkAdminService.update(editingLink.id, updateData);
      } else {
        response = await admissionLinkAdminService.create(formData);
      }
      if (response.success) {
        message.success(editingLink ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        setIsModalVisible(false);
        fetchLinks(editingLink ? pagination.current : 1, pagination.pageSize); 
      } else { message.error(response.message || (editingLink ? 'Cập nhật thất bại.' : 'Thêm mới thất bại.')); }
    } catch (info) { 
        if (info && (info as any).errorFields && (info as any).errorFields.length > 0) {
            const firstError = (info as any).errorFields[0];
            message.error(`Lỗi tại trường "${firstError.name.join('.')}": ${firstError.errors[0]}`);
        } else {
            message.error('Vui lòng kiểm tra lại thông tin.');
        }
        console.log('Validate Failed:', info); 
    } 
    finally { setLoading(false); }
  };
  
  const columns: TableProps<AdmissionLinkFE>['columns'] = [
    { title: 'Năm', dataIndex: 'year', key: 'year', width: 80, align: 'center', sorter: (a,b) => a.year - b.year, defaultSortOrder: 'descend' },
    { title: 'Trường', dataIndex: 'universityName', key: 'universityName', render: (text, record) => `${text || 'N/A'} (${record.universityCode || record.universityId?.slice(-4) || 'N/A'})`, ellipsis: true, width: 250 },
    { title: 'Ngành', dataIndex: 'majorName', key: 'majorName', render: (text, record) => `${text || 'N/A'} (${record.majorCode || 'N/A'})`, ellipsis: true, width: 250 },
    { title: 'Phương Thức XT', dataIndex: 'admissionMethodName', key: 'admissionMethodName', ellipsis: true, width: 200 },
    { title: 'Tổ Hợp Môn', dataIndex: 'subjectGroupName', key: 'subjectGroupName', render: (text, record) => `${text || 'N/A'} (${record.subjectGroupCode || 'N/A'})`, ellipsis: true, width: 200 },
    { title: 'Điểm Sàn', dataIndex: 'minScoreRequired', key: 'minScoreRequired', width: 100, align: 'center', render: (text) => text ?? '-' },
    { title: 'Trạng thái', dataIndex: 'isActive', key: 'isActive', width: 120, align: 'center', render: (isActive?: boolean) => isActive ? <Tag color="success">Hoạt động</Tag> : <Tag color="error">Ẩn</Tag>},
    { title: 'Hành Động', key: 'action', width: 100, align: 'center', fixed: 'right', render: (_: any, record: AdmissionLinkFE) => ( <Space size="small"> <Tooltip title="Sửa"><Button type="text" shape="circle" icon={<EditOutlined className="text-blue-500" />} onClick={() => handleEdit(record)} /></Tooltip> <Popconfirm title="Xóa liên kết này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{danger: true}}><Tooltip title="Xóa"><Button type="text" shape="circle" danger icon={<DeleteOutlined />} /></Tooltip></Popconfirm> </Space> ), },
  ];

  return (
    <Card title="Quản Lý Liên Kết Tuyển Sinh (Ngành - PTXT - Tổ Hợp)" className="shadow-lg rounded-lg">
      <Paragraph className="text-gray-600 mb-6">Thiết lập các tổ hợp môn được chấp nhận cho từng ngành theo từng phương thức xét tuyển và năm.</Paragraph>
      
      <Row gutter={[16,16]} className="mb-4 items-end">
        <Col xs={24} sm={12} md={6} lg={5}>
            <Form.Item label="Lọc theo trường" className="!mb-0">
                <Select placeholder="Tất cả trường" style={{width: '100%'}} allowClear value={filterUniversityId} onChange={val => {setFilterUniversityId(val); setFilterMajorId(undefined);}} loading={universities.length === 0 && loadingFilterData} showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>
                    {universities.map(u => <Option key={u.id} value={u.id} label={u.name}>{u.name} ({u.code})</Option>)}
                </Select>
            </Form.Item>
        </Col>
         <Col xs={24} sm={12} md={6} lg={5}>
            <Form.Item label="Lọc theo ngành" className="!mb-0">
                <Select placeholder="Tất cả ngành" style={{width: '100%'}} allowClear value={filterMajorId} onChange={val => setFilterMajorId(val)} loading={loadingFilterData && !!filterUniversityId} disabled={!filterUniversityId} showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>
                    {majorsForFilter.map(m => <Option key={m.id} value={m.id} label={m.name}>{m.name} ({m.code})</Option>)}
                </Select>
            </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={4} lg={4}>
             <Form.Item label="Năm XT" className="!mb-0">
                <Select placeholder="Tất cả năm" style={{width: '100%'}} allowClear value={filterYear} onChange={val => setFilterYear(val)} options={yearOptions} />
            </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={4} lg={4}>
             <Form.Item label="Phương thức" className="!mb-0">
                <Select placeholder="Tất cả PTXT" style={{width: '100%'}} allowClear value={filterMethodId} onChange={val => setFilterMethodId(val)} loading={admissionMethods.length === 0 && loadingFilterData} showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>
                    {admissionMethods.map(m => <Option key={m.id} value={m.id} label={m.name}>{m.name} {m.code ? `(${m.code})` : ''}</Option>)}
                </Select>
            </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={4} lg={4}>
             <Form.Item label="Tổ hợp" className="!mb-0">
                 <Select placeholder="Tất cả tổ hợp" style={{width: '100%'}} allowClear value={filterGroupId} onChange={val => setFilterGroupId(val)} loading={subjectGroups.length === 0 && loadingFilterData} showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>
                    {subjectGroups.map(g => <Option key={g.id} value={g.id} label={g.name}>{g.name} ({g.code})</Option>)}
                </Select>
            </Form.Item>
        </Col>
         <Col xs={24} sm={12} md={3} lg={2}>
            <Button icon={<FilterOutlined />} onClick={() => fetchLinks(1, pagination.pageSize)} loading={loading} type="primary" block>Lọc</Button>
        </Col>
         <Col xs={24} sm={12} md={3} lg={2}>
            <Button icon={<ReloadOutlined />} onClick={() => {setFilterUniversityId(undefined); setFilterMajorId(undefined); setFilterMethodId(undefined); setFilterGroupId(undefined); setFilterYear(currentYear); fetchLinks(1, pagination.pageSize);}} loading={loading} block>Reset</Button>
        </Col>
      </Row>

      <div className="mb-4 text-right">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} className="bg-green-600 hover:bg-green-700">Thêm Liên Kết Mới</Button>
      </div>
      <Table columns={columns} dataSource={links} rowKey="id" loading={loading} pagination={pagination} onChange={handleTableChange} scroll={{ x: 1400 }} bordered className="shadow rounded-lg overflow-hidden"/>
      
      <Modal title={editingLink ? "Chỉnh Sửa Liên Kết Tuyển Sinh" : "Thêm Liên Kết Mới"} open={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)} confirmLoading={loading} okText={editingLink ? "Lưu" : "Thêm"} cancelText="Hủy" destroyOnClose width={700}>
        <Form form={form} layout="vertical" name="admissionLinkFormAdmin">
            <Form.Item name="year" label="Năm Tuyển Sinh" rules={[{ required: true, message: 'Vui lòng chọn năm!' }]} initialValue={currentYear}>
                <Select options={yearOptions} disabled={!!editingLink} />
            </Form.Item>
            <Form.Item name="university" label="Trường Đại Học" rules={[{ required: true, message: 'Vui lòng chọn trường!' }]}>
                <Select placeholder="Chọn trường" loading={universities.length === 0 && loadingModalData} showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} disabled={!!editingLink}>
                    {universities.map(uni => <Option key={uni.id} value={uni.id} label={`${uni.name} (${uni.code})`}>{uni.name} ({uni.code})</Option>)}
                </Select>
            </Form.Item>
            <Form.Item name="major" label="Ngành Học" rules={[{ required: true, message: 'Vui lòng chọn ngành!' }]}>
                <Select placeholder="Chọn ngành (chọn trường trước)" loading={loadingModalData && !!selectedUniversityInModal} disabled={!selectedUniversityInModal || majors.length === 0 || !!editingLink} showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>
                    {majors.map(major => <Option key={major.id} value={major.id} label={`${major.name} (${major.code})`}>{major.name} ({major.code})</Option>)}
                </Select>
            </Form.Item>
            <Form.Item name="admissionMethod" label="Phương Thức Xét Tuyển" rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}>
                <Select placeholder="Chọn phương thức" loading={admissionMethods.length === 0 && loadingModalData} showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} disabled={!!editingLink}>
                    {admissionMethods.map(method => <Option key={method.id} value={method.id} label={method.name}>{method.name} {method.code ? `(${method.code})` : ''}</Option>)}
                </Select>
            </Form.Item>
            <Form.Item name="subjectGroup" label="Tổ Hợp Môn" rules={[{ required: true, message: 'Vui lòng chọn tổ hợp!' }]}>
                <Select placeholder="Chọn tổ hợp môn" loading={subjectGroups.length === 0 && loadingModalData} showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} disabled={!!editingLink}>
                    {subjectGroups.map(group => <Option key={group.id} value={group.id} label={`${group.name} (${group.code}) - [${group.subjects.join(', ')}]`}>{group.name} ({group.code})</Option>)}
                </Select>
            </Form.Item>
            <Form.Item name="minScoreRequired" label="Điểm Sàn (nếu có)">
                <InputNumber style={{width: '100%'}} placeholder="Ví dụ: 18.5" step="0.01" min={0} max={40} />
            </Form.Item>
            <Form.Item name="isActive" label="Trạng thái" valuePropName="checked" initialValue={true}>
                <Switch checkedChildren="Hoạt động" unCheckedChildren="Ẩn" />
            </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
export default AdminManageAdmissionLinks;