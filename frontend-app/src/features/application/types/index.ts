import { UniversityFE } from '../../university/types';
import { MajorFE } from '../../major/types';
import { AdmissionMethodFE } from '../../admissionMethod/types';
import { SubjectGroupFE } from '../../subjectGroup/types';
import { UploadedFileResponse } from '../../upload/types';
import type { User } from '../../auth/types';

export interface CandidateProfileSnapshot { // Định nghĩa rõ hơn cho snapshot
  fullName?: string;
  dob?: string; // ISO date string or formatted
  gender?: string;
  idNumber?: string;
  phoneNumber?: string;
  email?: string;
  permanentAddress?: string;
  priorityArea?: string;
  priorityObjects?: string[];
  highSchoolName?: string;
  graduationYear?: number;
  gpa10?: number;
  gpa11?: number;
  gpa12?: number;
  conduct10?: string;
  conduct11?: string;
  conduct12?: string;
  // Thêm các trường khác nếu BE trả về
}

export interface ApplicationDetailBE { 
  _id: string;
  candidate: User | string; 
  candidateProfileSnapshot: CandidateProfileSnapshot; // Sử dụng interface rõ ràng
  university: UniversityFE | string; 
  major: MajorFE | string;
  admissionMethod: AdmissionMethodFE | string;
  subjectGroup?: SubjectGroupFE | string;
  year: number;
  submissionDate: string; 
  status: 'pending' | 'processing' | 'additional_required' | 'approved' | 'rejected' | 'cancelled';
  examScores?: { [subject: string]: number };
  documents: UploadedFileResponse[]; 
  adminNotes?: string;
  lastProcessedBy?: User | string; 
  processedAt?: string; 
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationAdminListItemFE {
  id: string; 
  candidateName?: string;
  candidateEmail?: string;
  universityName?: string;
  universityCode?: string;
  majorName?: string;
  majorCode?: string;
  submissionDate: string; 
  status: ApplicationDetailBE['status'];
  year: number;
}