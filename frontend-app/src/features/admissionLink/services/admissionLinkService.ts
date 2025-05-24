import axiosInstance from '../../../lib/axios';

const mapAdmissionLinkBEToFE = (linkBE: AdmissionLinkBE): AdmissionLinkFE => {
  const placeholderMajor: MajorFE = { id: 'N/A_MAJOR', name: 'Ngành không xác định', code: 'N/A', universityId: 'N/A', universityName: 'N/A' };
  const placeholderMethod: AdmissionMethodFE = { id: 'N/A_METHOD', name: 'PTXT không xác định' };
  const placeholderGroup: SubjectGroupFE = { id: 'N/A_GROUP_OR_NONE', name: 'Không yêu cầu tổ hợp', code: '', subjects: [] };

  let major: MajorFE;
  if (typeof linkBE.major === 'object' && linkBE.major !== null) {
      const beMajor = linkBE.major as MajorBE; // Ép kiểu để truy cập _id
      major = { 
          ...beMajor, 
          id: beMajor._id, 
          universityId: typeof beMajor.university === 'string' ? beMajor.university : (typeof beMajor.university === 'object' && beMajor.university !== null ? (beMajor.university as UniversityFE)._id || (beMajor.university as UniversityFE).id : 'N/A'),
          universityName: typeof beMajor.university === 'object' && beMajor.university !== null ? (beMajor.university as UniversityFE).name : undefined,
      };
  } else if (typeof linkBE.major === 'string') {
      major = { ...placeholderMajor, id: linkBE.major, name: `ID Ngành: ${linkBE.major.slice(-6)}` };
  } else {
      major = placeholderMajor;
  }
  // Đảm bảo universityId và universityName được lấy đúng từ major (nếu major được populate với university)
  // Hoặc nếu BE trả về university trực tiếp trong linkBE
  if (linkBE.university && typeof linkBE.university === 'object' && linkBE.university !== null) {
      major.universityId = (linkBE.university as UniversityFE)._id || (linkBE.university as UniversityFE).id;
      major.universityName = (linkBE.university as UniversityFE).name;
  }


  let admissionMethod: AdmissionMethodFE;
  if (typeof linkBE.admissionMethod === 'object' && linkBE.admissionMethod !== null) {
      const beMethod = linkBE.admissionMethod as AdmissionMethodBE;
      admissionMethod = { ...beMethod, id: beMethod._id };
  } else if (typeof linkBE.admissionMethod === 'string') {
      admissionMethod = { ...placeholderMethod, id: linkBE.admissionMethod, name: `ID PTXT: ${linkBE.admissionMethod.slice(-6)}` };
  } else {
      admissionMethod = placeholderMethod;
  }

  let subjectGroup: SubjectGroupFE;
  if (typeof linkBE.subjectGroup === 'object' && linkBE.subjectGroup !== null) {
      const beGroup = linkBE.subjectGroup as SubjectGroupBE;
      subjectGroup = { ...beGroup, id: beGroup._id, subjects: beGroup.subjects || [] };
  } else if (typeof linkBE.subjectGroup === 'string') {
      subjectGroup = { ...placeholderGroup, id: linkBE.subjectGroup, name: `ID Tổ hợp: ${linkBE.subjectGroup.slice(-6)}` };
  } else { 
      subjectGroup = placeholderGroup;
  }

  return {
      id: linkBE._id,
      major: major, // Trả về object MajorFE đầy đủ
      majorId: major.id,
      majorName: major.name,
      majorCode: major.code,
      universityId: major.universityId,
      universityName: major.universityName,
      admissionMethod: admissionMethod, // Trả về object AdmissionMethodFE đầy đủ
      admissionMethodId: admissionMethod.id,
      admissionMethodName: admissionMethod.name,
      subjectGroup: subjectGroup, // Trả về object SubjectGroupFE đầy đủ
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