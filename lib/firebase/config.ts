import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDxKse6Z4Pi1dsaaQBsHZ6x5t25Noyya1s",
  authDomain: "academy-69b21.firebaseapp.com",
  projectId: "academy-69b21",
  storageBucket: "academy-69b21.firebasestorage.app",
  messagingSenderId: "565015294582",
  appId: "1:565015294582:web:2b15a899fcd3cf3deea557",
  measurementId: "G-C83P7H6XZH"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, db, storage, analytics };
