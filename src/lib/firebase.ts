import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBiXsYR2_FU9mehsz3_SdFgqp6C1J15EE8",
  authDomain: "pomodoro-app-42045.firebaseapp.com",
  projectId: "pomodoro-app-42045",
  storageBucket: "pomodoro-app-42045.firebasestorage.app",
  messagingSenderId: "393382712896",
  appId: "1:393382712896:web:0666a454db08fcf932b1a5",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
