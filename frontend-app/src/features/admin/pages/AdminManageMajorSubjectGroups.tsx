import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Modal, Form, Select, Space, Tooltip, Popconfirm, message, Tag, Row, Col, Card, Avatar, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, LinkOutlined, BookOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import majorAdmissionSubjectGroupService from '../services/majorAdmissionSubjectGroupService';

const { Title, Paragraph } = Typography;
const { Option } = Select;

// Modern color palette
const COLORS = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  secondary: '#f1f5f9',
  accent: '#3b82f6',
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
  blue50: '#eff6ff',  blue500: '#3b82f6',
  green50: '#f0fdf4',
  green500: '#22c55e',
  orange50: '#fff7ed',
  orange500: '#f97316',
};

interface MajorSubjectGroupLinkFE {
  id: string;
  majorId: string;
  majorName: string;
  majorCode: string;
  universityName: string;
  admissionMethodId: string;
  admissionMethodName: string;
  subjectGroupId: string;
  subjectGroupCode: string;
  subjectGroupName: string;
  year: number;
  minScoreRequired?: number;
  isActive: boolean;
}

interface LinkFormData {
  majorId: string;
  admissionMethodId: string;
  subjectGroupId: string;
  year: number;
  minScoreRequired?: number;
  isActive: boolean;
}

