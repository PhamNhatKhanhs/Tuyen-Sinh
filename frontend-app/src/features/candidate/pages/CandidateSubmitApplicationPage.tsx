import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Typography, Form, Input, Button, Select, DatePicker, Upload, Alert, Steps, Card, Row, Col, message, InputNumber, Modal
} from 'antd';
import {
  InboxOutlined, UserOutlined, IdcardOutlined, BookOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined,
  SolutionOutlined, UploadOutlined, GlobalOutlined, TeamOutlined
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

// Import Redux hooks
// import { useAppDispatch } from '../../../store/hooks'; // Commented out as dispatch is unused

// Import data types
import type { UniversityFE } from '../../university/types';
import type { MajorFE } from '../../major/types';
import type { AdmissionMethodFE } from '../../admissionMethod/types';
import type { SubjectGroupFE } from '../../subjectGroup/types';
import type { UploadedFileResponse } from '../../upload/types';

const { Title: AntTitle, Paragraph: AntParagraph, Text: AntText } = Typography;
const { Option: AntOption } = Select; // Ensure this line is uncommented
// const { Step: AntStep } = Steps; // Remains commented out as AntStep is unused

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
    // const dispatch = useAppDispatch(); // Commented out as dispatch is declared but its value is never read.

    const [allStepsData, setAllStepsData] = useState<FullApplicationData>(JSON.parse(JSON.stringify(initialFormData))); // Deep copy

    const [universities, setUniversities] = useState<UniversityFE[]>([]);
    const [majors, setMajors] = useState<MajorFE[]>([]);
    const [admissionMethods, setAdmissionMethods] = useState<AdmissionMethodFE[]>([]);
    const [subjectGroups, setSubjectGroups] = useState<SubjectGroupFE[]>([]);
    const [currentSubjectsForScores, setCurrentSubjectsForScores] = useState<string[]>([]);    const [loadingUniversities, setLoadingUniversities] = useState(false);
    const [loadingMajors, setLoadingMajors] = useState(false);
    const [loadingAdmissionInfo, setLoadingAdmissionInfo] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);// Initialize form with proper initial values right after form creation
    useEffect(() => {
        const initialValues = convertInitialValues(initialFormData);
        console.log('INIT: Setting initial form values:', initialValues);
        form.setFieldsValue(initialValues);
        
        // Ensure allStepsData is also properly initialized
        setAllStepsData(JSON.parse(JSON.stringify(initialFormData)));
    }, [form]);

    const watchedUniversityId = Form.useWatch(['applicationChoice', 'universityId'], form);
    const watchedMajorId = Form.useWatch(['applicationChoice', 'majorId'], form);
    const watchedAdmissionMethodId = Form.useWatch(['applicationChoice', 'admissionMethodId'], form);
    const watchedSubjectGroupId = Form.useWatch(['applicationChoice', 'subjectGroupId'], form);
    const watchedYear = Form.useWatch(['applicationChoice', 'year'], form);    // Refs to track if primary fetch parameters changed for admission methods effect
    const prevWatchedMajorIdRef = useRef<string | undefined>();
    const prevWatchedYearRef = useRef<number | undefined>();
    const prevWatchedUniversityIdRef = useRef<string | undefined>();
    const prevWatchedAdmissionMethodIdRef = useRef<string | undefined>();// Track allStepsData changes for debugging
    useEffect(() => {
        console.log('STATE_CHANGE: allStepsData updated:', {
            universityId: allStepsData.applicationChoice?.universityId,
            majorId: allStepsData.applicationChoice?.majorId,
            admissionMethodId: allStepsData.applicationChoice?.admissionMethodId,
            subjectGroupId: allStepsData.applicationChoice?.subjectGroupId,
            year: allStepsData.applicationChoice?.year
        });
        
        // Critical debugging: Alert if admissionMethodId becomes undefined when it shouldn't
        if (allStepsData.applicationChoice?.admissionMethodId === undefined && 
            (allStepsData.applicationChoice?.universityId || allStepsData.applicationChoice?.majorId)) {
            console.error('🚨 CRITICAL: admissionMethodId became undefined while other choice fields exist!');
            console.error('🚨 Full allStepsData:', allStepsData);
            console.error('🚨 Stack trace:', new Error().stack);
        }
    }, [allStepsData]);// Form.useWatch synchronization - ensure watched values are properly tracked
    useEffect(() => {
        // Create updated application choice from watched values
        const updatedApplicationChoice = {
            universityId: watchedUniversityId,
            majorId: watchedMajorId,
            admissionMethodId: watchedAdmissionMethodId,
            subjectGroupId: watchedSubjectGroupId,
            year: watchedYear
        };
        
        const allWatchedAreNowUndefined = Object.values(updatedApplicationChoice).every(value => value === undefined);
        
        console.log('FORM_SYNC: Watched values updated:', updatedApplicationChoice);
        console.log('FORM_SYNC: All watched values are currently undefined?', allWatchedAreNowUndefined);
        console.log('FORM_SYNC: Current allStepsData.applicationChoice before this sync:', allStepsData.applicationChoice);
        
        if (!allWatchedAreNowUndefined) {
            // Some watched values might be defined.
            // We update allStepsData, but carefully: only use a watched value if it's defined.
            // This prevents an 'undefined' from an unmounted field overwriting a stored value.
            setAllStepsData(prev => {
                const currentChoiceInState = prev.applicationChoice || {};
                const newChoiceForState = { ...currentChoiceInState }; // Start with a copy of current state
                let effectiveChangesMade = false;

                for (const key in updatedApplicationChoice) {
                    const typedKey = key as keyof ApplicationChoice;
                    const watchedValue = updatedApplicationChoice[typedKey];

                    if (watchedValue !== undefined) {
                        // If the watched value is defined, update state if it's different
                        if (newChoiceForState[typedKey] !== watchedValue) {
                            newChoiceForState[typedKey] = watchedValue;
                            effectiveChangesMade = true;
                        }
                    }
                    // If watchedValue is undefined, we DO NOT change newChoiceForState[typedKey].
                    // This preserves any existing defined value in the state if the field was unmounted.
                }
                
                if (effectiveChangesMade) {
                    console.log('FORM_SYNC: Updating allStepsData with defined watched values. Old state choice:', currentChoiceInState, 'New state choice:', newChoiceForState);
                    return {
                        ...prev,
                        applicationChoice: newChoiceForState
                    };
                }
                console.log('FORM_SYNC: No effective changes to allStepsData needed from this sync (defined watched values match state, or watched values are undefined where state already has values).');
                return prev;
            });
        } else {
            // All watched values are currently undefined.
            // This might happen on form reset or if all relevant fields unmount AND their values were not preserved in form state.
            console.log('FORM_SYNC: All watched values are currently undefined. Checking if form restoration from allStepsData is needed.');
            // If allStepsData still holds meaningful data (e.g., from a previous step),
            // we can restore the form fields. We don't update allStepsData itself from these undefineds.
            if (allStepsData.applicationChoice?.universityId || allStepsData.applicationChoice?.majorId) { // Check if allStepsData has some choice data
                console.log('FORM_SYNC: Restoring form fields from allStepsData because all watched values are undefined:', allStepsData.applicationChoice);
                form.setFieldsValue({
                    applicationChoice: allStepsData.applicationChoice
                });
            } else {
                console.log('FORM_SYNC: All watched values are undefined, and allStepsData.applicationChoice also seems empty. No form restoration or state update.');
            }
        }
        // Added form to dependencies because form.setFieldsValue is used.
        // The watched values are the primary dependencies.
    }, [watchedUniversityId, watchedMajorId, watchedAdmissionMethodId, watchedSubjectGroupId, watchedYear, form]);

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
    }, []);    const handleFormValuesChange = useCallback((changedValues: any, _allValues: FullApplicationData) => {
        console.log('FORM_CHANGE: Values changed:', changedValues);
        console.log('FORM_CHANGE: Current step:', currentStep);
        
        if (currentStep === 0 && changedValues.personalInfo) {
            setAllStepsData(prev => ({...prev, personalInfo: {...prev.personalInfo, ...changedValues.personalInfo}}));
        } else if (currentStep === 1) {
            if (changedValues.academicInfo) {
                 setAllStepsData(prev => ({...prev, academicInfo: {...prev.academicInfo, ...changedValues.academicInfo}}));
            }
            if (changedValues.applicationChoice) {
                console.log('FORM_CHANGE: ApplicationChoice changed:', changedValues.applicationChoice);
                 setAllStepsData(prev => ({...prev, applicationChoice: {...prev.applicationChoice, ...changedValues.applicationChoice}}));
            }
        }
    }, [currentStep]);    useEffect(() => {
        console.log('UNIVERSITY_EFFECT: watchedUniversityId changed to:', watchedUniversityId);
        console.log('UNIVERSITY_EFFECT: Previous universityId:', prevWatchedUniversityIdRef.current);
        console.log('UNIVERSITY_EFFECT: Current allStepsData.applicationChoice:', allStepsData.applicationChoice);
        
        // Only clear dependent fields if the university ID actually changed to a different value
        const universityActuallyChanged = prevWatchedUniversityIdRef.current !== watchedUniversityId;
        
        if (universityActuallyChanged) {
            console.log('UNIVERSITY_EFFECT: University actually changed, clearing dependent fields');
            setMajors([]); 
            setAdmissionMethods([]); 
            setSubjectGroups([]); 
            setCurrentSubjectsForScores([]);

            // Get current values from form for resets
            const currentFormApplicationChoice = form.getFieldValue('applicationChoice') || { year: currentAcademicYear };
            const currentFormAcademicInfo = form.getFieldValue('academicInfo') || { examScores: {} };
            
            const newApplicationChoice = { 
                ...currentFormApplicationChoice, 
                universityId: watchedUniversityId, // Cập nhật universityId từ watched value
                majorId: undefined, 
                admissionMethodId: undefined, 
                subjectGroupId: undefined, 
            };
            // Preserve year if it exists and wasn't the trigger for a change that should clear it.
            // If universityId changes, year should ideally persist unless explicitly changed by user.
            newApplicationChoice.year = currentFormApplicationChoice.year || watchedYear || currentAcademicYear;

            const newAcademicInfo = { ...currentFormAcademicInfo, examScores: {} };
            
            console.log('UNIVERSITY_EFFECT: About to set newApplicationChoice:', newApplicationChoice);
            console.log('🚨 UNIVERSITY_EFFECT: This will set admissionMethodId to undefined!');
            
            // Only update allStepsData. The sync effect will handle form.setFieldsValue.
            setAllStepsData(prev => ({ ...prev, applicationChoice: newApplicationChoice, academicInfo: newAcademicInfo }));
        } else {
            console.log('UNIVERSITY_EFFECT: University did not actually change, skipping dependent field clearing');
        }

        // Always fetch majors if we have a university ID
        if (watchedUniversityId) {
            setLoadingMajors(true);
            majorService.getByUniversityId(watchedUniversityId)
                .then(response => {
                    if (response.success && response.data) setMajors(response.data);
                    else {
                        setMajors([]); // Ensure clear on error
                    }
                })
                .finally(() => setLoadingMajors(false));
        } else {
            setMajors([]); // Clear if no universityId
            setLoadingMajors(false);
        }
        
        // Update the ref for next comparison
        prevWatchedUniversityIdRef.current = watchedUniversityId;
    }, [watchedUniversityId, form]);    useEffect(() => {
        let isEffectActive = true;

        const majorIdChanged = prevWatchedMajorIdRef.current !== watchedMajorId;
        const yearChanged = prevWatchedYearRef.current !== watchedYear;
        const primaryParamsChanged = majorIdChanged || yearChanged;
        
        console.log('MAJOR_YEAR_EFFECT: Effect triggered');
        console.log('MAJOR_YEAR_EFFECT: watchedMajorId:', watchedMajorId, 'prev:', prevWatchedMajorIdRef.current);
        console.log('MAJOR_YEAR_EFFECT: watchedYear:', watchedYear, 'prev:', prevWatchedYearRef.current);
        console.log('MAJOR_YEAR_EFFECT: primaryParamsChanged:', primaryParamsChanged);
        console.log('MAJOR_YEAR_EFFECT: Current allStepsData.applicationChoice BEFORE:', allStepsData.applicationChoice);
        
        // Clear admission methods and subject groups when params change
        if (primaryParamsChanged) {
            console.log('MAJOR_YEAR_EFFECT: Primary parameters changed - resetting admission methods and subject groups');
            const currentFormApplicationChoice = form.getFieldValue('applicationChoice') || {};
            const currentFormAcademicInfo = form.getFieldValue('academicInfo') || { examScores: {} };

            const newApplicationChoiceForState = { 
                ...currentFormApplicationChoice,
                year: watchedYear !== undefined ? watchedYear : currentFormApplicationChoice.year, 
                majorId: watchedMajorId,
                admissionMethodId: undefined, 
                subjectGroupId: undefined 
            };
            const newAcademicInfoForState = { ...currentFormAcademicInfo, examScores: {} };

            console.log('MAJOR_YEAR_EFFECT: About to set newApplicationChoiceForState:', newApplicationChoiceForState);
            console.log('🚨 MAJOR_YEAR_EFFECT: This will set admissionMethodId to undefined!');

            setAllStepsData(prev => ({ 
                ...prev, 
                applicationChoice: newApplicationChoiceForState, 
                academicInfo: newAcademicInfoForState 
            }));
            
            if (isEffectActive) {
                setAdmissionMethods([]);
                setSubjectGroups([]); 
                setCurrentSubjectsForScores([]);
            }
        } else {
            console.log('MAJOR_YEAR_EFFECT: Primary parameters did not change, preserving existing data');
        }

        // Fetch admission methods if we have both major and year
        const currentSelectedYear = watchedYear || form.getFieldValue(['applicationChoice', 'year']) || currentAcademicYear;
        if (watchedMajorId && currentSelectedYear) {
            console.log('MAJOR_YEAR_EFFECT: Fetching admission methods for major:', watchedMajorId, 'year:', currentSelectedYear);

            setLoadingAdmissionInfo(true);
            admissionLinkService.getLinks({ majorId: watchedMajorId, year: currentSelectedYear })
                .then(response => {
                    if (!isEffectActive) return;
                    
                    if (response.success && response.data) {
                        const uniqueMethods = Array.from(new Map(response.data
                            .filter(link => link.admissionMethodId)
                            .map(link => [link.admissionMethodId, { id: link.admissionMethodId, name: link.admissionMethodName }])
                        ).values())
                        .filter(method => method.id !== 'N/A_METHOD' && method.id !== 'N/A_UNKNOWN_METHOD');
                        
                        console.log('MAJOR_YEAR_EFFECT: Successfully fetched admission methods:', uniqueMethods);
                        setAdmissionMethods(uniqueMethods);
                    } else {
                        console.log('MAJOR_YEAR_EFFECT: API response unsuccessful or no data');
                        setAdmissionMethods([]);
                    }
                })
                .catch(error => {
                    if (!isEffectActive) return;
                    console.error('💥 MAJOR_YEAR_EFFECT: Failed to fetch admission methods:', error);
                    message.error('Không thể kết nối để tải phương thức tuyển sinh.');
                    setAdmissionMethods([]); 
                })
                .finally(() => {
                    if (isEffectActive) setLoadingAdmissionInfo(false);
                });
        } else {
            console.log('MAJOR_YEAR_EFFECT: Missing required parameters - not fetching admission methods');
            if (isEffectActive) {
                setAdmissionMethods([]); 
                setLoadingAdmissionInfo(false);
            }
        }

        // Update refs AFTER the fetch logic to ensure proper comparison on next run
        prevWatchedMajorIdRef.current = watchedMajorId;
        prevWatchedYearRef.current = watchedYear;

        return () => {
            isEffectActive = false;
        };
    }, [watchedMajorId, watchedYear, form]);    useEffect(() => {
        let isEffectActive = true;

        console.log('ADMISSION_METHOD_EFFECT: Effect triggered');
        console.log('ADMISSION_METHOD_EFFECT: watchedAdmissionMethodId changed to:', watchedAdmissionMethodId);
        console.log('ADMISSION_METHOD_EFFECT: Previous admissionMethodId:', prevWatchedAdmissionMethodIdRef.current);
        console.log('ADMISSION_METHOD_EFFECT: Current allStepsData.applicationChoice BEFORE:', allStepsData.applicationChoice);
        
        // Only clear dependent fields if the admission method actually changed to a different value
        const admissionMethodActuallyChanged = prevWatchedAdmissionMethodIdRef.current !== watchedAdmissionMethodId;
        
        if (admissionMethodActuallyChanged && isEffectActive) {
            console.log('ADMISSION_METHOD_EFFECT: Admission method actually changed, clearing subject groups');
            setSubjectGroups([]); 
            setCurrentSubjectsForScores([]);
        } else {
            console.log('ADMISSION_METHOD_EFFECT: Admission method did not actually change, skipping clearing');
        }

        const currentFormApplicationChoice = form.getFieldValue('applicationChoice') || {};
        const currentFormAcademicInfo = form.getFieldValue('academicInfo') || { examScores: {} };

        const newApplicationChoice = { 
            ...currentFormApplicationChoice, 
            admissionMethodId: watchedAdmissionMethodId, 
            subjectGroupId: admissionMethodActuallyChanged ? undefined : currentFormApplicationChoice.subjectGroupId
        };
        // Preserve year and majorId from form/watched values
        newApplicationChoice.year = watchedYear !== undefined ? watchedYear : currentFormApplicationChoice.year;
        newApplicationChoice.majorId = watchedMajorId !== undefined ? watchedMajorId : currentFormApplicationChoice.majorId;
        
        const newAcademicInfo = admissionMethodActuallyChanged ? { ...currentFormAcademicInfo, examScores: {} } : currentFormAcademicInfo;

        console.log('ADMISSION_METHOD_EFFECT: About to set newApplicationChoice:', newApplicationChoice);
        if (newApplicationChoice.admissionMethodId === undefined && (newApplicationChoice.universityId || newApplicationChoice.majorId)) {
            console.log('🚨 ADMISSION_METHOD_EFFECT: This will set admissionMethodId to undefined while other fields exist!');
        }
        
        setAllStepsData(prev => ({ ...prev, applicationChoice: newApplicationChoice, academicInfo: newAcademicInfo }));
        
        const currentSelectedYear = watchedYear || newApplicationChoice.year || currentAcademicYear;

        // Kiểm tra xem phương thức có cần tổ hợp môn không
        const selectedMethod = admissionMethods.find(m => m.id === watchedAdmissionMethodId);
        const isThptMethod = selectedMethod?.name?.includes('Tốt nghiệp THPT') || selectedMethod?.name?.includes('THPTQG');

        if (watchedMajorId && watchedAdmissionMethodId && currentSelectedYear && isThptMethod) {
            console.log('ADMISSION_METHOD_EFFECT: Fetching subject groups for admission method');
            setLoadingAdmissionInfo(true);
            admissionLinkService.getLinks({ majorId: watchedMajorId, admissionMethodId: watchedAdmissionMethodId, year: currentSelectedYear })
                .then(response => {
                    if (!isEffectActive) return;
                    if (response.success && response.data) {
                        const uniqueGroups = Array.from(new Map(response.data
                            .filter(link => typeof link.subjectGroupId === 'string')
                            .map(link => [link.subjectGroupId, { id: link.subjectGroupId, name: link.subjectGroupName, code: link.subjectGroupCode || '', subjects: [] }])
                        ).values())
                        .filter(group => group.id !== 'N/A_GROUP_OR_NONE' && group.id !== 'N/A_UNKNOWN_GROUP');
                        if (isEffectActive) setSubjectGroups(uniqueGroups);
                    } else { 
                        if (isEffectActive) setSubjectGroups([]);
                    }
                })
                .finally(() => {
                    if (isEffectActive) setLoadingAdmissionInfo(false);
                });
        } else {
            console.log('ADMISSION_METHOD_EFFECT: Not fetching subject groups - missing params or not THPT method');
            if (isEffectActive) {
                setSubjectGroups([]);
                setLoadingAdmissionInfo(false);
            }
        }
        
        // Update the ref for next comparison
        prevWatchedAdmissionMethodIdRef.current = watchedAdmissionMethodId;
        
        return () => {
            isEffectActive = false;
        };
    }, [watchedAdmissionMethodId, watchedMajorId, watchedYear, form, admissionMethods]);
    
    useEffect(() => { 
        const formAcademicInfo = form.getFieldValue('academicInfo') || { examScores: {} };
        const currentExamScores = formAcademicInfo.examScores || {};

        if (watchedSubjectGroupId) {
            const group = subjectGroups.find(g => g.id === watchedSubjectGroupId);
            // Ensure group and group.subjects are defined before trying to access subjects
            const newSubjects = group?.subjects || [];
            setCurrentSubjectsForScores(newSubjects);

            const newExamScores: { [subjectName: string]: number | undefined } = {};
            newSubjects.forEach((sub: string) => { // Added string type for sub
                newExamScores[sub] = currentExamScores[sub];
            });
            
            const updatedAcademicInfo = { ...formAcademicInfo, examScores: newExamScores };
            setAllStepsData(prev => ({...prev, academicInfo: updatedAcademicInfo }));
        } else {
            setCurrentSubjectsForScores([]);
            const updatedAcademicInfo = { ...formAcademicInfo, examScores: {} };
            setAllStepsData(prev => ({...prev, academicInfo: updatedAcademicInfo }));
        }
    }, [watchedSubjectGroupId, subjectGroups, form]);    // Sync form fields with allStepsData when it changes - but avoid circular updates
    useEffect(() => {
        // Only sync specific fields that are not being watched to avoid interfering with Form.useWatch
        const currentFormValues = form.getFieldsValue();
        const convertedAllStepsData = convertInitialValues(allStepsData);
        
        // Only update personal info and academic info, but NOT applicationChoice fields that are watched
        const updateFields: any = {};
        
        if (JSON.stringify(currentFormValues.personalInfo) !== JSON.stringify(convertedAllStepsData.personalInfo)) {
            updateFields.personalInfo = convertedAllStepsData.personalInfo;
        }
        
        if (JSON.stringify(currentFormValues.academicInfo?.examScores) !== JSON.stringify(convertedAllStepsData.academicInfo?.examScores)) {
            updateFields.academicInfo = {
                ...currentFormValues.academicInfo,
                examScores: convertedAllStepsData.academicInfo?.examScores
            };
        }
        
        // Only update if we have fields to update
        if (Object.keys(updateFields).length > 0) {
            form.setFieldsValue(updateFields);
        }
    }, [allStepsData, form]);

    const handleFileUploadChange: UploadProps['onChange'] = (info) => { setFileList(info.fileList); };
    const customUploadRequest: UploadProps['customRequest'] = async (options) => {
        const { onSuccess, onError, file } = options; // Removed onProgress as it's not used
        const documentType = form.getFieldValue('currentDocumentType') || 'hoc_ba';
        
        try {
            const response = await uploadService.uploadDocument(file as File, documentType);
            if (response.success && response.data) {
                // Lưu thông tin file đã upload thành công cùng với uid
                const fileData = {
                    ...response.data,
                    uid: (file as UploadFile).uid // Cast to UploadFile to access uid
                };
                
                // Cập nhật state với thông tin mới
                setUploadedDocumentInfos(prev => [...prev, fileData]);
                
                // Gọi callback onSuccess
                onSuccess?.(response, file as File);
                message.success(`Tải lên ${(file as UploadFile).name} thành công!`); // Cast to UploadFile to access name
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
        }        return true;
    };

    const onFinish = async () => {
        console.log('🔥 SUBMIT_DEBUGGING: onFinish called');
        console.log('🔥 SUBMIT_DEBUGGING: Current step:', currentStep);
        console.log('🔥 SUBMIT_DEBUGGING: watchedAdmissionMethodId:', watchedAdmissionMethodId);
        console.log('🔥 SUBMIT_DEBUGGING: allStepsData.applicationChoice:', allStepsData.applicationChoice);
        
        setIsSubmitting(true);
        try {
            // Get all current form values. If a field hasn't been touched, it might be undefined here.
            const currentFormValues = form.getFieldsValue(); 
            
            console.log('🔥 SUBMIT_DEBUGGING: currentFormValues.applicationChoice:', currentFormValues.applicationChoice);
            console.log('🔥 SUBMIT_DEBUGGING: Full currentFormValues:', currentFormValues);
            console.log('🔥 SUBMIT_DEBUGGING: Full allStepsData:', allStepsData);
            
            // Check all potential sources of admissionMethodId
            const sources = {
                watched: watchedAdmissionMethodId,
                allStepsData: allStepsData.applicationChoice?.admissionMethodId,
                currentFormValues: currentFormValues.applicationChoice?.admissionMethodId,
                formGetFieldValue: form.getFieldValue(['applicationChoice', 'admissionMethodId'])
            };
            console.log('🔥 SUBMIT_DEBUGGING: All admissionMethodId sources:', sources);
            
            if (Object.values(sources).every(val => val === undefined)) {
                console.error('🚨 CRITICAL: All sources of admissionMethodId are undefined at submission time!');
                console.error('🚨 This indicates the value was lost somewhere in the form lifecycle');
                console.error('🚨 Stack trace:', new Error().stack);
            }

            // Consolidate data: Start with allStepsData, then overlay with any values from the current form.
            const personalInfoToSubmit: PersonalInfo = {
                ...allStepsData.personalInfo, 
                ...(currentFormValues.personalInfo || {}) 
            };
            const academicInfoToSubmit: AcademicInfo = {
                ...allStepsData.academicInfo, 
                ...(currentFormValues.academicInfo || {}),
                examScores: {
                    ...(allStepsData.academicInfo?.examScores || {}),
                    ...(currentFormValues.academicInfo?.examScores || {})
                }
            };            // CRITICAL FIX: Use form.getFieldValue() for individual fields instead of form.getFieldsValue()
            // because form.getFieldsValue() seems to be missing the applicationChoice data
            console.log('🔥 SUBMIT_DEBUGGING: Retrieving individual field values from form:');
            const formUniversityId = form.getFieldValue(['applicationChoice', 'universityId']);
            const formMajorId = form.getFieldValue(['applicationChoice', 'majorId']);
            const formAdmissionMethodId = form.getFieldValue(['applicationChoice', 'admissionMethodId']);
            const formSubjectGroupId = form.getFieldValue(['applicationChoice', 'subjectGroupId']);
            const formYear = form.getFieldValue(['applicationChoice', 'year']);
            
            console.log('🔥 SUBMIT_DEBUGGING: Individual form field values:', {
                formUniversityId,
                formMajorId,
                formAdmissionMethodId,
                formSubjectGroupId,
                formYear
            });

            // CRITICAL FIX: Use form.getFieldValue() as the primary source since it has the actual values
            console.log('SUBMIT_DEBUGGING: Priority-based field selection (form.getFieldValue first):');
            
            const resolvedUniversityId = formUniversityId || watchedUniversityId || allStepsData.applicationChoice?.universityId;
            const resolvedMajorId = formMajorId || watchedMajorId || allStepsData.applicationChoice?.majorId;
            const resolvedAdmissionMethodId = formAdmissionMethodId || watchedAdmissionMethodId || allStepsData.applicationChoice?.admissionMethodId;
            const resolvedSubjectGroupId = formSubjectGroupId || watchedSubjectGroupId || allStepsData.applicationChoice?.subjectGroupId;
            const resolvedYear = formYear || watchedYear || allStepsData.applicationChoice?.year;
            
            console.log('- RESOLVED universityId:', resolvedUniversityId);
            console.log('- RESOLVED majorId:', resolvedMajorId);
            console.log('- RESOLVED admissionMethodId:', resolvedAdmissionMethodId);
            console.log('- RESOLVED subjectGroupId:', resolvedSubjectGroupId);
            console.log('- RESOLVED year:', resolvedYear);
            
            const applicationChoiceToSubmit: ApplicationChoice = {
                universityId: resolvedUniversityId,
                majorId: resolvedMajorId,
                admissionMethodId: resolvedAdmissionMethodId,
                subjectGroupId: resolvedSubjectGroupId,
                year: resolvedYear
            };

            const validationErrors: string[] = [];
            if (!personalInfoToSubmit.fullName) validationErrors.push("Họ và tên (Thông tin cá nhân) bị thiếu.");
            if (!personalInfoToSubmit.idNumber) validationErrors.push("Số CMND/CCCD (Thông tin cá nhân) bị thiếu.");
            if (!personalInfoToSubmit.dob) validationErrors.push("Ngày sinh (Thông tin cá nhân) bị thiếu.");
            if (!personalInfoToSubmit.gender) validationErrors.push("Giới tính (Thông tin cá nhân) bị thiếu.");
            if (!personalInfoToSubmit.idIssueDate) validationErrors.push("Ngày cấp CMND/CCCD (Thông tin cá nhân) bị thiếu.");
            if (!personalInfoToSubmit.idIssuePlace) validationErrors.push("Nơi cấp CMND/CCCD (Thông tin cá nhân) bị thiếu.");
            if (!personalInfoToSubmit.permanentAddress) validationErrors.push("Địa chỉ thường trú (Thông tin cá nhân) bị thiếu.");
            if (!personalInfoToSubmit.phoneNumber) validationErrors.push("Số điện thoại (Thông tin cá nhân) bị thiếu.");
            if (!personalInfoToSubmit.email) validationErrors.push("Email (Thông tin cá nhân) bị thiếu.");

            if (!academicInfoToSubmit.highSchoolName) validationErrors.push("Tên trường THPT (Thông tin học vấn) bị thiếu.");
            if (!academicInfoToSubmit.graduationYear) validationErrors.push("Năm tốt nghiệp THPT (Thông tin học vấn) bị thiếu.");
            
            if (!applicationChoiceToSubmit.universityId) validationErrors.push("Trường Đại học (Nguyện vọng) chưa chọn.");
            if (!applicationChoiceToSubmit.majorId) validationErrors.push("Ngành học (Nguyện vọng) chưa chọn.");
            if (!applicationChoiceToSubmit.admissionMethodId) validationErrors.push("Phương thức xét tuyển (Nguyện vọng) chưa chọn.");
            if (!applicationChoiceToSubmit.year) validationErrors.push("Năm xét tuyển (Nguyện vọng) chưa chọn.");            console.log('SUBMIT_PAGE: Data being prepared for submission:', {
                personalInfo: personalInfoToSubmit,
                academicInfo: academicInfoToSubmit,
                applicationChoice: applicationChoiceToSubmit,
                documentIds: uploadedDocumentInfos.map(doc => doc.documentId),
                _source_allStepsData: allStepsData, 
                _source_currentFormValues: currentFormValues,
                _watchedValues: {
                    watchedUniversityId,
                    watchedMajorId,
                    watchedAdmissionMethodId,
                    watchedSubjectGroupId,
                    watchedYear
                },
                _analysis: {
                    allStepsDataApplicationChoice: allStepsData.applicationChoice,
                    formValuesApplicationChoice: currentFormValues.applicationChoice,
                    finalApplicationChoice: applicationChoiceToSubmit
                }
            });

            if (validationErrors.length > 0) {
                validationErrors.forEach(err => message.error(err));
                setIsSubmitting(false);
                return;
            }            const applicationDataToSubmit = {
                personalInfo: personalInfoToSubmit,
                academicInfo: academicInfoToSubmit, 
                applicationChoice: applicationChoiceToSubmit,
                examScores: academicInfoToSubmit.examScores || {}, // Extract examScores as separate field for backend
                documentIds: uploadedDocumentInfos.map(doc => doc.documentId),
            };
              console.log('SUBMIT_PAGE: Final data for API:', applicationDataToSubmit);
            
            const response = await applicationService.submitApplication(applicationDataToSubmit);
            console.log('SUBMIT_PAGE: Response received from API:', response);

            if (response.success && response.data) {
                console.log('SUBMIT_PAGE: Success! Application data:', response.data);
                
                // Safely check response data structure
                if (response.data && typeof response.data === 'object') {
                    console.log('SUBMIT_PAGE: Response data is valid object');
                    console.log('SUBMIT_PAGE: Application ID:', response.data._id || response.data.id);
                    
                    // Log populated fields to ensure they exist
                    if (response.data.university) {
                        console.log('SUBMIT_PAGE: University:', typeof response.data.university === 'object' ? response.data.university.name : response.data.university);
                    }
                    if (response.data.major) {
                        console.log('SUBMIT_PAGE: Major:', typeof response.data.major === 'object' ? response.data.major.name : response.data.major);
                    }
                }
                
                message.success('Nộp hồ sơ thành công!');
                
                // Reset form and navigate to homepage
                setAllStepsData(JSON.parse(JSON.stringify(initialFormData))); 
                form.resetFields(); 
                setUploadedDocumentInfos([]);
                setFileList([]);
                setCurrentStep(0);
                navigate('/'); // Navigate to homepage instead of applications page
            } else {
                console.error('SUBMIT_PAGE: API returned unsuccessful response:', response);
                message.error(response.message || 'Nộp hồ sơ thất bại. Vui lòng thử lại.');
            }
        } catch (error: any) { 
            console.error('SUBMIT_PAGE: Error during submission:', error);
            const backendErrorMessage = error.response?.data?.message || error.message || 'Đã có lỗi xảy ra khi nộp hồ sơ.';
            message.error(backendErrorMessage); 
        } 
        finally {
            setIsSubmitting(false);
        }
    };
      const validateAndNextStep = async () => {
        try {
            console.log('VALIDATE_STEP: Starting validation for step', currentStep);
            console.log('VALIDATE_STEP: Current watched values:', {
                watchedUniversityId,
                watchedMajorId,
                watchedAdmissionMethodId,
                watchedSubjectGroupId,
                watchedYear
            });
            console.log('VALIDATE_STEP: Current allStepsData:', allStepsData);
            
            let fieldsToValidate: any[] = []; 
            const currentValues = form.getFieldsValue(true);
            console.log('VALIDATE_STEP: Current form values:', currentValues);
            
            if (currentStep === 0) {
                fieldsToValidate = [
                    ['personalInfo', 'fullName'], ['personalInfo', 'dob'], ['personalInfo', 'gender'], 
                    ['personalInfo', 'idNumber'], ['personalInfo', 'idIssueDate'], ['personalInfo', 'idIssuePlace'], 
                    ['personalInfo', 'ethnic'], ['personalInfo', 'nationality'],
                    ['personalInfo', 'permanentAddress'], 
                    ['personalInfo', 'phoneNumber'], ['personalInfo', 'email']
                ];
                await form.validateFields(fieldsToValidate);
                setAllStepsData(prev => ({ ...prev, personalInfo: currentValues.personalInfo || prev.personalInfo }));            } else if (currentStep === 1) {
                fieldsToValidate = [
                    ['academicInfo', 'highSchoolName'],
                    ['academicInfo', 'graduationYear'],
                    ['applicationChoice', 'universityId'],
                    ['applicationChoice', 'majorId'],
                    ['applicationChoice', 'admissionMethodId']
                ];                
                // Enhanced validation based on admission method type
                const selectedMethodId = currentValues.applicationChoice?.admissionMethodId;
                const selectedMethod = admissionMethods.find(m => m.id === selectedMethodId);
                
                // Improved method detection logic
                const isThptMethod = selectedMethod && (
                    selectedMethod.name?.includes('Tốt nghiệp THPT') || 
                    selectedMethod.name?.includes('THPTQG') ||
                    selectedMethod.name?.includes('thi THPT') ||
                    selectedMethod.code === 'THPTQG'
                );
                
                const isDgnlMethod = selectedMethod && (
                    selectedMethod.name?.includes('Đánh giá năng lực') ||
                    selectedMethod.name?.includes('ĐGNL') ||
                    selectedMethod.name?.includes('năng lực') ||
                    selectedMethod.code?.includes('DGNL')
                );
                
                const isSatMethod = selectedMethod && (
                    selectedMethod.name?.includes('SAT') ||
                    selectedMethod.code === 'SAT'
                );
                
                const isActMethod = selectedMethod && (
                    selectedMethod.name?.includes('ACT') ||
                    selectedMethod.code === 'ACT'
                );
                
                const isIeltsMethod = selectedMethod && (
                    selectedMethod.name?.includes('IELTS') ||
                    selectedMethod.code === 'IELTS'
                );
                
                // Only require subjectGroupId for THPT method
                if (isThptMethod) {
                    fieldsToValidate.push(['applicationChoice', 'subjectGroupId']);
                }                
                // Add score validation based on method type
                if (isThptMethod && currentSubjectsForScores.length > 0) {
                    // For THPT method, validate individual subject scores
                    currentSubjectsForScores.forEach(subject => {
                        fieldsToValidate.push(['academicInfo', 'examScores', subject]);
                    });
                } else if (isDgnlMethod) {
                    // For DGNL method, validate DGNL score
                    fieldsToValidate.push(['academicInfo', 'examScores', 'DGNL']);
                } else if (isSatMethod) {
                    // For SAT method, validate SAT score
                    fieldsToValidate.push(['academicInfo', 'examScores', 'SAT']);
                } else if (isActMethod) {
                    // For ACT method, validate ACT score
                    fieldsToValidate.push(['academicInfo', 'examScores', 'ACT']);
                } else if (isIeltsMethod) {
                    // For IELTS method, validate IELTS score
                    fieldsToValidate.push(['academicInfo', 'examScores', 'IELTS']);
                }                await form.validateFields(fieldsToValidate);                  // Ensure allStepsData includes watched values which might not be in currentValues
                console.log('STEP1_SAVE: About to save step 1 data');
                console.log('STEP1_SAVE: currentValues.applicationChoice:', currentValues.applicationChoice);
                console.log('STEP1_SAVE: prev.applicationChoice:', allStepsData.applicationChoice);
                console.log('STEP1_SAVE: Watched values:', {
                    watchedUniversityId,
                    watchedMajorId, 
                    watchedAdmissionMethodId,
                    watchedSubjectGroupId,
                    watchedYear
                });
                
                setAllStepsData(prev => {
                    const mergedApplicationChoice = {
                        ...prev.applicationChoice,
                        ...currentValues.applicationChoice,
                        // Explicitly include watched values to ensure they're not lost
                        universityId: watchedUniversityId || currentValues.applicationChoice?.universityId || prev.applicationChoice?.universityId,
                        majorId: watchedMajorId || currentValues.applicationChoice?.majorId || prev.applicationChoice?.majorId,
                        admissionMethodId: watchedAdmissionMethodId || currentValues.applicationChoice?.admissionMethodId || prev.applicationChoice?.admissionMethodId,
                        subjectGroupId: watchedSubjectGroupId || currentValues.applicationChoice?.subjectGroupId || prev.applicationChoice?.subjectGroupId,
                        year: watchedYear || currentValues.applicationChoice?.year || prev.applicationChoice?.year
                    };
                    
                    console.log('STEP1_SAVE: Final merged applicationChoice:', mergedApplicationChoice);
                    
                    return {
                        ...prev,
                        academicInfo: currentValues.academicInfo ? {
                            ...prev.academicInfo,
                            ...currentValues.academicInfo,
                            examScores: {
                                ...prev.academicInfo?.examScores,
                                ...currentValues.academicInfo?.examScores
                            }
                        } : prev.academicInfo,
                        applicationChoice: mergedApplicationChoice
                    };
                });            } else if (currentStep === 2) {
                // Validate documents if needed and update allStepsData with all form data
                const currentFormValues = form.getFieldsValue();
                console.log('STEP2_SAVE: About to save step 2 data');
                console.log('STEP2_SAVE: currentFormValues.applicationChoice:', currentFormValues.applicationChoice);
                console.log('STEP2_SAVE: prev.applicationChoice before save:', allStepsData.applicationChoice);
                console.log('STEP2_SAVE: Watched values:', {
                    watchedUniversityId,
                    watchedMajorId, 
                    watchedAdmissionMethodId,
                    watchedSubjectGroupId,
                    watchedYear
                });
                
                setAllStepsData(prev => {
                    const finalApplicationChoice = {
                        // CRITICAL FIX: Prioritize watched values and previous good data over potentially corrupted form values
                        // This prevents the bug where form.getFieldsValue() returns undefined for application choice fields
                        universityId: watchedUniversityId || prev.applicationChoice?.universityId || currentFormValues.applicationChoice?.universityId,
                        majorId: watchedMajorId || prev.applicationChoice?.majorId || currentFormValues.applicationChoice?.majorId,
                        admissionMethodId: watchedAdmissionMethodId || prev.applicationChoice?.admissionMethodId || currentFormValues.applicationChoice?.admissionMethodId,
                        subjectGroupId: watchedSubjectGroupId || prev.applicationChoice?.subjectGroupId || currentFormValues.applicationChoice?.subjectGroupId,
                        year: watchedYear || prev.applicationChoice?.year || currentFormValues.applicationChoice?.year
                    };
                    
                    console.log('STEP2_SAVE: Final applicationChoice being saved:', finalApplicationChoice);
                    
                    return {
                        ...prev,
                        personalInfo: { ...prev.personalInfo, ...currentFormValues.personalInfo },
                        academicInfo: { 
                            ...prev.academicInfo, 
                            ...currentFormValues.academicInfo,
                            examScores: {
                                ...prev.academicInfo?.examScores,
                                ...currentFormValues.academicInfo?.examScores
                            }
                        },
                        applicationChoice: finalApplicationChoice
                    };
                });
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
    };    const prevStep = () => { 
        console.log('PREV_STEP: Going back from step', currentStep, 'to', currentStep - 1);
        console.log('PREV_STEP: Current allStepsData:', allStepsData);
        
        if (currentStep === 1) {
            // Going back to personal info step - only set personal info, don't touch application choice
            form.setFieldsValue({ personalInfo: allStepsData.personalInfo });
        } else if (currentStep === 2) {
            // Going back to academic/choice step - preserve current application choice data
            const preservedApplicationChoice = {
                ...allStepsData.applicationChoice,
                // Preserve any current watched values to prevent corruption
                universityId: watchedUniversityId || allStepsData.applicationChoice?.universityId,
                majorId: watchedMajorId || allStepsData.applicationChoice?.majorId,
                admissionMethodId: watchedAdmissionMethodId || allStepsData.applicationChoice?.admissionMethodId,
                subjectGroupId: watchedSubjectGroupId || allStepsData.applicationChoice?.subjectGroupId,
                year: watchedYear || allStepsData.applicationChoice?.year
            };
            
            console.log('PREV_STEP: Setting preserved application choice:', preservedApplicationChoice);
            
            form.setFieldsValue({ 
                academicInfo: allStepsData.academicInfo, 
                applicationChoice: preservedApplicationChoice
            });
        }
        setCurrentStep(currentStep - 1); 
    };
    
    // JSX Components for each step
    const personalInfoStepContent = (
        <Card title="Bước 1: Thông Tin Cá Nhân" className="shadow-none">
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
    );const academicAndChoiceStepContent = (
        <Card title="Bước 2: Thông Tin Học Vấn & Nguyện Vọng" className="shadow-none">
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
                 <Col xs={24} md={12}><Form.Item name={["applicationChoice", "year"]} label="Năm tuyển sinh" rules={[{required: true, message: "Vui lòng chọn năm tuyển sinh"}]}><Select placeholder="Chọn năm tuyển sinh" options={admissionYears} /></Form.Item></Col>                <Col xs={24} md={12}><Form.Item name={["applicationChoice", "universityId"]} label="Trường Đại học" rules={[{ required: true, message: 'Vui lòng chọn trường!' }]}><Select placeholder="Chọn trường Đại học" loading={loadingUniversities} allowClear showSearch filterOption={(input, option) => (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())}>{universities.map(uni => <AntOption key={uni.id} value={uni.id} label={uni.name}>{uni.name} ({uni.code})</AntOption>)}</Select></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name={["applicationChoice", "majorId"]} label="Ngành đăng ký" rules={[{ required: true, message: 'Vui lòng chọn ngành!' }]}><Select placeholder="Chọn ngành học" loading={loadingMajors} disabled={!watchedUniversityId || majors.length === 0} allowClear showSearch filterOption={(input, option) => (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())}>{majors.map(major => <AntOption key={major.id} value={major.id} label={major.name}>{major.name} ({major.code})</AntOption>)}</Select></Form.Item></Col>                <Col xs={24} md={12}><Form.Item name={["applicationChoice", "admissionMethodId"]} label="Phương thức xét tuyển" rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}><Select placeholder="Chọn phương thức" loading={loadingAdmissionInfo} disabled={!watchedMajorId || admissionMethods.length === 0} allowClear showSearch filterOption={(input, option) => (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())}>{admissionMethods.map(method => <AntOption key={method.id} value={method.id} label={method.name}>{method.name}</AntOption>)}</Select></Form.Item></Col>
                   {/* Hiển thị tổ hợp chỉ khi phương thức là THPT */}
                 { (() => {
                     const selectedMethod = admissionMethods.find(m => m.id === watchedAdmissionMethodId);
                     // Improved method detection logic
                     const isThptMethod = selectedMethod && (
                         selectedMethod.name?.includes('Tốt nghiệp THPT') || 
                         selectedMethod.name?.includes('THPTQG') ||
                         selectedMethod.name?.includes('thi THPT') ||
                         selectedMethod.code === 'THPTQG'
                     );
                     return isThptMethod && subjectGroups.length > 0 && (
                         <Col xs={24} md={12}>
                             <Form.Item name={["applicationChoice", "subjectGroupId"]} label="Tổ hợp xét tuyển" rules={[{ required: true, message: 'Vui lòng chọn tổ hợp!' }]}>
                                 <Select placeholder="Chọn tổ hợp môn" loading={loadingAdmissionInfo} disabled={!watchedAdmissionMethodId || subjectGroups.length === 0} allowClear showSearch filterOption={(input, option) => (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())}>
                                     {subjectGroups.map(group => <AntOption key={group.id} value={group.id} label={`${group.name} (${group.code})`}>{group.name} ({group.code})</AntOption>)}
                                 </Select>
                             </Form.Item>
                         </Col>
                     );
                 })() }
            </Row>
              {/* Hiển thị form nhập điểm dựa theo phương thức xét tuyển */}
            {(() => {
                const selectedMethod = admissionMethods.find(m => m.id === watchedAdmissionMethodId);
                
                // Improved method categorization logic
                const isThptMethod = selectedMethod && (
                    selectedMethod.name?.includes('Tốt nghiệp THPT') || 
                    selectedMethod.name?.includes('THPTQG') ||
                    selectedMethod.name?.includes('thi THPT') ||
                    selectedMethod.code === 'THPTQG'
                );
                
                const isHocBaMethod = selectedMethod && (
                    selectedMethod.name?.toLowerCase().includes('học bạ') ||
                    selectedMethod.name?.toLowerCase().includes('hoc ba') ||
                    selectedMethod.code === 'HOCBA'
                );
                
                const isDgnlMethod = selectedMethod && (
                    selectedMethod.name?.includes('Đánh giá năng lực') ||
                    selectedMethod.name?.includes('ĐGNL') ||
                    selectedMethod.name?.includes('năng lực') ||
                    selectedMethod.code?.includes('DGNL')
                );
                
                const isSatMethod = selectedMethod && (
                    selectedMethod.name?.includes('SAT') ||
                    selectedMethod.code === 'SAT'
                );
                
                const isActMethod = selectedMethod && (
                    selectedMethod.name?.includes('ACT') ||
                    selectedMethod.code === 'ACT'
                );
                
                const isIeltsMethod = selectedMethod && (
                    selectedMethod.name?.includes('IELTS') ||
                    selectedMethod.code === 'IELTS'
                );
                
                const isTuyenThangMethod = selectedMethod && (
                    selectedMethod.name?.toLowerCase().includes('tuyển thẳng') ||
                    selectedMethod.name?.toLowerCase().includes('học sinh giỏi') ||
                    selectedMethod.code?.includes('XTTHSG')
                );                
                if (isThptMethod && currentSubjectsForScores.length > 0) {
                    return (
                        <>
                            <AntTitle level={5} className="!mt-6 !mb-3 text-indigo-600">
                                Điểm thi THPT theo tổ hợp <AntText type="secondary">({subjectGroups.find(g=>g.id === watchedSubjectGroupId)?.name})</AntText>
                            </AntTitle>
                            <Row gutter={24}>
                                {currentSubjectsForScores.map(subject => ( 
                                    <Col xs={24} sm={12} md={8} key={subject}>
                                        <Form.Item name={["academicInfo", "examScores", subject]} label={`Điểm ${subject} (THPT)`} rules={[{ required: true, type: 'number', min:0, max:10, message: `Điểm ${subject} không hợp lệ (0-10)!` }]}>
                                            <InputNumber style={{width: '100%'}} step="0.01" placeholder={`Điểm thi ${subject}`} />
                                        </Form.Item>
                                    </Col> 
                                ))}
                            </Row>
                        </>
                    );
                } else if (isHocBaMethod && watchedAdmissionMethodId) {
                    return (
                        <>
                            <AntTitle level={5} className="!mt-6 !mb-3 text-indigo-600">
                                Điểm học bạ THPT (đã có ở trên)
                            </AntTitle>
                            <Alert message="Phương thức xét học bạ sử dụng điểm trung bình các lớp 10, 11, 12 đã nhập ở phần trên." type="info" showIcon />
                        </>
                    );
                } else if (isDgnlMethod && watchedAdmissionMethodId) {
                    return (
                        <>
                            <AntTitle level={5} className="!mt-6 !mb-3 text-indigo-600">
                                Điểm Đánh giá năng lực
                            </AntTitle>
                            <Row gutter={24}>
                                <Col xs={24} sm={12} md={8}>
                                    <Form.Item name={["academicInfo", "examScores", "DGNL"]} label="Điểm ĐGNL" rules={[{ required: true, type: 'number', min:0, max:150, message: 'Điểm ĐGNL không hợp lệ (0-150)!' }]}>
                                        <InputNumber style={{width: '100%'}} step="0.01" placeholder="Điểm ĐGNL" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                    );
                } else if (isSatMethod && watchedAdmissionMethodId) {
                    return (
                        <>
                            <AntTitle level={5} className="!mt-6 !mb-3 text-indigo-600">
                                Điểm thi SAT
                            </AntTitle>
                            <Row gutter={24}>
                                <Col xs={24} sm={12} md={8}>
                                    <Form.Item name={["academicInfo", "examScores", "SAT"]} label="Điểm SAT" rules={[{ required: true, type: 'number', min:400, max:1600, message: 'Điểm SAT không hợp lệ (400-1600)!' }]}>
                                        <InputNumber style={{width: '100%'}} step="1" placeholder="Điểm SAT" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                    );
                } else if (isActMethod && watchedAdmissionMethodId) {
                    return (
                        <>
                            <AntTitle level={5} className="!mt-6 !mb-3 text-indigo-600">
                                Điểm thi ACT
                            </AntTitle>
                            <Row gutter={24}>
                                <Col xs={24} sm={12} md={8}>
                                    <Form.Item name={["academicInfo", "examScores", "ACT"]} label="Điểm ACT" rules={[{ required: true, type: 'number', min:1, max:36, message: 'Điểm ACT không hợp lệ (1-36)!' }]}>
                                        <InputNumber style={{width: '100%'}} step="0.1" placeholder="Điểm ACT" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                    );
                } else if (isIeltsMethod && watchedAdmissionMethodId) {
                    return (
                        <>
                            <AntTitle level={5} className="!mt-6 !mb-3 text-indigo-600">
                                Điểm IELTS
                            </AntTitle>
                            <Row gutter={24}>
                                <Col xs={24} sm={12} md={8}>
                                    <Form.Item name={["academicInfo", "examScores", "IELTS"]} label="Điểm IELTS" rules={[{ required: true, type: 'number', min:0, max:9, message: 'Điểm IELTS không hợp lệ (0-9)!' }]}>
                                        <InputNumber style={{width: '100%'}} step="0.1" placeholder="Điểm IELTS" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                    );
                } else if (isTuyenThangMethod && watchedAdmissionMethodId) {
                    return (
                        <>
                            <AntTitle level={5} className="!mt-6 !mb-3 text-indigo-600">
                                Xét tuyển thẳng
                            </AntTitle>
                            <Alert message="Phương thức tuyển thẳng không yêu cầu nhập điểm thi. Vui lòng tải lên giấy chứng nhận học sinh giỏi hoặc minh chứng tuyển thẳng ở phần tài liệu." type="info" showIcon />                        </>
                    );
                } else if (watchedAdmissionMethodId && selectedMethod) {
                    // Fallback for other methods
                    return (
                        <>
                            <AntTitle level={5} className="!mt-6 !mb-3 text-indigo-600">
                                Thông tin bổ sung cho phương thức: {selectedMethod.name}
                            </AntTitle>
                            <Alert message={`Phương thức "${selectedMethod.name}" đã được chọn. Vui lòng kiểm tra yêu cầu cụ thể từ nhà trường và tải lên tài liệu minh chứng cần thiết.`} type="info" showIcon />
                        </>
                    );
                }
                
                return null; // Return null if no method is selected or matched
            })()}
         </Card>
    );    const documentsStepContent = ( 
        <Card title="Bước 3: Tải Lên Minh Chứng" className="shadow-none">
            <AntParagraph>Vui lòng tải lên các giấy tờ minh chứng cần thiết (Học bạ, CCCD, Giấy ưu tiên,...). Các file phải rõ ràng, định dạng PDF, JPG, PNG và dung lượng không quá 5MB mỗi file.</AntParagraph>
            <Form.Item name="currentDocumentType" label="Loại giấy tờ hiện tại" rules={[{ required: true, message: 'Vui lòng chọn loại giấy tờ!'}]}><Select placeholder="Chọn loại giấy tờ"><AntOption value="hoc_ba">Học bạ THPT</AntOption><AntOption value="cccd">CCCD/CMND</AntOption><AntOption value="giay_tot_nghiep_tam_thoi">Giấy CNSN Tạm thời</AntOption><AntOption value="giay_uu_tien">Giấy tờ Ưu tiên</AntOption><AntOption value="khac">Minh chứng khác</AntOption></Select></Form.Item>
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
            </div>            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onValuesChange={handleFormValuesChange}
                initialValues={convertInitialValues(initialFormData)}
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
                    </div>                </div>
            </Form>
        </div>
    );
};

export default CandidateSubmitApplicationPage;
