import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography, Form, Input, Button, Select, DatePicker, Upload, Alert, Steps, Card, Row, Col, Spin, message, InputNumber, Modal
} from 'antd';
import {
  InboxOutlined, UserOutlined, IdcardOutlined, BookOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined,
  BankOutlined, SolutionOutlined, UploadOutlined, GlobalOutlined, TeamOutlined
} from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import styles from './CandidateSubmitApplicationPage.module.css';

// Import services và types
import universityService from '../../university/services/universityService';
import majorService from '../../major/services/majorService';
import admissionLinkService from '../../admissionLink/services/admissionLinkService';
import uploadService from '../../upload/services/uploadService';
import applicationService from '../services/applicationService';


import { UniversityFE } from '../../university/types';
import { MajorFE } from '../../major/types';
import { AdmissionMethodFE } from '../../admissionMethod/types';
import { SubjectGroupFE } from '../../subjectGroup/types';
import { UploadedFileResponse } from '../../upload/types';
import { useAppDispatch } from '../../../store/hooks';


const { Title: AntTitle, Paragraph: AntParagraph, Text: AntText } = Typography;
const { Option: AntOption } = Select;
const { Step: AntStep } = Steps;

interface PersonalInfo {
  fullName?: string; dob?: any; gender?: 'male' | 'female' | 'other'; idNumber?: string; idIssueDate?: any;
  idIssuePlace?: string; ethnic?: string; nationality?: string; permanentAddress?: string; 
  contactAddress?: string; phoneNumber?: string; email?: string; priorityArea?: string; priorityObject?: string[];
}
interface AcademicInfo {
  highSchoolName?: string; graduationYear?: string; gpa10?: number; gpa11?: number; gpa12?: number;
  conduct10?: string; conduct11?: string; conduct12?: string;
  examScores?: { [subjectName: string]: number | undefined };
}
interface ApplicationChoice { 
  universityId?: string; 
  majorId?: string; 
  admissionMethodId?: string; 
  subjectGroupId?: string; 
  year?: number; 
}
interface FullApplicationData {
  personalInfo?: PersonalInfo; 
  academicInfo?: AcademicInfo; 
  applicationChoice?: ApplicationChoice; 
  documentIds?: string[];
  currentDocumentType?: string; 
}

const currentAcademicYear = new Date().getFullYear();
const initialFormData: FullApplicationData = {
    personalInfo: { nationality: 'Việt Nam' },
    academicInfo: { examScores: {} },
    applicationChoice: { year: currentAcademicYear },
    currentDocumentType: 'hoc_ba',
};

const priorityAreas = [
    { value: 'KV1', label: 'Khu vực 1 (KV1)' }, { value: 'KV2', label: 'Khu vực 2 (KV2)' },
    { value: 'KV2-NT', label: 'Khu vực 2 - Nông thôn (KV2-NT)' }, { value: 'KV3', label: 'Khu vực 3 (KV3)' },
];
const priorityObjects = [
    { value: 'UT1', label: 'Đối tượng 01' }, { value: 'UT2', label: 'Đối tượng 02' },
    { value: 'UT3', label: 'Đối tượng 03' }, { value: 'UT4', label: 'Đối tượng 04' },
];
const highSchoolGraduationYears = Array.from({ length: 10 }, (_, i) => currentAcademicYear - i).map(String);
const admissionYears = Array.from({ length: 3 }, (_, i) => currentAcademicYear + i -1 ).map(year => ({ label: year.toString(), value: year }));


const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

function convertInitialValues(data: FullApplicationData): FullApplicationData {
  return {
    ...data,
    personalInfo: {
      ...data.personalInfo,
      dob: data.personalInfo?.dob ? dayjs(data.personalInfo.dob) : undefined,
      idIssueDate: data.personalInfo?.idIssueDate ? dayjs(data.personalInfo.idIssueDate) : undefined,
    }
  };
}

const CandidateSubmitApplicationPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm<FullApplicationData>();
    const dispatch = useAppDispatch();

    const [allStepsData, setAllStepsData] = useState<FullApplicationData>(JSON.parse(JSON.stringify(initialFormData))); // Deep copy

    const [universities, setUniversities] = useState<UniversityFE[]>([]);
    const [majors, setMajors] = useState<MajorFE[]>([]);
    const [admissionMethods, setAdmissionMethods] = useState<AdmissionMethodFE[]>([]);
    const [subjectGroups, setSubjectGroups] = useState<SubjectGroupFE[]>([]);
    const [currentSubjectsForScores, setCurrentSubjectsForScores] = useState<string[]>([]);

    const [loadingUniversities, setLoadingUniversities] = useState(false);
    const [loadingMajors, setLoadingMajors] = useState(false);
    const [loadingAdmissionInfo, setLoadingAdmissionInfo] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const watchedUniversityId = Form.useWatch(['applicationChoice', 'universityId'], form);
    const watchedMajorId = Form.useWatch(['applicationChoice', 'majorId'], form);
    const watchedAdmissionMethodId = Form.useWatch(['applicationChoice', 'admissionMethodId'], form);
    const watchedSubjectGroupId = Form.useWatch(['applicationChoice', 'subjectGroupId'], form);
    const watchedYear = Form.useWatch(['applicationChoice', 'year'], form);


    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploadedDocumentInfos, setUploadedDocumentInfos] = useState<UploadedFileResponse[]>([]);

    const [previewImage, setPreviewImage] = useState('');
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewTitle, setPreviewTitle] = useState('');

    useEffect(() => { 
        const fetchUniversities = async () => {
            setLoadingUniversities(true);
            const response = await universityService.getAll({limit: 1000}); 
            if (response.success && response.data) {
                setUniversities(response.data);
            } else {
                message.error(response.message || "Lỗi tải danh sách trường.");
            }
            setLoadingUniversities(false);
        };
        fetchUniversities();
    }, []);

    const handleFormValuesChange = useCallback((changedValues: any, allValues: FullApplicationData) => {
        if (currentStep === 0 && changedValues.personalInfo) {
            setAllStepsData(prev => ({...prev, personalInfo: {...prev.personalInfo, ...changedValues.personalInfo}}));
        } else if (currentStep === 1) {
            if (changedValues.academicInfo) {
                 setAllStepsData(prev => ({...prev, academicInfo: {...prev.academicInfo, ...changedValues.academicInfo}}));
            }
            if (changedValues.applicationChoice) {
                 setAllStepsData(prev => ({...prev, applicationChoice: {...prev.applicationChoice, ...changedValues.applicationChoice}}));
            }
        }
    }, [currentStep]);


    useEffect(() => {
        setMajors([]); setAdmissionMethods([]); setSubjectGroups([]); setCurrentSubjectsForScores([]);
        const prevApplicationChoice = allStepsData.applicationChoice || { year: currentAcademicYear };
        const prevAcademicInfo = allStepsData.academicInfo || { examScores: {} };
        
        const newApplicationChoice = { 
            ...prevApplicationChoice, 
            universityId: watchedUniversityId, // Cập nhật universityId từ watched value
            majorId: undefined, 
            admissionMethodId: undefined, 
            subjectGroupId: undefined, 
        };
        const newAcademicInfo = { ...prevAcademicInfo, examScores: {} };
        
        setAllStepsData(prev => ({ ...prev, applicationChoice: newApplicationChoice, academicInfo: newAcademicInfo }));
        form.setFieldsValue({ applicationChoice: newApplicationChoice, academicInfo: newAcademicInfo });

        if (watchedUniversityId) {
            setLoadingMajors(true);
            majorService.getByUniversityId(watchedUniversityId)
                .then(response => {
                    if (response.success && response.data) setMajors(response.data);
                    else message.error(response.message || "Lỗi tải danh sách ngành.");
                })
                .finally(() => setLoadingMajors(false));
        }
    }, [watchedUniversityId, form]); // Bỏ allStepsData khỏi dep để tránh vòng lặp

    useEffect(() => {
        setAdmissionMethods([]); setSubjectGroups([]); setCurrentSubjectsForScores([]);
        const prevApplicationChoice = allStepsData.applicationChoice || {};
        const prevAcademicInfo = allStepsData.academicInfo || { examScores: {} };
        const newApplicationChoice = { ...prevApplicationChoice, admissionMethodId: undefined, subjectGroupId: undefined };
        const newAcademicInfo = { ...prevAcademicInfo, examScores: {} };

        setAllStepsData(prev => ({ ...prev, applicationChoice: newApplicationChoice, academicInfo: newAcademicInfo }));
        form.setFieldsValue({ applicationChoice: newApplicationChoice, academicInfo: newAcademicInfo });

        const currentSelectedYear = watchedYear || newApplicationChoice.year || currentAcademicYear;
        if (watchedMajorId && currentSelectedYear) {
            setLoadingAdmissionInfo(true);
            admissionLinkService.getLinks({ majorId: watchedMajorId, year: currentSelectedYear })
                .then(response => {
                    if (response.success && response.data) {
                        const uniqueMethods = Array.from(new Map(response.data
                            .filter(link => link.admissionMethodId)
                            .map(link => [link.admissionMethodId, { id: link.admissionMethodId, name: link.admissionMethodName }])
                        ).values())
                        .filter(method => method.id !== 'N/A_METHOD' && method.id !== 'N/A_UNKNOWN_METHOD');
                        setAdmissionMethods(uniqueMethods);
                    } else { message.error(response.message || "Lỗi tải thông tin tuyển sinh."); }
                })
                .finally(() => setLoadingAdmissionInfo(false));
        }
    }, [watchedMajorId, watchedYear, form]); // Bỏ allStepsData

    useEffect(() => {
        setSubjectGroups([]); setCurrentSubjectsForScores([]);
        const prevApplicationChoice = allStepsData.applicationChoice || {};
        const prevAcademicInfo = allStepsData.academicInfo || { examScores: {} };
        const newApplicationChoice = { ...prevApplicationChoice, subjectGroupId: undefined };
        const newAcademicInfo = { ...prevAcademicInfo, examScores: {} };

        setAllStepsData(prev => ({ ...prev, applicationChoice: newApplicationChoice, academicInfo: newAcademicInfo }));
        form.setFieldsValue({ applicationChoice: newApplicationChoice, academicInfo: newAcademicInfo });
        
        const currentSelectedYear = watchedYear || newApplicationChoice.year || currentAcademicYear;
        if (watchedMajorId && watchedAdmissionMethodId && currentSelectedYear) {
            setLoadingAdmissionInfo(true);
            admissionLinkService.getLinks({ majorId: watchedMajorId, admissionMethodId: watchedAdmissionMethodId, year: currentSelectedYear })
                .then(response => {
                    if (response.success && response.data) {
                        const uniqueGroups = Array.from(new Map(response.data
                            .filter(link => typeof link.subjectGroupId === 'string')
                            .map(link => [link.subjectGroupId, { id: link.subjectGroupId, name: link.subjectGroupName, code: link.subjectGroupCode || '', subjects: [] }])
                        ).values())
                        .filter(group => group.id !== 'N/A_GROUP_OR_NONE' && group.id !== 'N/A_UNKNOWN_GROUP');
                        setSubjectGroups(uniqueGroups);
                    } else { message.error(response.message || "Lỗi tải tổ hợp môn."); }
                })
                .finally(() => setLoadingAdmissionInfo(false));
        }
    }, [watchedAdmissionMethodId, watchedMajorId, watchedYear, form]); // Bỏ allStepsData
    
    useEffect(() => { 
        const currentAcademicData = allStepsData.academicInfo || { examScores: {} };
        if (watchedSubjectGroupId) {
            const group = subjectGroups.find(g => g.id === watchedSubjectGroupId);
            const newSubjects = group?.subjects || [];
            setCurrentSubjectsForScores(newSubjects);
            const initialScores: { [subjectName: string]: number | undefined } = {};
            // Giữ lại điểm đã nhập nếu môn đó vẫn còn trong tổ hợp mới
            newSubjects.forEach(sub => {
                initialScores[sub] = currentAcademicData.examScores?.[sub];
            });
            
            const updatedAcademicInfo = { ...currentAcademicData, examScores: initialScores };
            setAllStepsData(prev => ({...prev, academicInfo: updatedAcademicInfo }));
            form.setFieldsValue({ academicInfo: updatedAcademicInfo });
        } else {
            setCurrentSubjectsForScores([]);
            const updatedAcademicInfo = { ...currentAcademicData, examScores: {} };
            setAllStepsData(prev => ({...prev, academicInfo: updatedAcademicInfo }));
            form.setFieldsValue({ academicInfo: updatedAcademicInfo });
        }
    }, [watchedSubjectGroupId, subjectGroups, form, allStepsData.academicInfo]);

    // Sync form fields with allStepsData when it changes
    useEffect(() => {
        form.setFieldsValue(convertInitialValues(allStepsData));
    }, [allStepsData, form]);

    const handleFileUploadChange: UploadProps['onChange'] = (info) => { setFileList(info.fileList); };
    const customUploadRequest: UploadProps['customRequest'] = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;
        const documentType = form.getFieldValue('currentDocumentType') || 'hoc_ba';
        
        try {
            const response = await uploadService.uploadDocument(file as File, documentType);
            if (response.success && response.data) {
                // Lưu thông tin file đã upload thành công cùng với uid
                const fileData = {
                    ...response.data,
                    uid: file.uid // Lưu uid của file để dễ dàng tìm kiếm sau này
                };
                
                // Cập nhật state với thông tin mới
                setUploadedDocumentInfos(prev => [...prev, fileData]);
                
                // Gọi callback onSuccess
                onSuccess?.(response, file as File);
                message.success(`Tải lên ${file.name} thành công!`);
            } else {
                onError?.(new Error(response.message || 'Tải lên thất bại'), file as File);
                message.error(response.message || 'Tải lên thất bại');
            }
        } catch (error: any) {
            onError?.(error, file as File);
            message.error(error.message || 'Đã xảy ra lỗi khi tải lên file');
        }
    };
    
    const handleRemoveFile = (file: UploadFile) => {
        // Xóa file khỏi danh sách đã upload
        const uid = (file as UploadFile).uid;
        // Lọc ra các file không có uid trùng với file bị xóa
        setUploadedDocumentInfos(prev => prev.filter(doc => (doc as any).uid !== uid));
        return true;
    };
    
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64((file as UploadFile).originFileObj as RcFile);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewVisible(true);
        setPreviewTitle((file as UploadFile).name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };
    
    const beforeUpload = (file: RcFile) => {
        const isJpgOrPngOrPdf = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
        if (!isJpgOrPngOrPdf) {
            message.error('Chỉ hỗ trợ tải lên file JPG, PNG hoặc PDF!');
            return Upload.LIST_IGNORE;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('File phải nhỏ hơn 5MB!');
            return Upload.LIST_IGNORE;
        }
        return true;
    };
    
    const onFinish = async () => { 
        console.log('Submitting with allStepsData:', JSON.parse(JSON.stringify(allStepsData)));
        setIsSubmitting(true);
        try {
            const personalInfoToSubmit = allStepsData.personalInfo || {};
            const academicInfoToSubmit = allStepsData.academicInfo || { examScores: {} };
            const applicationChoiceToSubmit = allStepsData.applicationChoice || {};

            if (!personalInfoToSubmit.fullName /* || các trường bắt buộc khác của personalInfo */) {
                 message.error('Thông tin cá nhân (Bước 1) chưa đầy đủ. Vui lòng quay lại kiểm tra.');
                 setIsSubmitting(false); return;
            }
            if (!applicationChoiceToSubmit.universityId || !applicationChoiceToSubmit.majorId || !applicationChoiceToSubmit.admissionMethodId || !applicationChoiceToSubmit.year) {
                 message.error('Thông tin nguyện vọng (Bước 2) chưa đầy đủ. Vui lòng quay lại kiểm tra.');
                 setIsSubmitting(false); return;
            }
            if (!academicInfoToSubmit.highSchoolName /* || các trường bắt buộc khác của academicInfo */ ) {
                message.error('Thông tin học vấn (Bước 2) chưa đầy đủ. Vui lòng quay lại kiểm tra.');
                setIsSubmitting(false); return;
            }

            const applicationDataToSubmit = {
                personalInfo: personalInfoToSubmit,
                academicInfo: academicInfoToSubmit,
                applicationChoice: applicationChoiceToSubmit,
                examScores: academicInfoToSubmit.examScores || {},
                documentIds: uploadedDocumentInfos.map(doc => doc.documentId),
            };
            
            console.log('Data to submit to BE (onFinish):', applicationDataToSubmit);
            const response = await applicationService.submitApplication(applicationDataToSubmit);

            if (response.success && response.data) {
                message.success('Nộp hồ sơ thành công! Mã hồ sơ: ' + response.data._id);
                setCurrentStep(0); 
                setAllStepsData(JSON.parse(JSON.stringify(initialFormData))); 
                form.setFieldsValue(initialFormData); // Reset form về initial state
                setFileList([]); 
                setUploadedDocumentInfos([]);
                setMajors([]); 
                setAdmissionMethods([]); 
                setSubjectGroups([]); 
                setCurrentSubjectsForScores([]);
            } else { 
                message.error(response.message || 'Nộp hồ sơ thất bại.'); 
            }
        } catch (error: any) { 
            message.error(error.response?.data?.message || error.message || 'Đã có lỗi xảy ra khi nộp hồ sơ.'); 
            console.error("Submit error details:", error);
        } 
        finally { setIsSubmitting(false); }
    };
    
    const validateAndNextStep = async () => {
        try {
            let fieldsToValidate: any[] = []; 
            const currentValues = form.getFieldsValue(true);
            
            if (currentStep === 0) {
                fieldsToValidate = [
                    ['personalInfo', 'fullName'], ['personalInfo', 'dob'], ['personalInfo', 'gender'], 
                    ['personalInfo', 'idNumber'], ['personalInfo', 'idIssueDate'], ['personalInfo', 'idIssuePlace'], 
                    ['personalInfo', 'ethnic'], ['personalInfo', 'nationality'],
                    ['personalInfo', 'permanentAddress'], 
                    ['personalInfo', 'phoneNumber'], ['personalInfo', 'email']
                ];
                await form.validateFields(fieldsToValidate);
                setAllStepsData(prev => ({ ...prev, personalInfo: currentValues.personalInfo || prev.personalInfo }));
            } else if (currentStep === 1) {
                fieldsToValidate = [
                    ['academicInfo', 'highSchoolName'],
                    ['academicInfo', 'graduationYear'],
                    ['applicationChoice', 'universityId'],
                    ['applicationChoice', 'majorId'],
                    ['applicationChoice', 'admissionMethodId'],
                    ['applicationChoice', 'subjectGroupId']
                ];
                await form.validateFields(fieldsToValidate);
                setAllStepsData(prev => ({
                    ...prev,
                    academicInfo: currentValues.academicInfo || prev.academicInfo,
                    applicationChoice: currentValues.applicationChoice || prev.applicationChoice
                }));
            } else if (currentStep === 2) {
                // Validate documents if needed
                await form.validateFields(['documents']);
                setAllStepsData(prev => ({
                    ...prev,
                    documents: currentValues.documents || prev.documents
                }));
            }

            if (currentStep < 2) {
                setCurrentStep(currentStep + 1);
            } else {
                // Submit the application
                const finalData = {
                    ...allStepsData,
                    ...currentValues
                };
                
                try {
                    const response = await applicationService.submitApplication(finalData);
                    if (response.success) {
                        message.success('Nộp hồ sơ thành công!');
                        navigate('/candidate/my-applications');
                    } else {
                        message.error(response.message || 'Có lỗi xảy ra khi nộp hồ sơ.');
                    }
                } catch (error: any) {
                    message.error(error.message || 'Có lỗi xảy ra khi nộp hồ sơ.');
                }
            }
        } catch (errorInfo: any) {
            console.error('Validation Failed:', errorInfo);
            if (errorInfo.errorFields && errorInfo.errorFields.length > 0) {
                const firstErrorFieldArray = errorInfo.errorFields[0].name;
                const firstErrorFieldName = Array.isArray(firstErrorFieldArray) 
                    ? firstErrorFieldArray.join('.') 
                    : String(firstErrorFieldArray);
                const firstErrorMessage = errorInfo.errorFields[0].errors[0];
                message.error(`Vui lòng kiểm tra lại thông tin tại "${firstErrorFieldName}": ${firstErrorMessage}`);
            } else {
                message.error('Vui lòng kiểm tra lại các thông tin đã nhập.');
            }
        }
    };

    const prevStep = () => { 
        if (currentStep === 1) {
            form.setFieldsValue({ personalInfo: allStepsData.personalInfo });
        } else if (currentStep === 2) {
            form.setFieldsValue({ 
                academicInfo: allStepsData.academicInfo, 
                applicationChoice: allStepsData.applicationChoice 
            });
        }
        setCurrentStep(currentStep - 1); 
    };
    
    const personalInfoStep = ( /* ... JSX đầy đủ ... */ <div/> );
    const academicAndChoiceStep = ( /* ... JSX đầy đủ ... */ <div/> );
    const documentsStep = ( /* ... JSX đầy đủ ... */ <div/> );

    // KHÔI PHỤC JSX CHO CÁC STEPS
    const personalInfoStepContent = (
        <Card title="Bước 1: Thông Tin Cá Nhân" variant="borderless" className="shadow-none">
            <Row gutter={24}>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "fullName"]} label="Họ và tên khai sinh" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }, { pattern: /^[a-zA-Z\sÀ-ỹ]+$/, message: 'Họ tên không hợp lệ!' }]}><Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "dob"]} label="Ngày sinh" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}><DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" format="DD/MM/YYYY"/></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "gender"]} label="Giới tính" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}><Select placeholder="Chọn giới tính"><AntOption value="male">Nam</AntOption><AntOption value="female">Nữ</AntOption><AntOption value="other">Khác</AntOption></Select></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "idNumber"]} label="Số CCCD/CMND" rules={[{ required: true, message: 'Vui lòng nhập số CCCD/CMND!' }, { pattern: /^[0-9]{9,12}$/, message: 'Số CCCD/CMND không hợp lệ (9-12 số)!' }]}><Input prefix={<IdcardOutlined />} placeholder="0123456789" /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "idIssueDate"]} label="Ngày cấp CCCD/CMND" rules={[{ required: true, message: 'Vui lòng chọn ngày cấp!' }]}><DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" format="DD/MM/YYYY"/></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "idIssuePlace"]} label="Nơi cấp CCCD/CMND" rules={[{ required: true, message: 'Vui lòng nhập nơi cấp!' }]}><Input placeholder="Ví dụ: Cục CSQLHC về TTXH" /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "ethnic"]} label="Dân tộc" rules={[{ required: true, message: 'Vui lòng nhập dân tộc!' }]}><Input prefix={<TeamOutlined />} placeholder="Kinh" /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "nationality"]} label="Quốc tịch" rules={[{ required: true, message: 'Vui lòng nhập quốc tịch!' }]}><Input prefix={<GlobalOutlined />} /></Form.Item></Col>
                <Col xs={24}><Form.Item name={["personalInfo", "permanentAddress"]} label="Địa chỉ thường trú (theo HKTT)" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ thường trú!' }]}><Input.TextArea rows={2} prefix={<EnvironmentOutlined />} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" /></Form.Item></Col>
                <Col xs={24}><Form.Item name={["personalInfo", "contactAddress"]} label="Địa chỉ liên hệ (nếu khác HKTT)"><Input.TextArea rows={2} placeholder="Địa chỉ nhận thư báo nếu khác HKTT" /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "phoneNumber"]} label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }, { pattern: /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/, message: 'Số điện thoại không hợp lệ!'}]}><Input prefix={<PhoneOutlined />} placeholder="09xxxxxxxx" /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "email"]} label="Email" rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}><Input prefix={<MailOutlined />} placeholder="example@email.com" /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "priorityArea"]} label="Khu vực ưu tiên (nếu có)"><Select placeholder="Chọn khu vực ưu tiên" options={priorityAreas} allowClear/></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "priorityObject"]} label="Đối tượng ưu tiên (nếu có)"><Select mode="multiple" placeholder="Chọn đối tượng ưu tiên" options={priorityObjects} allowClear/></Form.Item></Col>
            </Row>
        </Card>
    );
    const academicAndChoiceStepContent = (
        <Card title="Bước 2: Thông Tin Học Vấn & Nguyện Vọng" variant="borderless" className="shadow-none">
            <AntTitle level={5} className="!mt-0 !mb-3 text-indigo-600">Thông tin THPT</AntTitle>
            <Row gutter={24}>
                <Col xs={24} md={12}><Form.Item name={["academicInfo", "highSchoolName"]} label="Tên trường THPT Lớp 12" rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}><Input prefix={<BookOutlined />} placeholder="Trường THPT Chuyên XYZ" /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["academicInfo", "graduationYear"]} label="Năm tốt nghiệp THPT" rules={[{ required: true, message: 'Vui lòng chọn năm tốt nghiệp!' }]}><Select placeholder="Chọn năm">{highSchoolGraduationYears.map(year => <AntOption key={year} value={year}>{year}</AntOption>)}</Select></Form.Item></Col>
                <Col xs={24} md={8}><Form.Item name={["academicInfo", "gpa10"]} label="Điểm TB lớp 10" rules={[{ required: true, type: 'number', min:0, max:10, message: 'Điểm không hợp lệ (0-10)!' }]}><InputNumber style={{width: '100%'}} step="0.01" placeholder="Ví dụ: 8.5" /></Form.Item></Col>
                <Col xs={24} md={8}><Form.Item name={["academicInfo", "gpa11"]} label="Điểm TB lớp 11" rules={[{ required: true, type: 'number', min:0, max:10, message: 'Điểm không hợp lệ (0-10)!' }]}><InputNumber style={{width: '100%'}} step="0.01" placeholder="Ví dụ: 8.7" /></Form.Item></Col>
                <Col xs={24} md={8}><Form.Item name={["academicInfo", "gpa12"]} label="Điểm TB lớp 12" rules={[{ required: true, type: 'number', min:0, max:10, message: 'Điểm không hợp lệ (0-10)!' }]}><InputNumber style={{width: '100%'}} step="0.01" placeholder="Ví dụ: 9.0" /></Form.Item></Col>
                <Col xs={24} md={8}><Form.Item name={["academicInfo", "conduct10"]} label="Hạnh kiểm lớp 10" rules={[{ required: true, message: 'Chọn hạnh kiểm!' }]}><Select placeholder="Hạnh kiểm"><AntOption value="Tốt">Tốt</AntOption><AntOption value="Khá">Khá</AntOption><AntOption value="Trung bình">Trung bình</AntOption></Select></Form.Item></Col>
                <Col xs={24} md={8}><Form.Item name={["academicInfo", "conduct11"]} label="Hạnh kiểm lớp 11" rules={[{ required: true, message: 'Chọn hạnh kiểm!' }]}><Select placeholder="Hạnh kiểm"><AntOption value="Tốt">Tốt</AntOption><AntOption value="Khá">Khá</AntOption><AntOption value="Trung bình">Trung bình</AntOption></Select></Form.Item></Col>
                <Col xs={24} md={8}><Form.Item name={["academicInfo", "conduct12"]} label="Hạnh kiểm lớp 12" rules={[{ required: true, message: 'Chọn hạnh kiểm!' }]}><Select placeholder="Hạnh kiểm"><AntOption value="Tốt">Tốt</AntOption><AntOption value="Khá">Khá</AntOption><AntOption value="Trung bình">Trung bình</AntOption></Select></Form.Item></Col>
            </Row>
            <AntTitle level={5} className="!mt-6 !mb-3 text-indigo-600">Thông Tin Nguyện Vọng</AntTitle>
            <Row gutter={24}>
                 <Col xs={24} md={12}><Form.Item name={["applicationChoice", "year"]} label="Năm tuyển sinh" rules={[{required: true, message: "Vui lòng chọn năm tuyển sinh"}]}><Select placeholder="Chọn năm tuyển sinh" options={admissionYears} /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["applicationChoice", "universityId"]} label="Trường Đại học" rules={[{ required: true, message: 'Vui lòng chọn trường!' }]}><Select placeholder="Chọn trường Đại học" loading={loadingUniversities} allowClear showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>{universities.map(uni => <AntOption key={uni.id} value={uni.id} label={uni.name}>{uni.name} ({uni.code})</AntOption>)}</Select></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["applicationChoice", "majorId"]} label="Ngành đăng ký" rules={[{ required: true, message: 'Vui lòng chọn ngành!' }]}><Select placeholder="Chọn ngành học" loading={loadingMajors} disabled={!watchedUniversityId || majors.length === 0} allowClear showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>{majors.map(major => <AntOption key={major.id} value={major.id} label={major.name}>{major.name} ({major.code})</AntOption>)}</Select></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["applicationChoice", "admissionMethodId"]} label="Phương thức xét tuyển" rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}><Select placeholder="Chọn phương thức" loading={loadingAdmissionInfo} disabled={!watchedMajorId || admissionMethods.length === 0} allowClear showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>{admissionMethods.map(method => <AntOption key={method.id} value={method.id} label={method.name}>{method.name}</AntOption>)}</Select></Form.Item></Col>
                 { admissionMethods.find(m => m.id === watchedAdmissionMethodId) && subjectGroups.length > 0 && ( <Col xs={24} md={12}><Form.Item name={["applicationChoice", "subjectGroupId"]} label="Tổ hợp xét tuyển" rules={[{ required: true, message: 'Vui lòng chọn tổ hợp!' }]}><Select placeholder="Chọn tổ hợp môn" loading={loadingAdmissionInfo} disabled={!watchedAdmissionMethodId || subjectGroups.length === 0} allowClear showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>{subjectGroups.map(group => <AntOption key={group.id} value={group.id} label={`${group.name} (${group.code})`}>{group.name} ({group.code})</AntOption>)}</Select></Form.Item></Col> )}
            </Row>
            {currentSubjectsForScores.length > 0 && ( <><AntTitle level={5} className="!mt-6 !mb-3 text-indigo-600">Điểm thi theo tổ hợp <AntText type="secondary">({subjectGroups.find(g=>g.id === watchedSubjectGroupId)?.name})</AntText></AntTitle><Row gutter={24}>{currentSubjectsForScores.map(subject => ( <Col xs={24} sm={12} md={8} key={subject}><Form.Item name={["academicInfo", "examScores", subject]} label={`Điểm ${subject}`} rules={[{ required: true, type: 'number', min:0, max:10, message: `Điểm ${subject} không hợp lệ (0-10)!` }]}><InputNumber style={{width: '100%'}} step="0.01" placeholder={`Điểm ${subject}`} /></Form.Item></Col> ))}</Row></> )}
         </Card>
    );
    const documentsStepContent = ( 
        <Card title="Bước 3: Tải Lên Minh Chứng" variant="borderless" className="shadow-none">
            <AntParagraph>Vui lòng tải lên các giấy tờ minh chứng cần thiết (Học bạ, CCCD, Giấy ưu tiên,...). Các file phải rõ ràng, định dạng PDF, JPG, PNG và dung lượng không quá 5MB mỗi file.</AntParagraph>
            <Form.Item name="currentDocumentType" label="Loại giấy tờ hiện tại" initialValue="hoc_ba" rules={[{ required: true, message: 'Vui lòng chọn loại giấy tờ!'}]}><Select placeholder="Chọn loại giấy tờ"><AntOption value="hoc_ba">Học bạ THPT</AntOption><AntOption value="cccd">CCCD/CMND</AntOption><AntOption value="giay_tot_nghiep_tam_thoi">Giấy CNSN Tạm thời</AntOption><AntOption value="giay_uu_tien">Giấy tờ Ưu tiên</AntOption><AntOption value="khac">Minh chứng khác</AntOption></Select></Form.Item>
            <Form.Item label="Tải lên minh chứng"><Upload.Dragger name="documentFile" multiple={true} fileList={fileList} customRequest={customUploadRequest} onChange={handleFileUploadChange} onRemove={handleRemoveFile} beforeUpload={beforeUpload} onPreview={handlePreview}><p className="ant-upload-drag-icon"><InboxOutlined /></p><p className="ant-upload-text">Nhấn hoặc kéo thả file vào đây để tải lên</p><p className="ant-upload-hint">Hỗ trợ PDF, JPG, PNG. Tối đa 5MB/file.</p></Upload.Dragger></Form.Item>
            <Alert message="Lưu ý: Chọn đúng 'Loại giấy tờ hiện tại' trước khi nhấn hoặc kéo thả file để tải lên." type="info" showIcon className="!mt-4"/>
            {previewVisible && ( <Modal open={previewVisible} title={previewTitle} footer={null} onCancel={() => setPreviewVisible(false)} destroyOnHidden><img alt="Xem trước" style={{ width: '100%' }} src={previewImage} /></Modal> )}
         </Card>
    );

    const steps = [
        { title: 'Thông tin cá nhân', content: personalInfoStepContent, icon: <UserOutlined /> },
        { title: 'Học vấn & Nguyện Vọng', content: academicAndChoiceStepContent, icon: <SolutionOutlined /> },
        { title: 'Minh chứng', content: documentsStepContent, icon: <UploadOutlined /> }
    ];

    return (
        <div className={styles.submitContainer}>
            <div className={styles.sectionTitle}>Nộp Hồ Sơ Xét Tuyển Trực Tuyến</div>
            <div className={styles.formSteps}>
                <Steps current={currentStep} responsive>
                    <Steps.Step title="Thông tin cá nhân" />
                    <Steps.Step title="Thông tin học tập & nguyện vọng" />
                    <Steps.Step title="Minh chứng & xác nhận" />
                </Steps>
            </div>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onValuesChange={handleFormValuesChange}
                initialValues={convertInitialValues(allStepsData)}
                className={styles.formCard}
            >
                <div className="steps-content mb-8 min-h-[300px]">
                    {currentStep === 0 && personalInfoStepContent}
                    {currentStep === 1 && academicAndChoiceStepContent}
                    {currentStep === 2 && documentsStepContent}
                </div>
                <div className="steps-action flex justify-between items-center">
                    <div>
                        {currentStep > 0 && ( <Button style={{ margin: '0 8px 0 0' }} onClick={prevStep} size="large">Quay Lại</Button> )}
                    </div>
                    <div>
                        {currentStep < steps.length - 1 && ( <Button type="primary" onClick={validateAndNextStep} size="large" className={styles.formButton + ' ' + styles.formButtonPrimary} loading={isSubmitting}>Tiếp Tục</Button> )}
                        {currentStep === steps.length - 1 && ( <Button type="primary" htmlType="submit" size="large" className={styles.formButton + ' ' + styles.formButtonPrimary} loading={isSubmitting}>Nộp Hồ Sơ</Button> )}
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default CandidateSubmitApplicationPage;
