// Firebase Configuration
// Replace these values with your actual Firebase project configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC6QuD-w_x7AEmG7a9EIrn64HMb5UrUgME",
    authDomain: "ayurchain-sih.firebaseapp.com",
    projectId: "ayurchain-sih",
    storageBucket: "ayurchain-sih.firebasestorage.app",
    messagingSenderId: "199377444131",
    appId: "1:199377444131:web:3f22ada238d767b5a90096",
    measurementId: "G-ZNJEPLQVNT"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
