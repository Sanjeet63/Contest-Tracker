import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD0TD_nW_O4f4QVeUZuYNGw5KwciBWl53U",
  authDomain: "cp-hub-3990c.firebaseapp.com",
  projectId: "cp-hub-3990c",
  storageBucket: "cp-hub-3990c.firebasestorage.app",
  messagingSenderId: "683189117204",
  appId: "1:683189117204:web:a214b3041ecca087826201",
  measurementId: "G-979E8FNLQ6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
