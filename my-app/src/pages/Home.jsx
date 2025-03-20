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
import { useAuth } from "../context/AuthContext";

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
  const { user, userId } = useAuth();
  const platforms = ["Codeforces", "LeetCode", "AtCoder", "CodeChef"];
  const [filter, setFilter] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [contests, setContests] = useState([]);
  const [bookmarked, setBookmarked] = useState([]); // IDs as string[]
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
            id: String(contest.id), // Ensure id is string
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

    async function fetchBookmarks() {
      if (!userId) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/bookmarks/get/${userId}`
        );
        setBookmarked(res.data.map((c) => String(c.contestId)));
      } catch (err) {
        console.error("❌ Error fetching bookmarks:", err);
      }
    }

    fetchContests();
    fetchBookmarks();
  }, [userId]);

  const [now, setNow] = useState(new Date());

  // To update every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const getTimeLeft = (startTime) => {
    const start = new Date(startTime + "Z");
    const diff = start - now;

    if (diff <= 0) return "Started";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
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
        userId: userId,
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

      const response = await axios.post(
        "http://localhost:5000/api/bookmarks/add",
        payload
      );

      if (response.status === 201) {
        setBookmarked((prev) => [...prev, contest.id]);
        toast.success("✅ Contest bookmarked successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to bookmark contest!");
    }
  };

  const openReminderDialog = (contest) => {
    setSelectedContest(contest);
    setShowDialog(true);
  };

  const handleSetReminder = ({ email, time }) => {
    if (reminderSetFor.includes(selectedContest.id)) {
      toast.error("Reminder already set for this contest!");
    } else {
      setReminderSetFor((prev) => [...prev, selectedContest.id]);

      // mock api
      axios.post("http://localhost:5000/api/reminder/add", {
        contestId: selectedContest.id,
        contestTitle: selectedContest.title,
        email,
        minutesBefore: time,
      });

      toast.success(`Reminder set! We'll email ${email} ${time} mins before.`);
    }
    setShowDialog(false);
    setSelectedContest(null);
  };

  const filteredContests = filter.includes("All")
    ? contests
    : contests.filter((c) => filter.includes(c.platform));

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <h1 className="text-4xl font-bold text-white mb-4 text-center py-8 items-center justify-center flex">
        🚩 Upcoming Contests
      </h1>
      {/* Filter Buttons */}
      <div className="flex justify-center space-x-3 mb-10 flex-wrap">
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
          {/* <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            🚩 Upcoming Contests
          </h2> */}
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
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">
                        {contest.title}
                      </h3>
                      <p className="flex items-center text-xs sm:text-sm text-gray-300 gap-2">
                        <FaClock className="text-pink-500" />{" "}
                        {new Intl.DateTimeFormat("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                          timeZone: "Asia/Kolkata", // target timezone
                        }).format(new Date(contest.date + "Z"))}
                      </p>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-4 pt-4 mt-auto">
                      <p className="flex items-center text-xs sm:text-sm text-yellow-400 gap-2 mt-1">
                        ⏳ {getTimeLeft(contest.date)}
                      </p>
                      <button
                        onClick={() => handleBookmark(contest)}
                        disabled={bookmarked.includes(contest.id)}
                      >
                        <FaBookmark
                          className={`${bookmarked.includes(contest.id)
                            ? "text-pink-500"
                            : "text-gray-400"
                            } hover:text-pink-500 transition`}
                        />
                      </button>

                      <button onClick={() => openReminderDialog(contest)}>
                        {reminderSetFor.includes(contest.id) ? (
                          <button
                            disabled
                            className="flex items-center gap-1 text-gray-400 cursor-not-allowed"
                          >
                            <FaBellSlash /> Reminder Set
                          </button>
                        ) : (
                          <button
                            onClick={() => openReminderDialog(contest)}
                            className="flex items-center gap-1 hover:text-pink-400"
                          >
                            <FaBell /> Remind Me
                          </button>
                        )}

                      </button>
                      <a
                        href={contest.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto"
                      >
                        <FaExternalLinkAlt className="text-gray-400 hover:text-pink-500 transition" />
                      </a>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-400 col-span-full">
                  No contests found for selected platforms.
                </p>
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
    </div>
  );
}
