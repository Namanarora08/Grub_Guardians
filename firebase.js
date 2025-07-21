// firebase.js or firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6oNrlnNAD0HDTqYC4J2CNBbHGIFBDXl4",
  authDomain: "grubguardians2.firebaseapp.com",
  projectId: "grubguardians2",
  storageBucket: "grubguardians2.appspot.com",
  messagingSenderId: "246709876306",
  appId: "1:246709876306:web:0e2fb2f3af8865be43d18b"
};

// ✅ Fix: initialize only if no app exists
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
