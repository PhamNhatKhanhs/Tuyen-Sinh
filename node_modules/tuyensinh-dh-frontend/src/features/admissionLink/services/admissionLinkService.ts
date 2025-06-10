import axiosInstance from '../../../lib/axios';
import type { AdmissionLinkBE, AdmissionLinkFE } from '../types';
import type { MajorFE, MajorBE } from '../../major/types';
import type { AdmissionMethodFE, AdmissionMethodBE } from '../../admissionMethod/types';
import type { SubjectGroupFE, SubjectGroupBE } from '../../subjectGroup/types';
import type { UniversityFE } from '../../university/types';

// Định nghĩa GetAdmissionLinksResponse nếu chưa có
interface GetAdmissionLinksResponse {
  success: boolean;
  data?: AdmissionLinkBE[];
  message?: string;
}

const mapAdmissionLinkBEToFE = (linkBE: AdmissionLinkBE): AdmissionLinkFE => {
  const placeholderMajor: MajorFE = { id: 'N/A_MAJOR', name: 'Ngành không xác định', code: 'N/A', universityId: 'N/A', universityName: 'N/A' };
  const placeholderMethod: AdmissionMethodFE = { id: 'N/A_METHOD', name: 'PTXT không xác định' };
  const placeholderGroup: SubjectGroupFE = { id: 'N/A_GROUP_OR_NONE', name: 'Không yêu cầu tổ hợp', code: '', subjects: [] };

  let major: MajorFE;
  if (typeof linkBE.major === 'object' && linkBE.major !== null && '_id' in linkBE.major && 'university' in linkBE.major) {
      const beMajor = linkBE.major as MajorBE;
      let universityId = 'N/A';
      let universityName = undefined;
      if (typeof beMajor.university === 'string') {
          universityId = beMajor.university;
      } else if (typeof beMajor.university === 'object' && beMajor.university !== null && '_id' in beMajor.university) {
          universityId = beMajor.university._id;
          universityName = beMajor.university.name;
      }
      major = { 
          id: beMajor._id, 
          name: beMajor.name,
          code: beMajor.code,
          universityId,
          universityName,
          description: beMajor.description,
          admissionQuota: beMajor.admissionQuota,
          isActive: beMajor.isActive,
      };
  } else if (typeof linkBE.major === 'object' && linkBE.major !== null && 'id' in linkBE.major) {
      major = linkBE.major as MajorFE;
  } else if (typeof linkBE.major === 'string') {
      major = { ...placeholderMajor, id: linkBE.major, name: `ID Ngành: ${linkBE.major.slice(-6)}` };
  } else {
      major = placeholderMajor;
  }

  let admissionMethod: AdmissionMethodFE;
  if (typeof linkBE.admissionMethod === 'object' && linkBE.admissionMethod !== null && '_id' in linkBE.admissionMethod) {
      const beMethod = linkBE.admissionMethod as AdmissionMethodBE;
      admissionMethod = { id: beMethod._id, name: beMethod.name, code: beMethod.code, description: beMethod.description, isActive: beMethod.isActive };
  } else if (typeof linkBE.admissionMethod === 'object' && linkBE.admissionMethod !== null && 'id' in linkBE.admissionMethod) {
      admissionMethod = linkBE.admissionMethod as AdmissionMethodFE;
  } else if (typeof linkBE.admissionMethod === 'string') {
      admissionMethod = { ...placeholderMethod, id: linkBE.admissionMethod, name: `ID PTXT: ${linkBE.admissionMethod.slice(-6)}` };
  } else {
      admissionMethod = placeholderMethod;
  }

  let subjectGroup: SubjectGroupFE;
  if (typeof linkBE.subjectGroup === 'object' && linkBE.subjectGroup !== null && '_id' in linkBE.subjectGroup) {
      const beGroup = linkBE.subjectGroup as SubjectGroupBE;
      subjectGroup = { id: beGroup._id, code: beGroup.code, name: beGroup.name, subjects: beGroup.subjects, isActive: beGroup.isActive };
  } else if (typeof linkBE.subjectGroup === 'object' && linkBE.subjectGroup !== null && 'id' in linkBE.subjectGroup) {
      subjectGroup = linkBE.subjectGroup as SubjectGroupFE;
  } else if (typeof linkBE.subjectGroup === 'string') {
      subjectGroup = { ...placeholderGroup, id: linkBE.subjectGroup, name: `ID Tổ hợp: ${linkBE.subjectGroup.slice(-6)}` };
  } else { 
      subjectGroup = placeholderGroup;
  }

  return {
      id: linkBE._id,
      majorId: major.id,
      majorName: major.name,
      majorCode: major.code,
      universityId: major.universityId,
      universityName: major.universityName,
      admissionMethodId: admissionMethod.id,
      admissionMethodName: admissionMethod.name,
      subjectGroupId: subjectGroup.id,
      subjectGroupName: subjectGroup.name,
      subjectGroupCode: subjectGroup.code,
      year: linkBE.year,
      minScoreRequired: linkBE.minScoreRequired,
      isActive: linkBE.isActive,
  };
};


const admissionLinkService = {
getLinks: async (params: { majorId?: string; admissionMethodId?: string; universityId?: string; year?: number }): Promise<{ success: boolean; data?: AdmissionLinkFE[]; message?: string }> => {
  try {
    const response = await axiosInstance.get<GetAdmissionLinksResponse>('/admission-links', { params });
    if (response.data.success && response.data.data) {
      const linksFE: AdmissionLinkFE[] = response.data.data.map(mapAdmissionLinkBEToFE); // SỬ DỤNG HÀM MAP
      return { success: true, data: linksFE };
    }
    return { success: false, message: response.data.message || "Không thể tải danh sách liên kết tuyển sinh." };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải danh sách liên kết tuyển sinh." };
  }
},
};
export default admissionLinkService;