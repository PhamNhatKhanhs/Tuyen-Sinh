import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Table, Tag, Space, Button, Tooltip, Spin, Alert, Modal, Descriptions, List, message, Empty, Card } from 'antd'; // Thêm Card
import { EyeOutlined, ReloadOutlined, FilePdfOutlined, FileImageOutlined, FileTextOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import applicationService, { ApplicationListItemFE, ApplicationDetailBE } from '../services/applicationService';
import { UploadedFileResponse } from '../../upload/types'; 


const { Title, Paragraph, Text } = Typography;

const getStatusTag = (status: ApplicationListItemFE['status']) => {
  let color = 'default';
  let text = status ? status.toUpperCase() : 'KHÔNG XÁC ĐỊNH';
  switch (status) {
    case 'approved': color = 'success'; text = 'ĐÃ DUYỆT'; break;
    case 'pending': color = 'processing'; text = 'CHỜ DUYỆT'; break;
    case 'rejected': color = 'error'; text = 'TỪ CHỐI'; break;
    case 'processing': color = 'blue'; text = 'ĐANG XỬ LÝ'; break;
    case 'additional_required': color = 'warning'; text = 'CẦN BỔ SUNG'; break;
    case 'cancelled': color = 'default'; text = 'ĐÃ HỦY'; break;
  }
  return <Tag color={color} className="font-semibold">{text}</Tag>;
};

const getDocumentIcon = (fileType?: string) => { // Thêm optional chaining cho fileType
    if (fileType?.includes('pdf')) return <FilePdfOutlined className="text-red-500 text-xl" />;
    if (fileType?.includes('image')) return <FileImageOutlined className="text-blue-500 text-xl" />;
    return <FileTextOutlined className="text-gray-500 text-xl" />;
};


const CandidateViewApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationListItemFE[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedApplicationDetail, setSelectedApplicationDetail] = useState<ApplicationDetailBE | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchApplications = useCallback(async () => { // Sử dụng useCallback
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching applications...');
      const response = await applicationService.getMyApplications();
      console.log('API response:', response);
      
      if (response.success && response.data) {
        setApplications(response.data);
        console.log('Applications loaded successfully:', response.data);
      } else {
        const errorMsg = response.message || 'Không thể tải danh sách hồ sơ.';
        console.error('Error loading applications:', errorMsg);
        setError(errorMsg);
        message.error(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Đã xảy ra lỗi khi tải dữ liệu.';
      console.error('Exception when loading applications:', err);
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []); // Dependency rỗng vì hàm này không phụ thuộc vào props hay state nào thay đổi từ bên ngoài

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]); // Gọi fetchApplications

  const handleViewDetails = async (applicationId: string) => {
    setLoadingDetail(true);
    setSelectedApplicationDetail(null); 
    setIsDetailModalVisible(true);
    try {
        const response = await applicationService.getMyApplicationById(applicationId);
        if (response.success && response.data) {
            setSelectedApplicationDetail(response.data);
        } else {
            message.error(response.message || "Không thể tải chi tiết hồ sơ.");
            setIsDetailModalVisible(false); 
        }
    } catch (err: any) {
        message.error(err.message || "Lỗi khi tải chi tiết hồ sơ.");
        setIsDetailModalVisible(false); 
    } finally {
        setLoadingDetail(false);
    }
  };

  const columns: TableProps<ApplicationListItemFE>['columns'] = [
    { title: 'Mã Hồ Sơ', dataIndex: 'id', key: 'id', width: 180, render: (text) => <Text strong>{text}</Text> },
    { title: 'Trường Đăng Ký', dataIndex: 'universityName', key: 'universityName', render: (text, record) => `${text || 'N/A'} (${record.universityCode || 'N/A'})` },
    { title: 'Ngành Đăng Ký', dataIndex: 'majorName', key: 'majorName', render: (text, record) => `${text || 'N/A'} (${record.majorCode || 'N/A'})` },
    { title: 'Năm XT', dataIndex: 'year', key: 'year', width: 100, align: 'center' },
    { title: 'Ngày Nộp', dataIndex: 'submissionDate', key: 'submissionDate', width: 120, align: 'center' },
    { title: 'Trạng Thái', dataIndex: 'status', key: 'status', render: getStatusTag, width: 150, align: 'center' },
    {
      title: 'Hành Động',
      key: 'action',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_: any, record: ApplicationListItemFE) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button type="primary" shape="circle" icon={<EyeOutlined />} onClick={() => handleViewDetails(record.id)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading && applications.length === 0) {
      return (
          <div className="flex justify-center items-center min-h-[400px]">
              <Spin size="large" tip="Đang tải danh sách hồ sơ..." />
          </div>
      );
  }


  return (
    <Card title="Danh Sách Hồ Sơ Đã Nộp" className="shadow-lg rounded-lg" extra={<Button icon={<ReloadOutlined />} onClick={fetchApplications} loading={loading}>Tải lại</Button>}>
      <Paragraph className="text-gray-600 mb-6">
        Theo dõi trạng thái và quản lý các hồ sơ xét tuyển của bạn tại đây.
      </Paragraph>
      
      {error && !loading && <Alert message={error} type="error" showIcon className="mb-4" />}
      
      {!loading && applications.length === 0 && !error && (
          <Empty description="Bạn chưa có hồ sơ nào được nộp." image={Empty.PRESENTED_IMAGE_SIMPLE}>
              <Button type="primary" onClick={() => window.location.href = '/candidate/submit-application'}>Nộp hồ sơ ngay</Button>
          </Empty>
      )}

      {applications.length > 0 && (
        <Table 
            columns={columns} 
            dataSource={applications} 
            rowKey="id" 
            loading={loading}
            pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'], responsive: true }} 
            scroll={{ x: 1200 }}
            className="shadow rounded-lg overflow-hidden"
            bordered
        />
      )}

       <Modal
        title={<Title level={4} className="!m-0 text-indigo-700">Chi Tiết Hồ Sơ Tuyển Sinh</Title>}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={<Button type="primary" onClick={() => setIsDetailModalVisible(false)}>Đóng</Button>}
        width={900}
        destroyOnHidden
       >
        {loadingDetail && <div className="text-center py-8"><Spin size="large" tip="Đang tải chi tiết..." /></div>}
        {!loadingDetail && selectedApplicationDetail && (
            <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} layout="vertical" size="small">
                <Descriptions.Item label="Mã Hồ Sơ" span={2} contentStyle={{fontWeight: 'bold'}}>{selectedApplicationDetail._id}</Descriptions.Item>
                <Descriptions.Item label="Trạng Thái">{getStatusTag(selectedApplicationDetail.status)}</Descriptions.Item>
                <Descriptions.Item label="Ngày Nộp">{new Date(selectedApplicationDetail.submissionDate).toLocaleString('vi-VN')}</Descriptions.Item>
                
                <Descriptions.Item label="Thí Sinh" span={2} contentStyle={{fontWeight: 'bold'}}>{selectedApplicationDetail.candidateProfileSnapshot?.fullName || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Ngày Sinh">{selectedApplicationDetail.candidateProfileSnapshot?.dob ? new Date(selectedApplicationDetail.candidateProfileSnapshot.dob).toLocaleDateString('vi-VN') : 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="CCCD/CMND">{selectedApplicationDetail.candidateProfileSnapshot?.idNumber || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Email Liên Hệ">{selectedApplicationDetail.candidateProfileSnapshot?.email || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Số Điện Thoại">{selectedApplicationDetail.candidateProfileSnapshot?.phoneNumber || 'N/A'}</Descriptions.Item>
                
                <Descriptions.Item label="Trường Đăng Ký" span={2}>{typeof selectedApplicationDetail.university === 'object' ? `${selectedApplicationDetail.university.name} (${selectedApplicationDetail.university.code})` : 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Ngành Đăng Ký">{typeof selectedApplicationDetail.major === 'object' ? `${selectedApplicationDetail.major.name} (${selectedApplicationDetail.major.code})` : 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Phương Thức XT">{typeof selectedApplicationDetail.admissionMethod === 'object' ? selectedApplicationDetail.admissionMethod.name : 'N/A'}</Descriptions.Item>
                
                {selectedApplicationDetail.subjectGroup && typeof selectedApplicationDetail.subjectGroup === 'object' && (
                    <Descriptions.Item label="Tổ Hợp Môn">{`${selectedApplicationDetail.subjectGroup.name} (${selectedApplicationDetail.subjectGroup.code})`}</Descriptions.Item>
                )}

                {selectedApplicationDetail.examScores && Object.keys(selectedApplicationDetail.examScores).length > 0 && (
                    <Descriptions.Item label="Điểm Thi Tổ Hợp" span={2}>
                        <Space wrap>
                            {Object.entries(selectedApplicationDetail.examScores).map(([subject, score]) => (
                                <Tag color="blue" key={subject}>{subject}: {score}</Tag>
                            ))}
                        </Space>
                    </Descriptions.Item>
                )}

                <Descriptions.Item label="Minh Chứng Đính Kèm" span={2}>
                    {selectedApplicationDetail.documents && selectedApplicationDetail.documents.length > 0 ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={selectedApplicationDetail.documents}
                            renderItem={(doc: UploadedFileResponse) => (
                                <List.Item
                                    actions={[
                                        <Button 
                                            type="link" 
                                            href={doc.filePath ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api','')}/${doc.filePath}` : '#'} // Kiểm tra doc.filePath
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            key="download"
                                            icon={getDocumentIcon(doc.fileType || '')}
                                            disabled={!doc.filePath} // Vô hiệu hóa nếu không có filePath
                                        >
                                            Xem/Tải
                                        </Button>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={getDocumentIcon(doc.fileType || '')}
                                        title={<Text strong>{doc.originalName || 'Không rõ tên file'}</Text>}
                                        description={`Loại: ${doc.documentType || 'Không rõ'} - ${doc.fileSize ? (doc.fileSize / (1024*1024)).toFixed(2) + ' MB' : 'Không rõ dung lượng'}`}
                                    />
                                </List.Item>
                            )}
                        />
                    ) : <Text type="secondary">Không có minh chứng nào.</Text>}
                </Descriptions.Item>
                {selectedApplicationDetail.adminNotes && (
                    <Descriptions.Item label="Ghi Chú Từ Ban Tuyển Sinh" span={2}>
                        <Alert message={selectedApplicationDetail.adminNotes} type="info" icon={<InfoCircleOutlined />} />
                    </Descriptions.Item>
                )}
            </Descriptions>
        )}
       </Modal>
    </Card>
  );
};
export default CandidateViewApplicationsPage;