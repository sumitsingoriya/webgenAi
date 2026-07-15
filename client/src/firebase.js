// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "webgenai-aa836.firebaseapp.com",
  projectId: "webgenai-aa836",
  storageBucket: "webgenai-aa836.firebasestorage.app",
  messagingSenderId: "976225104684",
  appId: "1:976225104684:web:560ea42e4f1a932172b289"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider