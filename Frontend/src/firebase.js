import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDO9Torg62BHahrtFjk8bnO2yhrHCW8Qys",
  authDomain: "tryfit-2656b.firebaseapp.com",
  projectId: "tryfit-2656b",
  storageBucket: "tryfit-2656b.firebasestorage.app",
  messagingSenderId: "662136630081",
  appId: "1:662136630081:web:ebc1a3f9a87a1d08844fc0",
  measurementId: "G-W80920DQNY"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);