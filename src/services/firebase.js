import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCPYzm61RszyEIYmDeHS3n8OuGUFacw8EU",
    authDomain: "study-planner-2026.firebaseapp.com",
    projectId: "study-planner-2026",
    storageBucket: "study-planner-2026.firebasestorage.app",
    messagingSenderId: "312966878382",
    appId: "1:312966878382:web:482aabad26e251f5b5893f",
    measurementId: "G-6QLVV23FM8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
