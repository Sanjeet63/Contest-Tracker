import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaClock, FaExternalLinkAlt } from "react-icons/fa";

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

  useEffect(() => {
    async function fetchPastContests() {
      try {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        const todayStr = today.toISOString().split("T")[0];
        const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

        const response = await axios.get(
          `https://clist.by/api/v4/contest/?start__gte=${sevenDaysAgoStr}&start__lte=${todayStr}&format=json&order_by=-start&limit=50&resource_id__in=1,2,93,102`,
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

  const filteredContests =
    filter.includes("All")
      ? pastContests
      : pastContests.filter((c) => filter.includes(c.platform));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Filter Buttons */}
      <h1 className="text-4xl font-bold text-white mb-4 text-center py-8 items-center justify-center flex">
        🎯 Past Contests (Last 7 Days)
      </h1>
      <div className="flex justify-center space-x-4 mb-8">
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
          {/* <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            🎯 Past Contests (Last 7 Days)
          </h2> */}
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
                        {new Intl.DateTimeFormat("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                          timeZone: "Asia/Kolkata", // target timezone
                        }).format(new Date(contest.date + "Z"))}
                      </p>
                      <p className="mt-1 text-xs text-blue-400">
                        {contest.platform}
                      </p>
                    </div>

                    {/* Consistent Link Icon */}
                    <div className="flex items-center justify-end pt-4 mt-auto">
                      <a href={contest.url} target="_blank" rel="noopener noreferrer">
                        <FaExternalLinkAlt className="text-gray-400 hover:text-blue-500 transition text-lg" />
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
