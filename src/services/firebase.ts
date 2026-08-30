import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyDHo7Yehpd59DsN50wYj20NosbBeMVFGak",
  authDomain: "hr-cortado.firebaseapp.com",
  projectId: "hr-cortado",
  storageBucket: "hr-cortado.firebasestorage.app",
  messagingSenderId: "494203077942",
  appId: "1:494203077942:web:5e702fd179ccc27e039f97",
  measurementId: "G-9EP6C12557"
};

// Initialize or reuse Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
