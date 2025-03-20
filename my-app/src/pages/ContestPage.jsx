import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRegClock, FaBell, FaBellSlash, FaBookmark, FaCalendarAlt, FaHourglassHalf, FaTags, FaArrowRight } from "react-icons/fa";
import ReminderDialog from "../components/ReminderDialog";
import SkeletonLoader from "../components/SkeletonLoader";

export default function ContestPage() {
  const contest = {
    name: "Codeforces Round #919",
    platform: "Codeforces",
    startTime: new Date("2025-03-21T17:35:00Z"),
    duration: "2 hours",
    tags: ["Div 2", "Algorithms", "DP", "Greedy"],
    problems: 5,
    rules: "Rated for Div 2, ICPC format",
    url: "https://codeforces.com/contest/919"
  };

  const [timeLeft, setTimeLeft] = useState("");
  const [showReminder, setShowReminder] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const distance = contest.startTime - now;
      if (distance < 0) {
        setTimeLeft("Already started!");
        clearInterval(timer);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((distance / (1000 * 60)) % 60);
        setTimeLeft(`${days}d ${hours}h ${mins}m`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleReminderSet = (minutes) => {
    setReminderSet(true);
    setToast(`Reminder set for ${minutes} minutes before start!`);
    setShowReminder(false);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative px-4">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 to-pink-600/30 blur-3xl opacity-30"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-lg text-white border border-white/20"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            {contest.name}
          </h1>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-white/10 rounded-xl text-pink-400 hover:text-pink-500">
              <FaBookmark />
            </button>
            <button
              onClick={() => setShowReminder(true)}
              className="p-2 hover:bg-white/10 rounded-xl text-pink-400 hover:text-pink-500"
              title={reminderSet ? "Reminder Active" : "Set Reminder"}
            >
              {reminderSet ? <FaBellSlash /> : <FaBell />}
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-pink-400 mb-6">
          Starts in: <span className="font-semibold">{timeLeft}</span>
        </div>

        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-pink-400" />
            <span><strong>Date:</strong> {contest.startTime.toDateString()} | <strong>Start:</strong> {contest.startTime.toUTCString().slice(17, 22)} UTC</span>
          </div>
          <div className="flex items-center gap-2">
            <FaHourglassHalf className="text-pink-400" />
            <span><strong>Duration:</strong> {contest.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaTags className="text-pink-400" />
            <span><strong>Tags:</strong> {contest.tags.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2">
            📚 <span><strong>Problems:</strong> {contest.problems}</span>
          </div>
          <div className="flex items-center gap-2">
            📄 <span><strong>Rules:</strong> {contest.rules}</span>
          </div>
        </div>

        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block bg-pink-600 hover:bg-pink-700 text-white font-semibold text-center py-2 rounded-xl transition-all"
        >
          Go to Contest <FaArrowRight className="inline ml-1" />
        </a>

        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-pink-400 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </motion.div>

      {showReminder && (
        <ReminderDialog
          onClose={() => setShowReminder(false)}
          onSelect={handleReminderSet}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white px-4 py-2 rounded-xl shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}