// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASNdvS1PpHv4hEhMKUMJewEr4M-IDlLXM",
  authDomain: "community-engagement-dd3dc.firebaseapp.com",
  projectId: "community-engagement-dd3dc",
  storageBucket: "community-engagement-dd3dc.appspot.com",
  messagingSenderId: "603315450071",
  appId: "1:603315450071:web:c7dbea7c4cf5b03ea5c092",
  measurementId: "G-0G08R7W36W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log(analytics)

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
export const db = getFirestore(app);
export const storage = getStorage(app);