const AdminManageMajorSubjectGroups: React.FC = () => {
  const [links, setLinks] = useState<MajorSubjectGroupLinkFE[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLink, setEditingLink] = useState<MajorSubjectGroupLinkFE | null>(null);
  const [form] = Form.useForm<LinkFormData>();
  
  // Options for select
  const [universities, setUniversities] = useState<{ id: string; name: string; code: string }[]>([]);
  const [majors, setMajors] = useState<{ id: string; name: string; code: string; universityId: string }[]>([]);
  const [admissionMethods, setAdmissionMethods] = useState<{ id: string; name: string; code: string }[]>([]);
  const [subjectGroups, setSubjectGroups] = useState<{ id: string; name: string; code: string; subjects: string[] }[]>([]);
  
  // Filters
  const [selectedUniversityId, setSelectedUniversityId] = useState<string | undefined>();
  const [selectedMajorId, setSelectedMajorId] = useState<string | undefined>();
  
  const [pagination, setPagination] = useState({
    current: 1, 
    pageSize: 10, 
    total: 0, 
    showSizeChanger: true, 
    pageSizeOptions: ['10', '20', '50']
  });

  const fetchLinks = useCallback(async (page?: number, size?: number) => {
    setLoading(true);
    try {
      const currentPage = page || pagination.current;
      const currentSize = size || pagination.pageSize;
      
      const params: any = { 
        page: currentPage, 
        limit: currentSize 
      };
      
      if (selectedUniversityId) params.universityId = selectedUniversityId;
      if (selectedMajorId) params.majorId = selectedMajorId;
      
      const response = await majorAdmissionSubjectGroupService.getAll(params);
      
      if (response.success && response.data && Array.isArray(response.data)) {
        setLinks(response.data);
        setPagination(prev => ({ 
          ...prev, 
          total: response.total || 0, 
          current: currentPage, 
          pageSize: currentSize 
        }));
      } else {
        console.error('Invalid response structure:', response);
        setLinks([]);
        message.error(response.message || 'Không thể tải danh sách liên kết.');
      }
    } catch (error) { 
      console.error('Error fetching links:', error);
      setLinks([]);
      message.error('Lỗi khi tải dữ liệu liên kết.'); 
    } 
    finally { setLoading(false); }
  }, [selectedUniversityId, selectedMajorId, pagination.current, pagination.pageSize]);

  const loadOptions = async () => {
    try {
      const [universityRes, admissionMethodRes, subjectGroupRes] = await Promise.all([
        majorAdmissionSubjectGroupService.getUniversities(),
        majorAdmissionSubjectGroupService.getAdmissionMethods(),
        majorAdmissionSubjectGroupService.getSubjectGroups()
      ]);
      
      if (universityRes.success && universityRes.data) {
        setUniversities(universityRes.data);
      }
      
      if (admissionMethodRes.success && admissionMethodRes.data) {
        setAdmissionMethods(admissionMethodRes.data);
      }
      
      if (subjectGroupRes.success && subjectGroupRes.data) {
        setSubjectGroups(subjectGroupRes.data);
      }
    } catch (error) {
      console.error('Error loading options:', error);
    }
  };

  const loadMajorsByUniversity = async (universityId: string) => {
    try {
      const response = await majorAdmissionSubjectGroupService.getMajorsByUniversity(universityId);
      if (response.success && response.data) {
        setMajors(response.data);
      }
    } catch (error) {
      console.error('Error loading majors:', error);
    }
  };

  useEffect(() => {
    fetchLinks(1, pagination.pageSize);
    loadOptions();
  }, []);

  useEffect(() => {
    fetchLinks(1, pagination.pageSize);
  }, [selectedUniversityId, selectedMajorId]);

  const handleTableChange: TableProps<MajorSubjectGroupLinkFE>['onChange'] = (newPagination) => {
    fetchLinks(newPagination.current, newPagination.pageSize);
  };

  const handleAdd = () => {
    setEditingLink(null);
    form.resetFields();
    form.setFieldsValue({ 
      isActive: true, 
      year: new Date().getFullYear(),
      minScoreRequired: 0 
    });
    setIsModalVisible(true);
  };

  const handleEdit = (record: MajorSubjectGroupLinkFE) => {
    setEditingLink(record);
    form.setFieldsValue({
      majorId: record.majorId,
      admissionMethodId: record.admissionMethodId,
      subjectGroupId: record.subjectGroupId,
      year: record.year,
      minScoreRequired: record.minScoreRequired,
      isActive: record.isActive
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await majorAdmissionSubjectGroupService.delete(id);
      
      if (response.success) {
        message.success('Xóa liên kết thành công!');
        await fetchLinks(pagination.current, pagination.pageSize);
      } else { 
        message.error(response.message || 'Xóa liên kết thất bại.'); 
      }
    } catch (error) { 
      console.error('Delete error:', error);
      message.error('Lỗi khi xóa liên kết.'); 
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      let response;
      if (editingLink) {
        response = await majorAdmissionSubjectGroupService.update(editingLink.id, values);
      } else {
        response = await majorAdmissionSubjectGroupService.create(values);
      }

      if (response.success) {
        message.success(editingLink ? 'Cập nhật liên kết thành công!' : 'Thêm liên kết thành công!');
        setIsModalVisible(false);
        await fetchLinks(pagination.current, pagination.pageSize);
      } else { 
        message.error(response.message || (editingLink ? 'Cập nhật thất bại.' : 'Thêm mới thất bại.')); 
      }
    } catch (info) { 
      console.log('Validate Failed:', info); 
      message.error('Vui lòng kiểm tra lại thông tin.'); 
    } 
    finally { 
      setLoading(false); 
    }
  };

  const handleUniversityChange = (universityId: string) => {
    setSelectedUniversityId(universityId);
    setSelectedMajorId(undefined);
    if (universityId) {
      loadMajorsByUniversity(universityId);
    } else {
      setMajors([]);
    }
  };

  const handleFormUniversityChange = (universityId: string) => {
    form.setFieldsValue({ majorId: undefined });
    if (universityId) {
      loadMajorsByUniversity(universityId);
    }
  };
  const columns: TableProps<MajorSubjectGroupLinkFE>['columns'] = [
    {
      title: 'Ngành Học',
      key: 'major',
      render: (_: any, record: MajorSubjectGroupLinkFE) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar
            size={48}
            style={{
              backgroundColor: COLORS.primary,
              color: COLORS.white,
              fontSize: '18px',
              fontWeight: 'bold'
            }}
            icon={<BookOutlined />}
          />
          <div>
            <div style={{ 
              fontWeight: '600', 
              fontSize: '16px', 
              color: COLORS.dark,
              marginBottom: '4px'
            }}>
              {record.majorName}
            </div>
            <div style={{ 
              fontSize: '13px', 
              color: COLORS.textLight,
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Tag 
                style={{
                  backgroundColor: COLORS.blue50,
                  color: COLORS.blue500,
                  border: `1px solid ${COLORS.blue500}20`,
                  borderRadius: '6px',
                  fontSize: '11px',
                  padding: '2px 6px',
                  margin: 0
                }}
              >
                {record.majorCode}
              </Tag>
              <span style={{ fontWeight: '500' }}>{record.universityName}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Phương Thức',
      dataIndex: 'admissionMethodName',
      key: 'admissionMethodName',
      width: 180,
      render: (text: string) => (
        <Tag 
          style={{
            backgroundColor: COLORS.green50,
            color: COLORS.green500,
            border: `1px solid ${COLORS.green500}30`,
            borderRadius: '8px',
            padding: '4px 12px',
            fontWeight: '500',
            fontSize: '12px'
          }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: 'Tổ Hợp Môn',
      key: 'subjectGroup',
      width: 150,
      render: (_: any, record: MajorSubjectGroupLinkFE) => (
        <div>
          <div style={{ 
            fontWeight: '600', 
            color: COLORS.text,
            fontSize: '14px',
            marginBottom: '2px'
          }}>
            {record.subjectGroupCode}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: COLORS.textLight,
            fontWeight: '500'
          }}>
            {record.subjectGroupName}
          </div>
        </div>
      ),
    },
    {
      title: 'Điểm Tối Thiểu',
      dataIndex: 'minScoreRequired',
      key: 'minScoreRequired',
      align: 'center',
      width: 130,
      render: (score: number) => (
        <div style={{
          background: COLORS.orange500 + '20',
          color: COLORS.orange500,
          padding: '6px 12px',
          borderRadius: '12px',
          fontWeight: '600',
          fontSize: '13px',
          textAlign: 'center',
          minWidth: '50px'
        }}>
          {score || 0}
        </div>
      ),
    },
    {
      title: 'Năm',
      dataIndex: 'year',
      key: 'year',
      align: 'center',
      width: 80,
      render: (year: number) => (
        <Tag 
          style={{
            backgroundColor: COLORS.purple50,
            color: COLORS.purple500,
            border: `1px solid ${COLORS.purple500}20`,
            borderRadius: '6px',
            fontWeight: '600'
          }}
        >
          {year}
        </Tag>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'isActive',
      key: 'isActive',
      align: 'center',
      width: 120,
      render: (isActive: boolean) => (
        <Tag
          icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={isActive ? 'success' : 'error'}
          style={{
            borderRadius: '12px',
            padding: '4px 12px',
            fontWeight: '600',
            fontSize: '12px',
          }}
        >
          {isActive ? 'Hoạt Động' : 'Ẩn'}
        </Tag>
      ),
    },
    {
      title: 'Hành Động',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_: any, record: MajorSubjectGroupLinkFE) => (
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
                boxShadow: `0 2px 4px ${COLORS.primary}30`,
                width: '36px',
                height: '36px',
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa liên kết này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined style={{ color: '#ffffff' }} />}
                style={{
                  backgroundColor: COLORS.danger,
                  borderColor: COLORS.danger,
                  boxShadow: `0 2px 4px ${COLORS.danger}30`,
                  width: '36px',
                  height: '36px',
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
        .modern-link-management {
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }
        
        .modern-link-management .ant-table-thead > tr > th {
          background: linear-gradient(135deg, ${COLORS.gray50} 0%, ${COLORS.gray100} 100%) !important;
          color: ${COLORS.text} !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          border: none !important;
          padding: 16px 12px !important;
        }
        
        .modern-link-management .ant-table-tbody > tr > td {
          padding: 16px 12px !important;
          border: none !important;
          border-bottom: 1px solid ${COLORS.gray100} !important;
        }
        
        .modern-link-management .ant-table-tbody > tr:hover > td {
          background: ${COLORS.blue50} !important;
        }
          .modern-link-management .ant-table {
          border-radius: 16px !important;
          overflow: hidden !important;
        }
        
        .modern-link-management .ant-input,
        .modern-link-management .ant-select-selector {
          border-radius: 12px !important;
          border-color: ${COLORS.gray200} !important;
          transition: all 0.3s ease !important;
        }
        
        .modern-link-management .red-border-select .ant-select-selector {
          border-color: #ef4444 !important;
          border-width: 2px !important;
        }
        
        .modern-link-management .ant-input:focus,
        .modern-link-management .ant-select-focused .ant-select-selector {
          border-color: ${COLORS.primary} !important;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1) !important;
        }
        
        .modern-link-management .ant-btn {
          border-radius: 12px !important;
          font-weight: 500 !important;
          transition: all 0.3s ease !important;
        }
        
        .modern-link-management .ant-btn:hover {
          transform: translateY(-1px) !important;
        }
        
        .modern-link-management .ant-modal-content {
          border-radius: 16px !important;
        }
        
        .modern-link-management .ant-modal-header {
          border-bottom: 1px solid ${COLORS.gray100} !important;
          background: linear-gradient(135deg, ${COLORS.gray50} 0%, ${COLORS.gray100} 100%) !important;
        }
      `}</style>
      
      <div className="modern-link-management" style={{ 
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
        >          {/* Header Section */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.accent} 0%, #2563eb 100%)`,
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
                icon={<LinkOutlined />} 
              />
              <div>
                <Title level={2} style={{ color: COLORS.white, margin: 0, fontSize: '32px', fontWeight: '700' }}>
                  Quản Lý Ngành - Tổ Hợp Môn
                </Title>
                <Paragraph style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  margin: 0, 
                  fontSize: '16px',
                  marginTop: '8px'
                }}>
                  Cấu hình tổ hợp môn cho từng ngành và phương thức tuyển sinh
                </Paragraph>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <Row gutter={[24, 16]} style={{ marginBottom: '32px' }}>
            <Col xs={24} sm={8}>
              <Select
                placeholder="Chọn trường đại học"
                style={{ width: '100%', height: '48px' }}
                allowClear
                value={selectedUniversityId}
                onChange={handleUniversityChange}
                showSearch
                filterOption={(input, option) =>
                  (option?.children?.toString().toLowerCase() ?? '').includes(input.toLowerCase())
                }
              >
                {universities.map(university => (
                  <Option key={university.id} value={university.id}>
                    {university.name} ({university.code})
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <Select
                placeholder="Chọn ngành học"
                style={{ width: '100%', height: '48px' }}
                allowClear
                value={selectedMajorId}
                onChange={setSelectedMajorId}
                disabled={!selectedUniversityId}
                showSearch
                filterOption={(input, option) =>
                  (option?.children?.toString().toLowerCase() ?? '').includes(input.toLowerCase())
                }
              >
                {majors.map(major => (
                  <Option key={major.id} value={major.id}>
                    {major.name} ({major.code})
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setSelectedUniversityId(undefined);
                    setSelectedMajorId(undefined);
                    fetchLinks(1, pagination.pageSize);
                  }}
                  loading={loading}
                  size="large"
                  style={{
                    borderRadius: '12px',
                    height: '48px',
                  }}
                >
                  Tải lại
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                  size="large"                  style={{
                    background: `linear-gradient(135deg, ${COLORS.accent} 0%, #2563eb 100%)`,
                    borderColor: COLORS.accent,
                    borderRadius: '12px',
                    height: '48px',
                    fontWeight: '600',
                  }}
                >
                  Thêm Liên Kết
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
              dataSource={links}
              rowKey="id"
              loading={loading}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} liên kết`,
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
                <LinkOutlined style={{ color: COLORS.accent }} />
                {editingLink ? "Chỉnh Sửa Liên Kết" : "Thêm Liên Kết Mới"}
              </div>
            }
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={() => setIsModalVisible(false)}
            confirmLoading={loading}
            okText={editingLink ? "Cập Nhật" : "Thêm Mới"}
            cancelText="Hủy"
            destroyOnClose
            width={800}            okButtonProps={{
              style: {
                background: `linear-gradient(135deg, ${COLORS.accent} 0%, #2563eb 100%)`,
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
              name="linkFormAdmin"
              style={{ marginTop: '24px' }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="universitySelect"
                    label={<span style={{ fontWeight: '600', color: COLORS.text }}>Trường Đại Học</span>}
                  >
                    <Select 
                      size="large" 
                      placeholder="Chọn trường đại học"
                      onChange={handleFormUniversityChange}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.children?.toString().toLowerCase() ?? '').includes(input.toLowerCase())
                      }
                    >
                      {universities.map(university => (
                        <Option key={university.id} value={university.id}>
                          {university.name} ({university.code})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="majorId"
                    label={<span style={{ fontWeight: '600', color: COLORS.text }}>Ngành Học</span>}
                    rules={[{ required: true, message: 'Vui lòng chọn ngành học!' }]}
                  >
                    <Select 
                      size="large" 
                      placeholder="Chọn ngành học"
                      showSearch
                      filterOption={(input, option) =>
                        (option?.children?.toString().toLowerCase() ?? '').includes(input.toLowerCase())
                      }
                    >
                      {majors.map(major => (
                        <Option key={major.id} value={major.id}>
                          {major.name} ({major.code})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="admissionMethodId"
                    label={<span style={{ fontWeight: '600', color: COLORS.text }}>Phương Thức Tuyển Sinh</span>}
                    rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}
                  >
                    <Select size="large" placeholder="Chọn phương thức">
                      {admissionMethods.map(method => (
                        <Option key={method.id} value={method.id}>
                          {method.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="subjectGroupId"
                    label={<span style={{ fontWeight: '600', color: COLORS.text }}>Tổ Hợp Môn</span>}
                    rules={[{ required: true, message: 'Vui lòng chọn tổ hợp môn!' }]}
                  >
                    <Select size="large" placeholder="Chọn tổ hợp môn">
                      {subjectGroups.map(group => (
                        <Option key={group.id} value={group.id}>
                          {group.code} - {group.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="year"
                    label={<span style={{ fontWeight: '600', color: COLORS.text }}>Năm Tuyển Sinh</span>}
                    rules={[{ required: true, message: 'Vui lòng nhập năm!' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      size="large"
                      min={2020}
                      max={2030}
                      placeholder="Năm"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="minScoreRequired"
                    label={<span style={{ fontWeight: '600', color: COLORS.text }}>Điểm Tối Thiểu</span>}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      size="large"
                      min={0}
                      max={30}
                      step={0.1}
                      placeholder="Điểm"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="isActive"
                    label={<span style={{ fontWeight: '600', color: COLORS.text }}>Trạng Thái</span>}
                    valuePropName="checked"
                  >
                    <Select size="large" placeholder="Chọn trạng thái">
                      <Option value={true}>Hoạt Động</Option>
                      <Option value={false}>Ẩn</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </Card>
      </div>
    </>
  );
};

export default AdminManageMajorSubjectGroups;
