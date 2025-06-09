import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Spin, Alert, Button, Descriptions, List, Tag, Space, Card } from 'antd';
import { ArrowLeftOutlined, FilePdfOutlined, FileImageOutlined, FileTextOutlined, InfoCircleOutlined } from '@ant-design/icons';
import applicationService, { ApplicationDetailBE } from '../services/applicationService';
import { UploadedFileResponse } from '../../upload/types';
import styles from './CandidateViewApplicationsPage.module.css'; // Reuse styles

const { Text } = Typography;

const getStatusTag = (status: ApplicationDetailBE['status']) => {
  let color = 'default';
  let text = status ? status.toUpperCase() : 'KHÔNG XÁC ĐỊNH';
  switch (status) {
    case 'approved': color = 'success'; text = 'ĐÃ DUYỆT'; break;
    case 'rejected': color = 'error'; text = 'BỊ TỪ CHỐI'; break;
    case 'pending': color = 'processing'; text = 'CHỜ XỬ LÝ'; break;
    case 'processing': color = 'warning'; text = 'ĐANG XỬ LÝ'; break;
    case 'additional_required': color = 'orange'; text = 'CẦN BỔ SUNG'; break;
    case 'cancelled': color = 'default'; text = 'ĐÃ HỦY'; break;
    default: color = 'default'; text = 'KHÔNG XÁC ĐỊNH'; break;
  }
  return <Tag color={color}>{text}</Tag>;
};

const getDocumentIcon = (fileName: string) => {
  const fileType = fileName.toLowerCase();
  if (fileType.includes('pdf')) return <FilePdfOutlined style={{ color: '#f56565' }} />;
  if (fileType.includes('jpg') || fileType.includes('jpeg') || fileType.includes('png')) return <FileImageOutlined style={{ color: '#48bb78' }} />;
  return <FileTextOutlined style={{ color: '#4299e1' }} />;
};

const CandidateApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<ApplicationDetailBE | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicationDetail = async () => {
      if (!id) {
        setError('ID hồ sơ không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await applicationService.getMyApplicationById(id);
        
        if (response.success && response.data) {
          setApplication(response.data);
        } else {
          setError(response.message || 'Không thể tải thông tin hồ sơ');
        }
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi khi tải thông tin hồ sơ');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetail();
  }, [id]);

  const handleGoBack = () => {
    navigate('/candidate/my-applications');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.applicationsContainer}>
        <Alert 
          message="Lỗi" 
          description={error} 
          type="error" 
          showIcon 
          action={
            <Space>
              <Button size="small" onClick={handleGoBack}>Quay lại</Button>
              <Button size="small" type="primary" onClick={() => window.location.reload()}>Thử lại</Button>
            </Space>
          }
        />
      </div>
    );
  }

  if (!application) {
    return (
      <div className={styles.applicationsContainer}>
        <Alert 
          message="Không tìm thấy hồ sơ" 
          description="Hồ sơ bạn đang tìm kiếm không tồn tại hoặc bạn không có quyền truy cập."
          type="warning" 
          showIcon 
          action={<Button size="small" onClick={handleGoBack}>Quay lại</Button>}
        />
      </div>
    );
  }

  return (
    <div className={styles.applicationsContainer}>
      <div style={{ marginBottom: 16 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleGoBack}
          className={styles.actionBtn}
        >
          Quay lại danh sách
        </Button>
      </div>

      <div className={styles.sectionTitle}>Chi Tiết Hồ Sơ Tuyển Sinh</div>
      
      <Card>
        <Descriptions 
          bordered 
          column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} 
          layout="vertical" 
          size="small"
        >
          <Descriptions.Item label="Mã Hồ Sơ" span={2} contentStyle={{ fontWeight: 'bold' }}>
            {application._id}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng Thái">
            {getStatusTag(application.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày Nộp">
            {new Date(application.submissionDate).toLocaleString('vi-VN')}
          </Descriptions.Item>

          <Descriptions.Item label="Thí Sinh" span={2} contentStyle={{ fontWeight: 'bold' }}>
            {application.candidateProfileSnapshot?.fullName || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày Sinh">
            {application.candidateProfileSnapshot?.dob 
              ? new Date(application.candidateProfileSnapshot.dob).toLocaleDateString('vi-VN') 
              : 'N/A'
            }
          </Descriptions.Item>
          <Descriptions.Item label="CCCD/CMND">
            {application.candidateProfileSnapshot?.idNumber || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Email Liên Hệ">
            {application.candidateProfileSnapshot?.email || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Số Điện Thoại">
            {application.candidateProfileSnapshot?.phoneNumber || 'N/A'}
          </Descriptions.Item>

          <Descriptions.Item label="Trường Đăng Ký" span={2}>
            {typeof application.university === 'object' 
              ? `${application.university.name} (${application.university.code})` 
              : 'N/A'
            }
          </Descriptions.Item>
          <Descriptions.Item label="Ngành Đăng Ký">
            {typeof application.major === 'object' 
              ? `${application.major.name} (${application.major.code})` 
              : 'N/A'
            }
          </Descriptions.Item>
          <Descriptions.Item label="Phương Thức XT">
            {typeof application.admissionMethod === 'object' 
              ? application.admissionMethod.name 
              : 'N/A'
            }
          </Descriptions.Item>

          {application.subjectGroup && typeof application.subjectGroup === 'object' && (
            <Descriptions.Item label="Tổ Hợp Môn">
              {`${application.subjectGroup.name} (${application.subjectGroup.code})`}
            </Descriptions.Item>
          )}

          {application.examScores && Object.keys(application.examScores).length > 0 && (
            <Descriptions.Item label="Điểm Thi Tổ Hợp" span={2}>
              <Space wrap>
                {Object.entries(application.examScores).map(([subject, score]) => (
                  <Tag color="blue" key={subject}>{subject}: {String(score)}</Tag>
                ))}
              </Space>
            </Descriptions.Item>
          )}

          <Descriptions.Item label="Minh Chứng Đính Kèm" span={2}>
            {application.documents && application.documents.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={application.documents}
                renderItem={(doc: UploadedFileResponse) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        href={doc.filePath ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}/${doc.filePath}` : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        key="download"                        icon={getDocumentIcon(doc.fileName || '')}
                        disabled={!doc.filePath}
                      >
                        Xem/Tải
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={getDocumentIcon(doc.fileName || '')}
                      title={<Text strong>{doc.originalName || 'Không rõ tên file'}</Text>}
                      description={`Loại: ${doc.documentType || 'Không rõ'} - ${doc.fileSize ? (doc.fileSize / (1024 * 1024)).toFixed(2) + ' MB' : 'Không rõ dung lượng'}`}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Text type="secondary">Không có minh chứng nào.</Text>
            )}
          </Descriptions.Item>

          {application.adminNotes && (
            <Descriptions.Item label="Ghi Chú Từ Ban Tuyển Sinh" span={2}>
              <Alert 
                message={application.adminNotes} 
                type="info" 
                icon={<InfoCircleOutlined />} 
              />
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </div>
  );
};

export default CandidateApplicationDetailPage;
