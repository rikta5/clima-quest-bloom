import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5tIypdgk-eDWjHLivnwpE8l8wcvIa_f0",
  authDomain: "verdecodice.firebaseapp.com",
  projectId: "verdecodice",
  storageBucket: "verdecodice.firebasestorage.app",
  messagingSenderId: "493764429989",
  appId: "1:493764429989:web:5381a3eb38cced9077a54c",
  measurementId: "G-EWY54M8L5N"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
