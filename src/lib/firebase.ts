import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmzjgIsqDv_CFzv4nwd_Zg1j2V79R7Qus",
  authDomain: "blue-bird-pictures-studio.firebaseapp.com",
  projectId: "blue-bird-pictures-studio",
  storageBucket: "blue-bird-pictures-studio.firebasestorage.app",
  messagingSenderId: "627225426708",
  appId: "1:627225426708:web:3c9b8570ab16c1756e6001"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
