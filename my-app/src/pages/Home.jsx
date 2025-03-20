import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaClock,
  FaExternalLinkAlt,
  FaBookmark,
  FaBell,
  FaBellSlash,
} from "react-icons/fa";
import ReminderDialog from "../components/ReminderDialog";

const API_KEY = "2d252b84482c405593f16c6c03c1e7f1c34a0e50";

const mapPlatform = (resourceStr) => {
  const lower = resourceStr.toLowerCase();
  switch (lower) {
    case "codeforces.com":
      return "Codeforces";
    case "leetcode.com":
      return "LeetCode";
    case "atcoder.jp":
      return "AtCoder";
    case "codechef.com":
      return "CodeChef";
    default:
      return resourceStr;
  }
};

export default function HomePage() {
  const platforms = ["Codeforces", "LeetCode", "AtCoder", "CodeChef"];
  const [filter, setFilter] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [contests, setContests] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const [reminderSetFor, setReminderSetFor] = useState([]);

  useEffect(() => {
    async function fetchContests() {
      try {
        const response = await axios.get(
          "https://clist.by/api/v4/contest/?upcoming=true&format=json&order_by=start&limit=50&resource_id__in=1,2,93,102",
          {
            headers: {
              Authorization: `ApiKey sanjeet:${API_KEY}`,
            },
          }
        );
        if (response.data.objects && response.data.objects.length > 0) {
          const upcomingContests = response.data.objects.map((contest) => ({
            id: contest.id,
            title: contest.event,
            platform: mapPlatform(contest.resource),
            date: contest.start,
            end: contest.end,
            duration: contest.duration,
            url: contest.href,
          }));
          setContests(upcomingContests);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contests:", error);
        setLoading(false);
      }
    }
    fetchContests();
  }, []);

  const togglePlatform = (platform) => {
    if (platform === "All") {
      setFilter(["All"]);
    } else {
      if (filter.includes("All")) {
        setFilter([platform]);
      } else if (filter.includes(platform)) {
        const newFilter = filter.filter((p) => p !== platform);
        setFilter(newFilter.length > 0 ? newFilter : ["All"]);
      } else {
        setFilter([...filter, platform]);
      }
    }
  };
  const handleBookmark = (contest) => {
    const userId = localStorage.getItem('userId'); // or wherever you store it

    if (!userId) {
      toast.error('User not logged in!');
      return;
    }

    const bookmarkData = {
      userId,
      contestId: contest.id,
      name: contest.title,
      url: contest.url,
      date: contest.date,
      platform: contest.platform
    };

    addBookmark(bookmarkData, contest.id);
  };

  const addBookmark = async (bookmarkData, contestId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/bookmark', bookmarkData); // update URL as per backend
      if (response.data.success) {
        setBookmarked((prev) => [...prev, contestId]);
        toast.success('Contest bookmarked!');
      } else {
        toast.error('Bookmark already exists or error occurred!');
      }
    } catch (error) {
      console.error('Error bookmarking contest:', error);
      toast.error('Failed to bookmark contest!');
    }
  };


  const openReminderDialog = (contest) => {
    setSelectedContest(contest);
    setShowDialog(true);
  };

  const handleSetReminder = (minutes) => {
    if (!reminderSetFor.includes(selectedContest.id)) {
      setReminderSetFor((prev) => [...prev, selectedContest.id]);
      toast.success(
        `🔔 Reminder set for ${minutes} minutes before "${selectedContest.title}". Note: This is a one-time reminder and can't be set again!`
      );
    } else {
      toast.error(
        "❌ Reminder already set! You can only set a one-time reminder for each contest."
      );
    }
    setShowDialog(false);
    setSelectedContest(null);
  };


  const filteredContests = filter.includes("All")
    ? contests
    : contests.filter((c) => filter.includes(c.platform));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Filter Buttons */}
      <div className="container mx-auto flex justify-center gap-2 sm:gap-4 py-4 flex-wrap px-4">
        <button
          onClick={() => togglePlatform("All")}
          className={`px-4 py-2 rounded-full text-sm sm:text-base font-semibold ${filter.includes("All")
            ? "bg-pink-500 text-white"
            : "bg-white/20 text-gray-300 hover:bg-white/30"
            }`}
        >
          All
        </button>
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => togglePlatform(p)}
            className={`px-4 py-2 rounded-full text-sm sm:text-base font-semibold ${filter.includes(p)
              ? "bg-pink-500 text-white"
              : "bg-white/20 text-gray-300 hover:bg-white/30"
              }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Contests */}
      <main className="container mx-auto py-8 sm:py-12 space-y-10 px-4">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            🚩 Upcoming Contests
          </h2>
          {loading ? (
            <p className="text-center text-gray-400">Loading contests...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredContests.length > 0 ? (
                filteredContests.map((contest) => (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    key={contest.id}
                    className="relative flex flex-col justify-between p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 hover:shadow-2xl transition-all h-full"
                  >
                    {/* Top Content */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">
                        {contest.title}
                      </h3>
                      <p className="flex items-center text-xs sm:text-sm text-gray-300 gap-2">
                        <FaClock className="text-pink-500" />{" "}
                        {new Date(contest.date).toLocaleString()}
                      </p>
                      <p className="mt-1 text-xs text-pink-400">
                        {contest.platform}
                      </p>
                    </div>

                    {/* Icon Container pinned to bottom */}
                    <div className="flex items-center space-x-4 pt-4 mt-auto">
                      <button onClick={() => handleBookmark(contest)}>
                        <FaBookmark
                          className={`${bookmarked.includes(contest.id)
                              ? "text-pink-500"
                              : "text-gray-400"
                            } hover:text-pink-500 transition`}
                        />
                      </button>

                      <button onClick={() => openReminderDialog(contest)}>
                        {reminderSetFor.includes(contest.id) ? (
                          <FaBellSlash className="text-pink-500 hover:text-gray-400 transition" />
                        ) : (
                          <FaBell className="text-gray-400 hover:text-pink-500 transition" />
                        )}
                      </button>
                      <a href={contest.url} target="_blank" rel="noopener noreferrer">
                        <FaExternalLinkAlt className="text-gray-400 hover:text-pink-500 transition" />
                      </a>
                    </div>
                  </motion.div>

                ))
              ) : (
                <p className="text-center text-gray-400">No contests found.</p>
              )}
            </div>
          )}
        </motion.section>
      </main>

      {showDialog && selectedContest && (
        <ReminderDialog
          contest={selectedContest}
          onClose={() => setShowDialog(false)}
          onSetReminder={handleSetReminder}
        />
      )}

      {/* ICON CONTAINER STYLES */}
      <style jsx>{`
        .icon-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;
          margin-top: 10px;
        }
        .icon-container svg {
          width: 24px;
          height: 24px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .icon-container svg:hover {
          transform: scale(1.2);
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
