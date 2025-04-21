// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "home-hub-61a9b.firebaseapp.com",
  projectId: "home-hub-61a9b",
  storageBucket: "home-hub-61a9b.firebasestorage.app",
  messagingSenderId: "568359830673",
  appId: "1:568359830673:web:4a7556f2a1ea8f1d64ab30"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);