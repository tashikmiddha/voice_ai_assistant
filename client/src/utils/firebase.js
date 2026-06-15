import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ai-chatbot-b634f.firebaseapp.com",
  projectId: "ai-chatbot-b634f",
  storageBucket: "ai-chatbot-b634f.firebasestorage.app",
  messagingSenderId: "319552762776",
  appId: "1:319552762776:web:85158b79642832f2ccf1ed",
  measurementId: "G-3M6NMG76RQ"
};


const app = initializeApp(firebaseConfig);
let analytics = null;

if (typeof window !== "undefined" && import.meta.env.PROD) {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      analytics = null;
    });
}

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, analytics };