// src/Firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  // ✅ Add Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDVBsP-oadfrK8J2W7ikLxivDb1u7psqqA",
  authDomain: "dailymotion-28f13.firebaseapp.com",
  projectId: "dailymotion-28f13",
  storageBucket: "dailymotion-28f13.firebasestorage.app",
  messagingSenderId: "624287339591",
  appId: "1:624287339591:web:1910c10f160eb9341c0d62",
  measurementId: "G-GZ2LZQ8G3J"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);  // ✅ Needed for storing/fetching watchlist

export { auth, db };
