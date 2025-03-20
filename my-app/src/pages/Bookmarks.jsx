import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaClock, FaTimesCircle, FaExternalLinkAlt, FaSort } from "react-icons/fa";

const mockBookmarks = [
  { id: 1, title: "Codeforces Round #919", platform: "Codeforces", date: "2025-03-21", url: "/contest/1", added: "2025-03-10" },
  { id: 2, title: "LeetCode Biweekly #100", platform: "LeetCode", date: "2025-03-22", url: "/contest/2", added: "2025-03-12" },
  { id: 3, title: "CodeChef Starters 128", platform: "CodeChef", date: "2025-03-26", url: "/contest/3", added: "2025-03-11" },
];

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState(mockBookmarks);
  const [filter, setFilter] = useState("All");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [toast, setToast] = useState("");

  const platforms = ["All", "Codeforces", "LeetCode", "CodeChef"];

  const filtered = filter === "All" ? bookmarks : bookmarks.filter(b => b.platform === filter);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.date) - new Date(b.date);
    } else {
      return new Date(a.added) - new Date(b.added);
    }
  });

  const confirmDelete = (id) => {
    setShowDialog(true);
    setSelectedId(id);
  };

  const handleDelete = () => {
    setBookmarks(bookmarks.filter((b) => b.id !== selectedId));
    setShowDialog(false);
    setSelectedId(null);
    setToast("Bookmark removed!");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 to-pink-600/30 blur-3xl opacity-30"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 container mx-auto max-w-5xl"
      >
        <h1 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          Your Bookmarked Contests
        </h1>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                filter === p ? "bg-pink-500 text-white" : "bg-white/20 text-gray-300 hover:bg-white/30"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setSortBy(sortBy === "date" ? "added" : "date")}
            className="px-4 py-2 rounded-full text-sm font-semibold bg-white/20 text-gray-300 hover:bg-white/30 flex items-center gap-1"
          >
            <FaSort /> Sort by {sortBy === "date" ? "Added Date" : "Contest Date"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sorted.map((contest) => (
            <motion.div
              key={contest.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20 relative"
            >
              <h3 className="text-xl font-semibold mb-2">{contest.title}</h3>
              <p className="flex items-center text-sm text-gray-300 gap-2 mb-2">
                <FaClock className="text-pink-400" /> {new Date(contest.date).toDateString()}
              </p>
              <a href={contest.url} className="text-sm text-pink-400 hover:underline flex items-center gap-1">
                View Details <FaExternalLinkAlt />
              </a>
              <button
                onClick={() => confirmDelete(contest.id)}
                className="absolute top-4 right-4 text-pink-400 hover:text-pink-500"
              >
                <FaTimesCircle size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Custom Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 w-80 text-center">
            <h3 className="text-lg font-semibold mb-4 text-white">Confirm Deletion</h3>
            <p className="text-sm text-gray-300 mb-6">Are you sure you want to remove this bookmark?</p>
            <div className="flex justify-between gap-4">
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl"
              >
                Yes, Remove
              </button>
              <button
                onClick={() => setShowDialog(false)}
                className="flex-1 py-2 bg-white/20 hover:bg-white/30 text-gray-300 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white px-4 py-2 rounded-xl shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}