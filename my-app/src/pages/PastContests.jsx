import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaClock, FaExternalLinkAlt, FaBookmark } from "react-icons/fa";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
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
  const { user, userId } = useAuth();
  const platforms = ["Codeforces", "LeetCode", "AtCoder", "CodeChef"];
  const [filter, setFilter] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [bookmarksLoading, setBookmarksLoading] = useState(true);
  const [pastContests, setPastContests] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);

 useEffect(() => {
  async function fetchContests() {
    const cached = localStorage.getItem("pastContests");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setPastContests(parsed);
        setLoading(false);
      } catch (err) {
        console.error("Error parsing cached contests:", err);
      }
    }

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/past-contests`);
      console.log("Past Contests API response:", res.data);
      if (res.data.objects) {
        const list = res.data.objects.map((contest) => ({
          id: contest.id,
          title: contest.event,
          platform: mapPlatform(typeof contest.resource === "string" ? contest.resource : contest.resource?.host || ""),
          date: contest.start,
          url: contest.href,
        }));
        setPastContests(list);
        localStorage.setItem("pastContests", JSON.stringify(list));
      }
    } catch (error) {
      console.error("Error fetching contests:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBookmarks() {
    if (!userId) {
      setBookmarksLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/bookmarks/get/${userId}`);
      setBookmarked(res.data.map((c) => String(c.contestId)));
    } catch (err) {
      console.error("❌ Error fetching bookmarks:", err);
    } finally {
      setBookmarksLoading(false);
    }
  }

  fetchContests();
  fetchBookmarks();
}, [userId]);

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

  const filteredContests =
    filter.includes("All")
      ? pastContests
      : pastContests.filter((c) => filter.includes(c.platform));

  const handleBookmark = async (contest) => {
    if (!user) {
      toast.error("Please login to bookmark contests!");
      return;
    }

    if (bookmarked.includes(String(contest.id))) {
      toast.error("⚠️ Contest already bookmarked!");
      return;
    }

    try {
      const payload = {
        userId: userId,
        contest: {
          contestId: contest.id,
          title: contest.title,
          platform: contest.platform,
          date: contest.date,
          url: contest.url,
        },
      };

      const response = await axios.post(`${import.meta.env.VITE_API_BASE}/api/bookmarks/add`, payload);

      if (response.status === 201) {
        setBookmarked((prev) => [...prev, String(contest.id)]);
        toast.success("✅ Contest bookmarked successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to bookmark contest!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-20">
      <div className="flex justify-center space-x-4 mb-10 flex-wrap pt-10 sm:pt-16">
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

      <main className="container mx-auto py-8 sm:py-12 space-y-10 px-4 mb-5">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {loading || bookmarksLoading ? (
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
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">{contest.title}</h3>
                      <p className="flex items-center text-xs sm:text-sm text-gray-300 gap-2">
                        <FaClock className="text-pink-500" />
                        {new Intl.DateTimeFormat("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                          timeZone: "Asia/Kolkata",
                        }).format(new Date(contest.date + "Z"))}
                      </p>
                      <p className="mt-1 text-xs text-pink-400">{contest.platform}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-auto">
                      <a href={contest.url} target="_blank" rel="noopener noreferrer">
                        <FaExternalLinkAlt className="text-gray-400 hover:text-pink-500 transition text-lg" />
                      </a>
                      {user && (
                        <button onClick={() => handleBookmark(contest)}>
                          <FaBookmark
                            className={`text-lg transition ${bookmarked.includes(String(contest.id))
                                ? "text-pink-600"
                                : "text-gray-400"
                              } hover:text-pink-600`}
                          />
                        </button>
                      )}
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

      <Footer />
    </div>
  );
}
