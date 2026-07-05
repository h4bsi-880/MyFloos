import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDIMHYAbKcOZ7_MPfr8hXrlaux1iEvM5u8",
  authDomain: "floostrack.firebaseapp.com",
  projectId: "floostrack",
  storageBucket: "floostrack.firebasestorage.app",
  messagingSenderId: "131787416323",
  appId: "1:131787416323:web:0a376b6db66baf4624bf36",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});