import React, { useEffect, useState } from "react";
import axios from "axios";
import ReminderDialog from "../components/ReminderDialog";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaClock, FaExternalLinkAlt, FaBookmark, FaBell, FaBellSlash, } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
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
  const { user, userId } = useAuth();
  const platforms = ["Codeforces", "LeetCode", "AtCoder", "CodeChef"];

  const [filter, setFilter] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [contests, setContests] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);
  const [reminderSetFor, setReminderSetFor] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    async function fetchContests() {
      try {
        const cached = localStorage.getItem("upcomingContests");
        const cacheTimestamp = localStorage.getItem("upcomingContestsTimestamp");
        const nowTimestamp = Date.now();
        if (cached && cacheTimestamp && nowTimestamp - cacheTimestamp < 60 * 60 * 1000) {
          const contestsFromCache = JSON.parse(cached);
          setContests(contestsFromCache);
          setLoading(false);
          return;
        }
        const response = await axios.get(`${import.meta.env.VITE_API_BASE}api/upcoming`);
        if (Array.isArray(response.data) && response.data.length > 0) {
          const upcomingContests = response.data.map((contest) => ({
            id: String(contest.id),
            title: contest.event,
            platform: mapPlatform(contest.resource),
            date: contest.start,
            end: contest.end,
            duration: contest.duration,
            url: contest.href,
          }));

          setContests(upcomingContests);
          localStorage.setItem("upcomingContests", JSON.stringify(upcomingContests));
          localStorage.setItem("upcomingContestsTimestamp", nowTimestamp.toString());
        } else {
          console.log("No contests found in API response.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contests:", error);
        setLoading(false);
      }
    }

    async function fetchBookmarks() {
      if (!userId) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/bookmarks/get/${userId}`
        );
        setBookmarked(res.data.map((c) => String(c.contestId)));
      } catch (err) {
        console.error("❌ Error fetching bookmarks:", err);
      }
    }

    fetchContests();
    fetchBookmarks();
  }, [userId]);


  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);


  const getTimeLeft = (startTime) => {
    const start = new Date(startTime + "Z");
    const diff = start - now;

    if (diff <= 0) return "Started";
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    return `${h}h ${m}m ${s}s`;
  };


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

  const handleBookmark = async (contest) => {
    if (!user) {
      toast.error("Please login to bookmark contests!");
      return;
    }

    if (bookmarked.includes(contest.id)) {
      toast.error("⚠️ Contest already bookmarked!");
      return;
    }

    try {
      const payload = {
        userId,
        contest: {
          contestId: contest.id,
          title: contest.title,
          platform: contest.platform,
          date: contest.date,
          end: contest.end,
          duration: contest.duration,
          url: contest.url,
        },
      };
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/api/bookmarks/add`, payload);
      if (res.status === 201) {
        setBookmarked((prev) => [...prev, contest.id]);
        toast.success("✅ Contest bookmarked successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error(" Failed to bookmark contest!");
    }
  };

  const openReminderDialog = (contest) => {
  if (!user) {
    toast.error("Please login to set a reminder!");
    return;
  }
  setSelectedContest(contest);
  setShowDialog(true);
  };


  const handleSetReminder = async ({ email, time }) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/api/reminder/add`, {
        contestId: selectedContest.id,
        contestTitle: selectedContest.title,
        email,
        minutesBefore: time,
        contestStartTime: selectedContest.date,
      });

      toast.success(`✅ Reminder set! We'll email ${email} ${time} mins before.`);
      setReminderSetFor((prev) => [...prev, selectedContest.id]);
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("⛔ Reminder already exists for this contest and email!");
      } else {
        toast.error("❌ Something went wrong while setting the reminder.");
        console.error("Error setting reminder:", error);
      }
    } finally {
      setShowDialog(false);
      setSelectedContest(null);
    }
  };


  const filteredContests = filter.includes("All")
    ? contests
    : contests.filter((c) => filter.includes(c.platform));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-20">
      <div className="flex justify-center space-x-3 mb-10 flex-wrap pt-10 sm:pt-16">
        {["All", ...platforms].map((p) => (
          <button
            key={p}
            onClick={() => togglePlatform(p)}
            className={`px-4 py-2 rounded-full text-sm sm:text-base font-semibold ${filter.includes(p)
              ? "bg-pink-500 text-white"
              : "bg-white/20 text-gray-300 hover:bg-white/30"}`}
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
          {loading ? (
            <p className="text-center text-gray-400">Loading contests...</p>
          ) : filteredContests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredContests.map((contest) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  key={contest.id}
                  className="relative flex flex-col justify-between p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 hover:shadow-2xl transition-all h-full"
                >
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">
                      {contest.title}
                    </h3>
                    <p className="flex items-center text-xs sm:text-sm text-gray-300 gap-2">
                      <FaClock className="text-pink-500" />
                      {new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Asia/Kolkata",
                      }).format(new Date(contest.date + "Z"))}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 pt-4 mt-auto">
                    <p className="flex items-center text-yellow-400 text-base gap-1">
                      ⏳ <span className="font-semibold">{getTimeLeft(contest.date)}</span>
                    </p>

                    <button
                      onClick={() => handleBookmark(contest)}
                      aria-label="Bookmark Contest"
                      className={`flex items-center text-sm transition ${bookmarked.includes(contest.id)
                        ? "text-pink-500"
                        : "text-gray-400 hover:text-pink-500"}`}
                    >
                      <FaBookmark size={18} />
                    </button>

                    {reminderSetFor.includes(contest.id) ? (
                      <button disabled className="flex items-center gap-1 text-gray-400 text-sm cursor-not-allowed">
                        <FaBellSlash size={18} /> <span>Reminder Set</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => openReminderDialog(contest)}
                        className="flex items-center gap-1 text-gray-400 hover:text-pink-400 transition text-sm"
                      >
                        <FaBell size={18} /> <span>Remind Me</span>
                      </button>
                    )}

                    <a
                      href={contest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto flex items-center text-gray-400 hover:text-pink-500 transition"
                      aria-label="Open Contest Link"
                    >
                      <FaExternalLinkAlt size={18} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 col-span-full">
              No contests found for selected platforms.
            </p>
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

      <Footer />
    </div>
  );
}
