// app/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvcrjPk0Na1nUUYpmSV4cjthRyqO3aQ2o", 
  authDomain: "loginauthentication-a03a4.firebaseapp.com", 
  projectId: "loginauthentication-a03a4",                
  storageBucket: "loginauthentication-a03a4.firebasestorage.app", 
  messagingSenderId: "208116214525",                     
  appId: "1:208116214525:ios:9e1513d0fdf428ba90ac94"    
};

const app = initializeApp(firebaseConfig);

// Firebase Auth (pa persistence custom, funksionon automatikisht në web)
export const auth = getAuth(app);

// Firestore database
export const db = getFirestore(app);
