import React, { useState, useEffect } from 'react';
import {
  Typography, Form, Input, Button, Select, DatePicker, Upload, Alert, Steps, Card, Row, Col, Spin, message, InputNumber, Modal
} from 'antd';
import {
  InboxOutlined, UserOutlined, IdcardOutlined, BookOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined,
  BankOutlined, SolutionOutlined, UploadOutlined, GlobalOutlined, TeamOutlined
} from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

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
  year?: number; // Thêm year vào đây
}
interface FullApplicationData {
  personalInfo: PersonalInfo; 
  academicInfo: AcademicInfo; 
  applicationChoice: ApplicationChoice; 
  examScores?: { [subjectName: string]: number | undefined };
  documentIds?: string[];
}
const priorityAreas = [
    { value: 'KV1', label: 'Khu vực 1 (KV1)' }, { value: 'KV2', label: 'Khu vực 2 (KV2)' },
    { value: 'KV2-NT', label: 'Khu vực 2 - Nông thôn (KV2-NT)' }, { value: 'KV3', label: 'Khu vực 3 (KV3)' },
];
const priorityObjects = [
    { value: 'UT1', label: 'Đối tượng 01' }, { value: 'UT2', label: 'Đối tượng 02' },
    { value: 'UT3', label: 'Đối tượng 03' }, { value: 'UT4', label: 'Đối tượng 04' },
];
const highSchoolGraduationYears = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(String);

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });


const CandidateSubmitApplicationPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm<FullApplicationData>();

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

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploadedDocumentInfos, setUploadedDocumentInfos] = useState<UploadedFileResponse[]>([]);

    const [previewImage, setPreviewImage] = useState('');
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewTitle, setPreviewTitle] = useState('');

    useEffect(() => { /* ... Fetch universities ... */ 
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

    useEffect(() => { /* ... Fetch majors when university changes ... */ 
        setMajors([]); setAdmissionMethods([]); setSubjectGroups([]); setCurrentSubjectsForScores([]);
        form.setFieldsValue({
            applicationChoice: { majorId: undefined, admissionMethodId: undefined, subjectGroupId: undefined, year: new Date().getFullYear() },
            academicInfo: { examScores: {} }
        });
        if (watchedUniversityId) {
            const fetchMajors = async () => {
                setLoadingMajors(true);
                const response = await majorService.getByUniversityId(watchedUniversityId);
                if (response.success && response.data) { setMajors(response.data); } 
                else { message.error(response.message || "Lỗi tải danh sách ngành."); }
                setLoadingMajors(false);
            };
            fetchMajors();
        }
    }, [watchedUniversityId, form]);

    useEffect(() => { /* ... Fetch admission info when major changes ... */ 
        setAdmissionMethods([]); setSubjectGroups([]); setCurrentSubjectsForScores([]);
        form.setFieldsValue({
            applicationChoice: { ...form.getFieldValue(['applicationChoice']), admissionMethodId: undefined, subjectGroupId: undefined },
            academicInfo: { ...form.getFieldValue(['academicInfo']), examScores: {} }
        });
        if (watchedMajorId) {
            const fetchAdmissionInfo = async () => {
                setLoadingAdmissionInfo(true);
                const response = await admissionLinkService.getLinks({ majorId: watchedMajorId, year: form.getFieldValue(['applicationChoice', 'year']) || new Date().getFullYear() });
                if (response.success && response.data) {
                    const links = response.data;
                    const uniqueMethods: AdmissionMethodFE[] = [];
                    const methodMap = new Map<string, AdmissionMethodFE>();
                    links.forEach(link => {
                        if (link.admissionMethod && !methodMap.has(link.admissionMethod.id)) {
                            methodMap.set(link.admissionMethod.id, link.admissionMethod);
                            uniqueMethods.push(link.admissionMethod);
                        }
                    });
                    setAdmissionMethods(uniqueMethods);
                } else {
                    message.error(response.message || "Lỗi tải thông tin tuyển sinh cho ngành.");
                }
                setLoadingAdmissionInfo(false);
            };
            fetchAdmissionInfo();
        }
    }, [watchedMajorId, form]);

    useEffect(() => { /* ... Update subject groups when admission method changes ... */ 
        setSubjectGroups([]); setCurrentSubjectsForScores([]);
         form.setFieldsValue({
            applicationChoice: { ...form.getFieldValue(['applicationChoice']), subjectGroupId: undefined, },
            academicInfo: { ...form.getFieldValue(['academicInfo']), examScores: {} }
        });
        if (watchedMajorId && watchedAdmissionMethodId) {
            const fetchSubjectGroupsForMethod = async () => {
                setLoadingAdmissionInfo(true);
                const response = await admissionLinkService.getLinks({
                    majorId: watchedMajorId,
                    admissionMethodId: watchedAdmissionMethodId,
                    year: form.getFieldValue(['applicationChoice', 'year']) || new Date().getFullYear()
                });
                if (response.success && response.data) {
                    const uniqueGroups: SubjectGroupFE[] = [];
                    const groupMap = new Map<string, SubjectGroupFE>();
                     response.data.forEach(link => {
                        if (link.subjectGroup && !groupMap.has(link.subjectGroup.id)) {
                            groupMap.set(link.subjectGroup.id, link.subjectGroup);
                            uniqueGroups.push(link.subjectGroup);
                        }
                    });
                    setSubjectGroups(uniqueGroups);
                } else {
                    message.error(response.message || "Lỗi tải tổ hợp môn.");
                }
                setLoadingAdmissionInfo(false);
            };
            fetchSubjectGroupsForMethod();
        }
    }, [watchedAdmissionMethodId, watchedMajorId, form]);
    
    useEffect(() => { /* ... Update score fields when subject group changes ... */ 
        if (watchedSubjectGroupId) {
            const group = subjectGroups.find(g => g.id === watchedSubjectGroupId);
            setCurrentSubjectsForScores(group?.subjects || []);
            const initialScores: { [subjectName: string]: number | undefined } = {};
            (group?.subjects || []).forEach(sub => initialScores[sub] = undefined);
            form.setFieldsValue({ academicInfo: { ...form.getFieldValue(['academicInfo']), examScores: initialScores }});
        } else {
            setCurrentSubjectsForScores([]);
            form.setFieldsValue({ academicInfo: { ...form.getFieldValue(['academicInfo']), examScores: {} }});
        }
    }, [watchedSubjectGroupId, subjectGroups, form]);

    const handleFileUploadChange: UploadProps['onChange'] = (info) => { /* ...Giữ nguyên... */ };
    const customUploadRequest: UploadProps['customRequest'] = async (options) => { /* ...Giữ nguyên... */ };
    const handleRemoveFile = (file: UploadFile) => { /* ...Giữ nguyên... */ };
    const handlePreview = async (file: UploadFile) => { /* ...Giữ nguyên... */ };
    const beforeUpload = (file: RcFile) => { /* ...Giữ nguyên... */ };
    const onFinish = async (values: FullApplicationData) => { /* ...Giữ nguyên... */ };
    const validateAndNextStep = async () => { /* ...Giữ nguyên... */ };
    const prevStep = () => { setCurrentStep(currentStep - 1); };

    // --- KHÔI PHỤC NỘI DUNG JSX CHO CÁC STEP ---
    const personalInfoStep = (
        <Card title="Bước 1: Thông Tin Cá Nhân" bordered={false} className="shadow-none">
            <Row gutter={24}>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "fullName"]} label="Họ và tên khai sinh" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }, { pattern: /^[a-zA-Z\sÀ-ỹ]+$/, message: 'Họ tên không hợp lệ!' }]}><Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "dob"]} label="Ngày sinh" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}><DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" format="DD/MM/YYYY"/></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "gender"]} label="Giới tính" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}><Select placeholder="Chọn giới tính"><AntOption value="male">Nam</AntOption><AntOption value="female">Nữ</AntOption><AntOption value="other">Khác</AntOption></Select></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "idNumber"]} label="Số CCCD/CMND" rules={[{ required: true, message: 'Vui lòng nhập số CCCD/CMND!' }, { pattern: /^[0-9]{9,12}$/, message: 'Số CCCD/CMND không hợp lệ (9-12 số)!' }]}><Input prefix={<IdcardOutlined />} placeholder="0123456789" /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "idIssueDate"]} label="Ngày cấp CCCD/CMND" rules={[{ required: true, message: 'Vui lòng chọn ngày cấp!' }]}><DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" format="DD/MM/YYYY"/></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "idIssuePlace"]} label="Nơi cấp CCCD/CMND" rules={[{ required: true, message: 'Vui lòng nhập nơi cấp!' }]}><Input placeholder="Ví dụ: Cục CSQLHC về TTXH" /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "ethnic"]} label="Dân tộc" rules={[{ required: true, message: 'Vui lòng nhập dân tộc!' }]}><Input prefix={<TeamOutlined />} placeholder="Kinh" /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "nationality"]} label="Quốc tịch" initialValue="Việt Nam" rules={[{ required: true, message: 'Vui lòng nhập quốc tịch!' }]}><Input prefix={<GlobalOutlined />} /></Form.Item></Col>
                <Col xs={24}><Form.Item name={["personalInfo", "permanentAddress"]} label="Địa chỉ thường trú (theo HKTT)" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ thường trú!' }]}><Input.TextArea rows={2} prefix={<EnvironmentOutlined />} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" /></Form.Item></Col>
                <Col xs={24}><Form.Item name={["personalInfo", "contactAddress"]} label="Địa chỉ liên hệ (nếu khác HKTT)"><Input.TextArea rows={2} placeholder="Địa chỉ nhận thư báo nếu khác HKTT" /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "phoneNumber"]} label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }, { pattern: /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/, message: 'Số điện thoại không hợp lệ!'}]}><Input prefix={<PhoneOutlined />} placeholder="09xxxxxxxx" /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "email"]} label="Email" rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}><Input prefix={<MailOutlined />} placeholder="example@email.com" /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "priorityArea"]} label="Khu vực ưu tiên (nếu có)"><Select placeholder="Chọn khu vực ưu tiên" options={priorityAreas} allowClear/></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["personalInfo", "priorityObject"]} label="Đối tượng ưu tiên (nếu có)"><Select mode="multiple" placeholder="Chọn đối tượng ưu tiên" options={priorityObjects} allowClear/></Form.Item></Col>
            </Row>
        </Card>
    );
    
    const academicAndChoiceStep = (
        <Card title="Bước 2: Thông Tin Học Vấn & Nguyện Vọng" bordered={false} className="shadow-none">
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
                <Col xs={24} md={12}>
                    <Form.Item name={["applicationChoice", "universityId"]} label="Trường Đại học" rules={[{ required: true, message: 'Vui lòng chọn trường!' }]}>
                        <Select placeholder="Chọn trường Đại học" loading={loadingUniversities} allowClear showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>
                            {universities.map(uni => <AntOption key={uni.id} value={uni.id} label={uni.name}>{uni.name} ({uni.code})</AntOption>)}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item name={["applicationChoice", "majorId"]} label="Ngành đăng ký" rules={[{ required: true, message: 'Vui lòng chọn ngành!' }]}>
                        <Select placeholder="Chọn ngành học" loading={loadingMajors} disabled={!watchedUniversityId || majors.length === 0} allowClear showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>
                            {majors.map(major => <AntOption key={major.id} value={major.id} label={major.name}>{major.name} ({major.code})</AntOption>)}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item name={["applicationChoice", "admissionMethodId"]} label="Phương thức xét tuyển" rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}>
                        <Select placeholder="Chọn phương thức" loading={loadingAdmissionInfo} disabled={!watchedMajorId || admissionMethods.length === 0} allowClear showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>
                             {admissionMethods.map(method => <AntOption key={method.id} value={method.id} label={method.name}>{method.name}</AntOption>)}
                        </Select>
                    </Form.Item>
                </Col>
                 { admissionMethods.find(m => m.id === watchedAdmissionMethodId) && subjectGroups.length > 0 && (
                    <Col xs={24} md={12}>
                        <Form.Item name={["applicationChoice", "subjectGroupId"]} label="Tổ hợp xét tuyển" rules={[{ required: true, message: 'Vui lòng chọn tổ hợp!' }]}>
                            <Select placeholder="Chọn tổ hợp môn" loading={loadingAdmissionInfo} disabled={!watchedAdmissionMethodId || subjectGroups.length === 0} allowClear showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>
                                {subjectGroups.map(group => <AntOption key={group.id} value={group.id} label={`${group.name} (${group.code})`}>{group.name} ({group.code})</AntOption>)}
                            </Select>
                        </Form.Item>
                    </Col>
                 )}
            </Row>
            {currentSubjectsForScores.length > 0 && (
                <>
                    <AntTitle level={5} className="!mt-6 !mb-3 text-indigo-600">
                        Điểm thi theo tổ hợp <AntText type="secondary">({subjectGroups.find(g=>g.id === watchedSubjectGroupId)?.name})</AntText>
                    </AntTitle>
                    <Row gutter={24}>
                        {currentSubjectsForScores.map(subject => (
                            <Col xs={24} sm={12} md={8} key={subject}>
                                <Form.Item 
                                    name={["academicInfo", "examScores", subject]} 
                                    label={`Điểm ${subject}`}
                                    rules={[{ required: true, type: 'number', min:0, max:10, message: `Điểm ${subject} không hợp lệ (0-10)!` }]}
                                >
                                    <InputNumber style={{width: '100%'}} step="0.01" placeholder={`Điểm ${subject}`} />
                                </Form.Item>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
         </Card>
    );
    
    const documentsStep = ( 
        <Card title="Bước 3: Tải Lên Minh Chứng" bordered={false} className="shadow-none">
            <AntParagraph>
                Vui lòng tải lên các giấy tờ minh chứng cần thiết (Học bạ, CCCD, Giấy ưu tiên,...).
                Các file phải rõ ràng, định dạng PDF, JPG, PNG và dung lượng không quá 5MB mỗi file.
            </AntParagraph>
            <Form.Item
                name="currentDocumentType"
                label="Loại giấy tờ hiện tại"
                initialValue="hoc_ba"
                rules={[{ required: true, message: 'Vui lòng chọn loại giấy tờ!'}]}
            >
                <Select placeholder="Chọn loại giấy tờ">
                    <AntOption value="hoc_ba">Học bạ THPT</AntOption>
                    <AntOption value="cccd">CCCD/CMND</AntOption>
                    <AntOption value="giay_tot_nghiep_tam_thoi">Giấy CNSN Tạm thời</AntOption>
                    <AntOption value="giay_uu_tien">Giấy tờ Ưu tiên</AntOption>
                    <AntOption value="khac">Minh chứng khác</AntOption>
                </Select>
            </Form.Item>
            <Form.Item label="Tải lên minh chứng">
                <Upload.Dragger
                    name="documentFile"
                    multiple={true}
                    fileList={fileList}
                    customRequest={customUploadRequest}
                    onChange={handleFileUploadChange}
                    onRemove={handleRemoveFile}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                >
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Nhấn hoặc kéo thả file vào đây để tải lên</p>
                    <p className="ant-upload-hint">Hỗ trợ PDF, JPG, PNG. Tối đa 5MB/file.</p>
                </Upload.Dragger>
            </Form.Item>
            <Alert 
                message="Lưu ý: Chọn đúng 'Loại giấy tờ hiện tại' trước khi nhấn hoặc kéo thả file để tải lên." 
                type="info" showIcon className="!mt-4"/>
            {previewVisible && ( 
                <Modal open={previewVisible} title={previewTitle} footer={null} onCancel={() => setPreviewVisible(false)}>
                    <img alt="Xem trước" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            )}
         </Card>
    );

    const steps = [
        { title: 'Thông tin cá nhân', content: personalInfoStep, icon: <UserOutlined /> },
        { title: 'Học vấn & Nguyện Vọng', content: academicAndChoiceStep, icon: <SolutionOutlined /> },
        { title: 'Minh chứng', content: documentsStep, icon: <UploadOutlined /> }
    ];

    return ( 
        <div className="bg-white p-4 md:p-8 rounded-xl shadow-xl"> 
            <AntTitle level={2} className="text-indigo-700 !mb-2 text-center">Nộp Hồ Sơ Xét Tuyển Trực Tuyến</AntTitle> 
            <AntParagraph className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
                Vui lòng điền đầy đủ và chính xác các thông tin theo từng bước. Các mục có dấu <AntText type="danger">*</AntText> là bắt buộc.
            </AntParagraph> 
            <Steps current={currentStep} className="mb-8 px-0 md:px-8" type="navigation" size="small"> 
                {steps.map(item => ( <AntStep key={item.title} title={item.title} icon={item.icon}/> ))} 
            </Steps> 
            <Form 
                form={form} 
                layout="vertical" 
                onFinish={onFinish} 
                className="max-w-5xl mx-auto" 
                initialValues={{ 
                    personalInfo: { nationality: 'Việt Nam' }, 
                    academicInfo: { examScores: {}}, 
                    applicationChoice: { year: new Date().getFullYear() } // Thêm initial year
                }}
            > 
                <div className="steps-content mb-8 min-h-[300px]">{steps[currentStep].content}</div> 
                <div className="steps-action flex justify-between items-center"> 
                    <div> 
                        {currentStep > 0 && ( <Button style={{ margin: '0 8px 0 0' }} onClick={() => prevStep()} size="large">Quay Lại</Button> )} 
                    </div> 
                    <div> 
                        {currentStep < steps.length - 1 && ( <Button type="primary" onClick={() => validateAndNextStep()} size="large" className="bg-blue-600 hover:bg-blue-700">Tiếp Tục</Button> )} 
                        {currentStep === steps.length - 1 && ( <Button type="primary" htmlType="submit" size="large" className="bg-green-600 hover:bg-green-700" loading={isSubmitting}>Nộp Hồ Sơ</Button> )} 
                    </div> 
                </div> 
            </Form> 
        </div> 
    );
};
export default CandidateSubmitApplicationPage;