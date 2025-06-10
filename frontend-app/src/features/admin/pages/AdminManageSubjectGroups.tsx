import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Modal, Form, Input, Space, Tooltip, Popconfirm, message, Switch, Select, Tag, Card, Row, Col, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, BookOutlined, ExperimentOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import subjectGroupAdminService from '../services/subjectGroupAdminService';
import { SubjectGroupFE } from '../../subjectGroup/types';

const { Title, Paragraph } = Typography;
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
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20']
  });

  const fetchSubjectGroups = useCallback(async (page?: number, size?: number, search?: string) => {
    setLoading(true);
    try {
      const currentPage = page || pagination.current;
      const currentSize = size || pagination.pageSize;
      const currentSearch = search !== undefined ? search : searchText;
      
      const response = await subjectGroupAdminService.getAll({ 
        page: currentPage, 
        limit: currentSize, 
        search: currentSearch 
      });
      
      if (response.success && response.data && Array.isArray(response.data)) {
        const validData = response.data.filter(group => group && group.id);
        setSubjectGroups(validData);
        setPagination(prev => ({ 
          ...prev, 
          total: response.total || 0, 
          current: currentPage, 
          pageSize: currentSize 
        }));
      } else {
        setSubjectGroups([]);
        message.error(response.message || 'Không thể tải danh sách tổ hợp môn.');
      }
    } catch (error) {
      console.error('Error fetching subject groups:', error);
      setSubjectGroups([]);
      message.error('Lỗi khi tải dữ liệu tổ hợp môn.');
    } finally {
      setLoading(false);
    }
  }, [searchText, pagination.current, pagination.pageSize]);

  useEffect(() => {
    fetchSubjectGroups(1, pagination.pageSize, '');
  }, []);

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
        // Check if current page becomes empty after deletion
        const newTotal = Math.max(0, (pagination.total || 0) - 1);
        const maxPage = Math.ceil(newTotal / pagination.pageSize) || 1;
        const targetPage = pagination.current > maxPage ? maxPage : pagination.current;
        
        await fetchSubjectGroups(targetPage, pagination.pageSize, searchText);
      } else {
        message.error(response.message || 'Xóa tổ hợp môn thất bại.');
      }
    } catch (error) {
      console.error('Error deleting subject group:', error);
      message.error('Lỗi khi xóa tổ hợp môn.');
    } finally {
      setLoading(false);
    }
  };
  const handleModalOk = async () => {
    try {
      console.log('🔧 FORM_SUBMIT: Starting form validation...');
      const values = await form.validateFields();
      
      console.log('📝 FORM_SUBMIT: Raw form values:', {
        values,
        valuesType: typeof values,
        subjects: values.subjects,
        subjectsType: typeof values.subjects,
        subjectsIsArray: Array.isArray(values.subjects),
        subjectsLength: values.subjects?.length
      });

      // Đảm bảo subjects là mảng các string, không có giá trị rỗng hoặc trùng lặp
      const processedSubjects = Array.from(new Set(values.subjects.map(s => s.trim()).filter(s => s)));
      
      console.log('🧹 FORM_SUBMIT: Processed subjects:', {
        originalSubjects: values.subjects,
        processedSubjects,
        lengthBefore: values.subjects?.length,
        lengthAfter: processedSubjects.length
      });

      if (processedSubjects.length === 0) {
        console.warn('⚠️ FORM_SUBMIT: No subjects after processing');
        message.error('Tổ hợp môn phải có ít nhất một môn học.');
        return;
      }
      
      const dataToSubmit = { ...values, subjects: processedSubjects };
      console.log('📤 FORM_SUBMIT: Final data to submit:', {
        dataToSubmit,
        editingMode: !!editingSubjectGroup,
        editingId: editingSubjectGroup?.id
      });

      setLoading(true);
      let response;
      if (editingSubjectGroup) {
        console.log('📝 FORM_SUBMIT: Updating existing subject group...');
        response = await subjectGroupAdminService.update(editingSubjectGroup.id, dataToSubmit);
      } else {
        console.log('🆕 FORM_SUBMIT: Creating new subject group...');
        response = await subjectGroupAdminService.create(dataToSubmit);
      }

      console.log('📬 FORM_SUBMIT: Service response:', {
        response,
        success: response.success,
        message: response.message,
        data: response.data
      });

      if (response.success) {
        message.success(editingSubjectGroup ? 'Cập nhật tổ hợp môn thành công!' : 'Thêm tổ hợp môn mới thành công!');
        setIsModalVisible(false);
        // Refresh current page data
        await fetchSubjectGroups(pagination.current, pagination.pageSize, searchText);
      } else {
        console.error('❌ FORM_SUBMIT: Service returned error:', response.message);
        message.error(response.message || (editingSubjectGroup ? 'Cập nhật thất bại.' : 'Thêm mới thất bại.'));
      }
    } catch (info) {
      console.error('💥 FORM_SUBMIT: Exception caught:', {
        error: info,
        type: typeof info,
        message: info?.message,
        stack: info?.stack
      });
      message.error('Vui lòng kiểm tra lại thông tin đã nhập.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 })); // Reset to first page
    fetchSubjectGroups(1, pagination.pageSize, value);
  };

  const columns: TableProps<SubjectGroupFE>['columns'] = [
    {
      title: 'Tổ Hợp Môn',
      key: 'info',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar
            size={48}
            style={{
              backgroundColor: COLORS.primary,
              fontSize: '18px',
              fontWeight: 'bold'
            }}
            icon={<BookOutlined />}
          >
            {record.code}
          </Avatar>
          <div>
            <div style={{ 
              fontWeight: 600, 
              fontSize: '16px', 
              color: COLORS.dark,
              marginBottom: '4px'
            }}>
              {record.name}
            </div>
            <div style={{ 
              fontSize: '13px', 
              color: COLORS.textLight,
              fontWeight: 500,
              marginBottom: '6px'
            }}>
              Mã: {record.code}
            </div>
            <Space wrap size={[4, 4]}>
              {record.subjects.map(subject => (
                <Tag 
                  key={subject} 
                  style={{
                    backgroundColor: COLORS.blue50,
                    color: COLORS.blue500,
                    border: `1px solid ${COLORS.blue500}20`,
                    borderRadius: '6px',
                    fontSize: '11px',
                    padding: '2px 6px'
                  }}
                >
                  {subject}
                </Tag>
              ))}
            </Space>
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 130,
      align: 'center',
      render: (isActive: boolean) => (
        <Tag
          icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={isActive ? 'success' : 'error'}
          style={{
            borderRadius: '20px',
            padding: '4px 12px',
            fontWeight: 500,
            fontSize: '12px'
          }}
        >
          {isActive ? 'Hoạt động' : 'Ẩn'}
        </Tag>
      ),
      filters: [
        { text: 'Hoạt động', value: true },
        { text: 'Ẩn', value: false }
      ],
      onFilter: (value, record) => record.isActive === value,
    },    {
      title: 'Thao Tác',
      key: 'action',
      width: 140,
      align: 'center',
      render: (_, record) => (
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
            description="Bạn có chắc chắn muốn xóa tổ hợp môn này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ 
              danger: true,
              style: { backgroundColor: COLORS.danger }
            }}
          >
            <Tooltip title="Xóa">
              <Button
                danger
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
  ];

  return (
    <>
      <style>{`
        .modern-subject-groups-management {
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }
        
        .modern-subject-groups-management .ant-table-thead > tr > th {
          background: linear-gradient(135deg, ${COLORS.gray50} 0%, ${COLORS.gray100} 100%) !important;
          color: ${COLORS.text} !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          border: none !important;
          padding: 20px 16px !important;
        }
        
        .modern-subject-groups-management .ant-table-tbody > tr > td {
          padding: 20px 16px !important;
          border: none !important;
          border-bottom: 1px solid ${COLORS.gray100} !important;
        }
        
        .modern-subject-groups-management .ant-table-tbody > tr:hover > td {
          background: ${COLORS.blue50} !important;
        }
        
        .modern-subject-groups-management .ant-table {
          border-radius: 16px !important;
          overflow: hidden !important;
        }
        
        .modern-subject-groups-management .ant-input,
        .modern-subject-groups-management .ant-select-selector {
          border-radius: 12px !important;
          border-color: ${COLORS.gray200} !important;
          transition: all 0.3s ease !important;
        }
        
        .modern-subject-groups-management .ant-input:focus,
        .modern-subject-groups-management .ant-select-focused .ant-select-selector {
          border-color: ${COLORS.primary} !important;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1) !important;
        }
        
        .modern-subject-groups-management .ant-btn {
          border-radius: 12px !important;
          font-weight: 500 !important;
          transition: all 0.3s ease !important;
        }
        
        .modern-subject-groups-management .ant-btn:hover {
          transform: translateY(-1px) !important;
        }
        
        .modern-subject-groups-management .ant-modal-content {
          border-radius: 16px !important;
        }
        
        .modern-subject-groups-management .ant-modal-header {
          border-bottom: 1px solid ${COLORS.gray100} !important;
        }
        
        @media (max-width: 768px) {
          .modern-subject-groups-management .mobile-stack {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>
      
      <div className="modern-subject-groups-management" style={{ 
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
                icon={<ExperimentOutlined />} 
              />
              <div>
                <Title level={2} style={{ color: COLORS.white, margin: 0, fontSize: '32px', fontWeight: '700' }}>
                  Quản Lý Tổ Hợp Môn Xét Tuyển
                </Title>
                <Paragraph style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  margin: 0, 
                  fontSize: '16px',
                  marginTop: '8px'
                }}>
                  Quản lý các tổ hợp môn được sử dụng trong hệ thống xét tuyển đại học
                </Paragraph>
              </div>
            </div>
          </div>          {/* Filters and Actions */}
          <Row gutter={[24, 16]} style={{ marginBottom: '32px' }}>
            <Col xs={24} sm={12} md={10}>
              <Input.Search
                placeholder="Tìm kiếm theo tên hoặc mã tổ hợp môn..."
                onSearch={handleSearch}                enterButton={
                  <Button 
                    type="primary" 
                    icon={<SearchOutlined />}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      height: '42px',
                      fontWeight: 600,
                      color: '#ffffff'
                    }}
                  >
                    Tìm kiếm
                  </Button>
                }
                allowClear
                loading={loading && !!searchText}
                size="large"
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={12} md={14} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAdd}
                style={{
                  background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.green500} 100%)`,
                  border: 'none',
                  height: '42px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  boxShadow: `0 4px 12px ${COLORS.accent}30`,
                  minWidth: '160px'
                }}
              >
                Thêm Tổ Hợp
              </Button>
            </Col>
          </Row>

          {/* Table Section */}
          <Table 
            columns={columns} 
            dataSource={subjectGroups} 
            rowKey="id" 
            loading={loading}            pagination={{
              ...pagination,
              style: { marginTop: '32px' },
              showTotal: (total, range) => 
                `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} tổ hợp môn`,
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
                  backgroundColor: editingSubjectGroup ? COLORS.primary : COLORS.accent,
                }}
                icon={editingSubjectGroup ? <EditOutlined /> : <PlusOutlined />}
              />
              {editingSubjectGroup ? "Chỉnh Sửa Tổ Hợp Môn" : "Thêm Tổ Hợp Môn Mới"}
            </div>
          }
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          confirmLoading={loading}
          okText={editingSubjectGroup ? "Lưu thay đổi" : "Thêm mới"}
          cancelText="Hủy"
          destroyOnClose
          width={700}
          okButtonProps={{
            style: {
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
              border: 'none',
              height: '42px',
              borderRadius: '12px',
              fontWeight: 600,
              boxShadow: `0 4px 12px ${COLORS.primary}30`
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
            padding: '32px',
            borderRadius: '16px',
            margin: '24px 0'
          }}>
            <Form form={form} layout="vertical" name="subjectGroupFormAdmin">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item 
                    name="code" 
                    label={<span style={{ fontWeight: 600, color: COLORS.dark, fontSize: '15px' }}>Mã Tổ Hợp</span>}
                    rules={[{ required: true, message: 'Vui lòng nhập mã tổ hợp!' }]}
                  >
                    <Input 
                      placeholder="Ví dụ: A00, D07" 
                      style={{
                        height: '44px',
                        borderRadius: '12px',
                        border: `2px solid ${COLORS.gray200}`,
                        fontSize: '15px'
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item 
                    name="isActive" 
                    label={<span style={{ fontWeight: 600, color: COLORS.dark, fontSize: '15px' }}>Trạng thái</span>}
                    valuePropName="checked"
                  >
                    <Switch 
                      checkedChildren="Hoạt động" 
                      unCheckedChildren="Ẩn"
                      style={{
                        backgroundColor: COLORS.accent
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item 
                name="name" 
                label={<span style={{ fontWeight: 600, color: COLORS.dark, fontSize: '15px' }}>Tên Tổ Hợp</span>}
                rules={[{ required: true, message: 'Vui lòng nhập tên tổ hợp!' }]}
              >
                <Input 
                  placeholder="Ví dụ: Toán, Vật Lý, Hóa Học" 
                  style={{
                    height: '44px',
                    borderRadius: '12px',
                    border: `2px solid ${COLORS.gray200}`,
                    fontSize: '15px'
                  }}
                />
              </Form.Item>
              
              <Form.Item 
                name="subjects" 
                label={<span style={{ fontWeight: 600, color: COLORS.dark, fontSize: '15px' }}>Các Môn Học Trong Tổ Hợp</span>}
                rules={[{ required: true, type: 'array', min: 1, message: 'Vui lòng chọn ít nhất một môn học!' }]}
              >
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="Nhập tên môn học và nhấn Enter, hoặc chọn từ danh sách gợi ý"
                  tokenSeparators={[',']}
                  dropdownStyle={{
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
                  }}
                >
                  {COMMON_SUBJECTS.map(subject => (
                    <Option key={subject} value={subject}>
                      <div style={{ padding: '8px 0' }}>
                        {subject}
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default AdminManageSubjectGroups;