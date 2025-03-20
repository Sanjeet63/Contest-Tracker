import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUserCircle, FaCodeBranch, FaChartLine, FaLink, FaChartPie, FaTrophy } from "react-icons/fa";

export default function Dashboard() {
  const [accounts, setAccounts] = useState({
    codeforces: "",
    leetcode: "",
    codechef: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccounts({ ...accounts, [name]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative px-4 py-12">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 to-pink-600/30 blur-3xl opacity-30 z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 container mx-auto max-w-6xl"
      >
        <h1 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          Your CP Dashboard 🏆
        </h1>

        {/* Platform Sections */}
        {Object.keys(accounts).map((platform, idx) => (
          <div key={idx} className="mb-12">
            <h2 className="text-2xl mb-4 text-pink-400 capitalize">{platform} Profile</h2>

            {/* Account Linking */}
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 mb-4">
              <input
                type="text"
                name={platform}
                value={accounts[platform]}
                onChange={handleInputChange}
                placeholder={`Enter ${platform} handle`}
                className="w-full p-2 rounded-xl bg-white/20 text-white placeholder-gray-300 text-sm mb-2"
              />
              <button className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-xl py-2 font-semibold">
                <FaLink className="inline mr-1" /> Link Account
              </button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Total Solved */}
              <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 text-center">
                <FaCodeBranch className="text-pink-400 text-2xl mb-2 mx-auto" />
                <h4 className="font-semibold">Solved</h4>
                <p className="text-2xl font-bold text-pink-300">{Math.floor(Math.random() * 500)}</p>
              </div>
              {/* Difficulty Breakdown */}
              <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 text-center">
                <FaChartPie className="text-pink-400 text-2xl mb-2 mx-auto" />
                <h4 className="font-semibold">Easy/Med/Hard</h4>
                <p className="text-pink-300">45 / 80 / 25</p>
              </div>
              {/* Rating */}
              <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 text-center">
                <FaChartLine className="text-pink-400 text-2xl mb-2 mx-auto" />
                <h4 className="font-semibold">Rating</h4>
                <p className="text-2xl font-bold text-pink-300">{1500 + idx * 300}</p>
              </div>
              {/* Placeholder Graph Section */}
              <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 text-center">
                <FaUserCircle className="text-pink-400 text-2xl mb-2 mx-auto" />
                <h4 className="font-semibold">Graph</h4>
                <p className="text-xs text-gray-300">Graph will be integrated later</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}