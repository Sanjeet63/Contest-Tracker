import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaClock, FaVideo, FaBookmark, FaRegBookmark } from "react-icons/fa";
import toast from "react-hot-toast";

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

export default function PastContestsPage() {
  const platforms = ["Codeforces", "LeetCode", "AtCoder", "CodeChef"];
  const [filter, setFilter] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [pastContests, setPastContests] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    async function fetchPastContests() {
      try {
        const today = new Date();
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(today.getDate() - 14);

        const todayStr = today.toISOString().split("T")[0];
        const fourteenDaysAgoStr = fourteenDaysAgo.toISOString().split("T")[0];

        const response = await axios.get(
          `https://clist.by/api/v4/contest/?start__gte=${fourteenDaysAgoStr}&start__lte=${todayStr}&format=json&order_by=-start&limit=50&resource_id__in=1,2,93,102`,
          {
            headers: {
              Authorization: `ApiKey sanjeet:${API_KEY}`,
            },
          }
        );

        if (response.data.objects && response.data.objects.length > 0) {
          const pastContestList = response.data.objects.map((contest) => ({
            id: contest.id,
            title: contest.event,
            platform: mapPlatform(contest.resource),
            date: contest.start,
            end: contest.end,
            duration: contest.duration,
            url: contest.href,
          }));
          setPastContests(pastContestList);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching past contests:", error);
        setLoading(false);
      }
    }

    fetchPastContests();
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

  const toggleBookmark = (id) => {
    setBookmarks((prev) => {
      const isBookmarked = prev.includes(id);
      if (isBookmarked) {
        toast.error("🔕 Bookmark removed!");
        return prev.filter((b) => b !== id);
      } else {
        toast.success("🔖 Bookmarked!");
        return [...prev, id];
      }
    });
  };

  const filteredContests =
    filter.includes("All")
      ? pastContests
      : pastContests.filter((c) => filter.includes(c.platform));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Filter Buttons */}
      <div className="container mx-auto flex justify-center gap-2 sm:gap-4 py-4 flex-wrap px-4">
        <button
          onClick={() => togglePlatform("All")}
          className={`px-4 py-2 rounded-full text-sm sm:text-base font-semibold ${filter.includes("All")
              ? "bg-blue-500 text-white"
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
                ? "bg-blue-500 text-white"
                : "bg-white/20 text-gray-300 hover:bg-white/30"
              }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Past Contests Section */}
      <main className="container mx-auto py-8 sm:py-12 space-y-10 px-4">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            🎯 Past Contests (Last 14 Days)
          </h2>
          {loading ? (
            <p className="text-center text-gray-400">Loading past contests...</p>
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
                        <FaClock className="text-blue-500" />{" "}
                        {new Date(contest.date).toLocaleString()}
                      </p>
                      <p className="mt-1 text-xs text-blue-400">
                        {contest.platform}
                      </p>
                    </div>

                    {/* Icon Container pinned to bottom */}
                    <div className="flex items-center space-x-4 pt-4 mt-auto">
                      <button onClick={() => toggleBookmark(contest.id)}>
                        {bookmarks.includes(contest.id) ? (
                          <FaBookmark className="text-blue-500 hover:text-gray-400 transition" />
                        ) : (
                          <FaRegBookmark className="text-gray-400 hover:text-blue-500 transition" />
                        )}
                      </button>
                      <a href={contest.url} target="_blank" rel="noopener noreferrer">
                        <FaVideo className="text-gray-400 hover:text-blue-500 transition" />
                      </a>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-400">No past contests found.</p>
              )}
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
}
