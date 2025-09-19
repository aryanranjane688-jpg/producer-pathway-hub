# Firebase Setup Instructions

## 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable the following services:
   - **Firestore Database** (for storing application data)
   - **Storage** (for file uploads)
   - **Authentication** (optional, for admin login)

## 2. Firestore Database Configuration

Create the following collections in Firestore:

### Collections:
- `applications` - Stores producer applications
- `admin_users` - Stores admin user data (optional)

### Firestore Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Applications collection
    match /applications/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Admin users collection
    match /admin_users/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 3. Storage Configuration

### Storage Security Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /applications/{applicationId}/documents/{fileName} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 4. Update Firebase Configuration

Replace the configuration in `src/lib/firebase.ts` with your actual Firebase project details:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 5. Database Schema

### Application Document Structure:
```typescript
{
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 6. Installation and Setup

1. Install dependencies:
```bash
npm install
```

2. Update Firebase configuration in `src/lib/firebase.ts`

3. Start the development server:
```bash
npm run dev
```

## 7. Features Implemented

### ✅ Completed Features:
- Firebase Firestore integration for storing applications
- Firebase Storage integration for file uploads
- Admin dashboard with real-time application listing
- Application form with file upload to Firebase
- Admin approval/rejection workflow
- Document viewing functionality
- Application status management

### 🔧 Key Components Updated:
- `AdminDashboard.tsx` - Now fetches from Firebase
- `ApplicationForm.tsx` - Stores data and files in Firebase
- `ApplicantDetail.tsx` - Full CRUD operations with Firebase
- `firebaseService.ts` - Complete service layer for Firebase operations
- `firebase.ts` - Firebase configuration and initialization

## 8. Testing

1. Submit a test application through the form
2. Check Firestore for the new application document
3. Check Storage for uploaded files
4. Use admin dashboard to approve/reject applications
5. Verify status updates in Firestore

## 9. Production Considerations

- Set up proper Firebase security rules
- Configure Firebase Authentication for admin users
- Set up email notifications for application status changes
- Implement proper error handling and logging
- Set up Firebase monitoring and analytics
- Configure backup and data retention policies
