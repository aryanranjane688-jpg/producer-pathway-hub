// Application Types for Firebase Integration

export interface Application {
  id: string;
  fullName: string;
  email: string;
  cooperativeName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submissionDate: string;
  reviewDate?: string;
  reviewedBy?: string;
  notes?: string;
  aadhaarFileUrl?: string;
  aadhaarFileName?: string;
  landRecordFileUrl?: string;
  landRecordFileName?: string;
}

export interface ApplicationFormData {
  fullName: string;
  email: string;
  cooperativeName: string;
  aadhaarFile: File | null;
  landRecordFile: File | null;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'reviewer';
  createdAt: string;
}

export interface FileUpload {
  url: string;
  fileName: string;
  uploadedAt: string;
  fileSize: number;
}
