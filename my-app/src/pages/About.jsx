import React from "react";
import dpImage from "../assets/DP.jpg";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* HERO SECTION */}
      <section className="relative z-10 py-20 text-center overflow-hidden">
        {/* Glow only inside hero section */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 to-pink-600/30 blur-3xl opacity-30"></div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 relative z-10"
        >
          About CP Hub 🚀
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-4 text-lg text-gray-300 max-w-xl mx-auto relative z-10"
        >
          Your all-in-one competitive programming assistant to track, manage, and level up your CP game.
        </motion.p>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 container mx-auto py-16 grid md:grid-cols-3 gap-8">
        {[
          { title: "Unified Contest Tracker", desc: "Stay updated with contests from Codeforces, LeetCode, CodeChef, and more." },
          { title: "Your CP Dashboard", desc: "Bookmark contests, track reminders, and monitor your CP performance." },
          { title: "Google Authentication", desc: "Secure sign-in with Google for syncing your progress effortlessly." }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all"
          >
            <h3 className="text-xl font-semibold mb-2 text-pink-400">{item.title}</h3>
            <p className="text-gray-300">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* CREATOR SECTION */}
      <section className="relative z-10 text-center py-20">
        <motion.h2
          className="text-3xl font-bold mb-8 text-purple-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Meet the Creator 👨‍💻
        </motion.h2>
        <motion.div
          className="inline-block bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={dpImage}
            alt="Creator"
            className="rounded-full mx-auto mb-4 w-32 h-32 object-cover border-2 border-purple-500"
          />
          <h4 className="text-xl font-semibold text-white">Sanjeet Patel</h4>
          <p className="text-gray-300">Developer & Competitive Programmer</p>
          <p className="text-sm mt-2 text-gray-400">Building tools to help CP enthusiasts grow 🚀</p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-2 text-white">Ready to boost your CP journey?</h3>
          <p className="mb-4 text-gray-300">Join CP Hub now and never miss a contest!</p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="bg-pink-500 hover:bg-pink-600 px-6 py-2 rounded-full font-semibold shadow-lg"
          >
            Get Started
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
