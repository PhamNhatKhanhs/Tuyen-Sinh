import { MajorFE } from '../../major/types';
import { AdmissionMethodFE } from '../../admissionMethod/types';
import { SubjectGroupFE } from '../../subjectGroup/types';

export interface AdmissionLinkBE {
  _id: string;
  major: MajorFE | string; // Có thể là ID hoặc populated object từ BE
  admissionMethod: AdmissionMethodFE | string;
  subjectGroup: SubjectGroupFE | string;
  university?: any; // Backend có thể trả về university thông qua major populate
  year: number;
  minScoreRequired?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface AdmissionLinkFE {
  id: string;
  majorId: string;
  majorName: string;
  majorCode?: string;
  universityId?: string; // Lấy từ major.universityId
  universityName?: string; // Lấy từ major.universityName
  admissionMethodId: string;
  admissionMethodName: string;
  subjectGroupId: string;
  subjectGroupName: string;
  subjectGroupCode?: string;
  year: number;
  minScoreRequired?: number;
  isActive?: boolean;
}
