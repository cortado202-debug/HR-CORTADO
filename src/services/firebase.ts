import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  projectId: "hr-cortado",
  appId: "1:494203077942:web:74e5030e813846d0039f97",
  apiKey: "AIzaSyDHo7Yehpd59DsN50wYj20NosbBeMVFGak",
  authDomain: "hr-cortado.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-syppayrollattend-24bbfac8-c945-4bc8-b738-3bbd63c0d652",
  storageBucket: "hr-cortado.firebasestorage.app",
  messagingSenderId: "494203077942",
};

// Initialize or reuse Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Target the specific firestore database ID or fallback
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

