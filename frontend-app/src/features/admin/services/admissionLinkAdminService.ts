// File này dùng cho admin, nhưng logic map có thể dùng chung.
// Đảm bảo admissionLinkService.ts (public) cũng có logic map tương tự.
import axiosInstance from '../../../lib/axios';
// import { AdmissionLinkBE, AdmissionLinkFE, AdmissionLinkFormData } from '../../admissionLink/types'; // Đã import ở trên
// import { MajorFE } from '../../major/types'; // Đã import ở trên
// import { AdmissionMethodFE } from '../../admissionMethod/types'; // Đã import ở trên
// import { SubjectGroupFE } from '../../subjectGroup/types'; // Đã import ở trên


interface AdminAdmissionLinkResponse { /* ... */ }
interface AdminGetAllAdmissionLinksResponse { /* ... */ }
export interface AdmissionLinkFormData { /* ... */ }

// CẬP NHẬT HÀM MAP NÀY CHO CẢ admissionLinkService.ts (public)
const mapAdmissionLinkBEToFE = (linkBE: AdmissionLinkBE): AdmissionLinkFE => {
    const placeholderMajor: MajorFE = { id: 'N/A_MAJOR', name: 'Ngành không xác định', code: 'N/A', universityId: 'N/A' };
    const placeholderMethod: AdmissionMethodFE = { id: 'N/A_METHOD', name: 'PTXT không xác định' };
    const placeholderGroup: SubjectGroupFE = { id: 'N/A_GROUP_OR_NONE', name: 'Không yêu cầu tổ hợp', code: '', subjects: [] };

    let major: MajorFE;
    if (typeof linkBE.major === 'object' && linkBE.major !== null) {
        major = { ...linkBE.major, id: (linkBE.major as MajorFE)._id || (linkBE.major as MajorFE).id };
    } else if (typeof linkBE.major === 'string') {
        major = { id: linkBE.major, name: `ID: ${linkBE.major}`, code: 'N/A', universityId: 'N/A' };
    } else {
        major = placeholderMajor;
    }
     // Đảm bảo universityId và universityName được lấy đúng từ major (nếu major được populate với university)
    if (typeof linkBE.major === 'object' && linkBE.major && typeof (linkBE.major as MajorFE).university === 'object' && (linkBE.major as MajorFE).university !== null) {
        const uni = (linkBE.major as MajorFE).university as UniversityFE; // Giả sử UniversityFE có id, name, code
        major.universityId = uni.id || (uni as any)._id;
        major.universityName = uni.name;
    }


    let admissionMethod: AdmissionMethodFE;
    if (typeof linkBE.admissionMethod === 'object' && linkBE.admissionMethod !== null) {
        admissionMethod = { ...linkBE.admissionMethod, id: (linkBE.admissionMethod as AdmissionMethodFE)._id || (linkBE.admissionMethod as AdmissionMethodFE).id };
    } else if (typeof linkBE.admissionMethod === 'string') {
        admissionMethod = { id: linkBE.admissionMethod, name: `ID: ${linkBE.admissionMethod}` };
    } else {
        admissionMethod = placeholderMethod;
    }

    let subjectGroup: SubjectGroupFE;
    if (typeof linkBE.subjectGroup === 'object' && linkBE.subjectGroup !== null) {
        subjectGroup = { ...linkBE.subjectGroup, id: (linkBE.subjectGroup as SubjectGroupFE)._id || (linkBE.subjectGroup as SubjectGroupFE).id, subjects: (linkBE.subjectGroup as SubjectGroupFE).subjects || [] };
    } else if (typeof linkBE.subjectGroup === 'string') {
        subjectGroup = { id: linkBE.subjectGroup, name: `ID: ${linkBE.subjectGroup}`, code: 'N/A', subjects: [] };
    } else { // Nếu linkBE.subjectGroup là null hoặc undefined
        subjectGroup = placeholderGroup;
    }
  
    return {
        id: linkBE._id,
        major: major,
        majorId: major.id,
        majorName: major.name,
        majorCode: major.code,
        universityId: major.universityId,
        universityName: major.universityName,
        admissionMethod: admissionMethod,
        admissionMethodId: admissionMethod.id,
        admissionMethodName: admissionMethod.name,
        subjectGroup: subjectGroup,
        subjectGroupId: subjectGroup.id,
        subjectGroupName: subjectGroup.name,
        subjectGroupCode: subjectGroup.code,
        year: linkBE.year,
        minScoreRequired: linkBE.minScoreRequired,
        isActive: linkBE.isActive,
    };
};

const admissionLinkAdminService = { /* ... Các hàm giữ nguyên, chỉ đảm bảo dùng mapAdmissionLinkBEToFE ... */ };
export default admissionLinkAdminService;