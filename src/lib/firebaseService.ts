import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';
import { Application, FileUpload } from '@/types/application';

// Collections
const APPLICATIONS_COLLECTION = 'applications';
const ADMIN_COLLECTION = 'admin_users';

// Application Services
export const applicationService = {
  // Create a new application
  async createApplication(applicationData: Omit<Application, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), {
        ...applicationData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating application:', error);
      throw new Error('Failed to create application');
    }
  },

  // Get all applications
  async getAllApplications(): Promise<Application[]> {
    try {
      const q = query(
        collection(db, APPLICATIONS_COLLECTION),
        orderBy('submissionDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Application[];
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw new Error('Failed to fetch applications');
    }
  },

  // Get application by ID
  async getApplicationById(id: string): Promise<Application | null> {
    try {
      const docRef = doc(db, APPLICATIONS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Application;
      }
      return null;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw new Error('Failed to fetch application');
    }
  },

  // Update application status
  async updateApplicationStatus(
    id: string, 
    status: Application['status'], 
    reviewedBy?: string,
    notes?: string
  ): Promise<void> {
    try {
      const docRef = doc(db, APPLICATIONS_COLLECTION, id);
      await updateDoc(docRef, {
        status,
        reviewDate: new Date().toISOString(),
        reviewedBy,
        notes,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating application:', error);
      throw new Error('Failed to update application');
    }
  },

  // Update application with file URLs
  async updateApplicationFiles(
    id: string,
    aadhaarFileUrl: string,
    aadhaarFileName: string,
    landRecordFileUrl: string,
    landRecordFileName: string
  ): Promise<void> {
    try {
      const docRef = doc(db, APPLICATIONS_COLLECTION, id);
      await updateDoc(docRef, {
        aadhaarFileUrl,
        aadhaarFileName,
        landRecordFileUrl,
        landRecordFileName,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating application files:', error);
      throw new Error('Failed to update application files');
    }
  },

  // Get applications by status
  async getApplicationsByStatus(status: Application['status']): Promise<Application[]> {
    try {
      const q = query(
        collection(db, APPLICATIONS_COLLECTION),
        where('status', '==', status),
        orderBy('submissionDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Application[];
    } catch (error) {
      console.error('Error fetching applications by status:', error);
      throw new Error('Failed to fetch applications');
    }
  }
};

// File Upload Services
export const fileUploadService = {
  // Upload file to Firebase Storage
  async uploadFile(file: File, path: string): Promise<FileUpload> {
    try {
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        url: downloadURL,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        fileSize: file.size
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  },

  // Delete file from Firebase Storage
  async deleteFile(url: string): Promise<void> {
    try {
      const fileRef = ref(storage, url);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  },

  // Upload application documents
  async uploadApplicationDocuments(
    aadhaarFile: File, 
    landRecordFile: File, 
    applicationId: string
  ): Promise<{ aadhaarFile: FileUpload; landRecordFile: FileUpload }> {
    try {
      const [aadhaarUpload, landRecordUpload] = await Promise.all([
        this.uploadFile(aadhaarFile, `applications/${applicationId}/documents`),
        this.uploadFile(landRecordFile, `applications/${applicationId}/documents`)
      ]);

      return {
        aadhaarFile: aadhaarUpload,
        landRecordFile: landRecordUpload
      };
    } catch (error) {
      console.error('Error uploading application documents:', error);
      throw new Error('Failed to upload documents');
    }
  }
};

// Admin Services
export const adminService = {
  // Create admin user
  async createAdminUser(adminData: Omit<any, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, ADMIN_COLLECTION), {
        ...adminData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating admin user:', error);
      throw new Error('Failed to create admin user');
    }
  },

  // Get admin user by email
  async getAdminByEmail(email: string): Promise<any | null> {
    try {
      const q = query(
        collection(db, ADMIN_COLLECTION),
        where('email', '==', email)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching admin user:', error);
      throw new Error('Failed to fetch admin user');
    }
  }
};
