import { useEffect, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('🔥 Firebase user:', user); // Add this
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }),
    });
  
    console.log('📡 Backend response:', await res.json()); // Add this
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-white/20"
      >
        <h1 className="text-3xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          Welcome Back!
        </h1>
        <p className="text-gray-300 mb-6">Sign in to continue to CP Hub 🚀</p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <motion.button
          onClick={handleGoogleLogin}
          whileHover={{ scale: 1.05 }}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-5 rounded-xl shadow-md transition-all duration-300 ease-in-out w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img
            src="https://img.icons8.com/color/24/000000/google-logo.png"
            alt="google-icon"
          />
          {loading ? "Signing in..." : "Sign in with Google"}
        </motion.button>

        <p className="mt-6 text-sm text-gray-400">
          © CP Hub 2025. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
