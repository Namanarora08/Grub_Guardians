// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyA9W8cIgiYMgr9SjYUvB5FZ78jiT6dFess",
  authDomain: "grubguardians.firebaseapp.com",
  projectId: "grubguardians",
  storageBucket: "grubguardians.firebasestorage.app",
  messagingSenderId: "734826064088",
  appId: "1:734826064088:web:931aba7beeead88469cfad",
  measurementId: "G-JDNJGH27LG"
};

// Avoid re-initializing Firebase if already initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

const db = getFirestore(app)
const storage = getStorage(app)

export { app, db, storage }
