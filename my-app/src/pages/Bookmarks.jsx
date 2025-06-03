import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Trash2, Globe } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { useCallback } from "react";
const categories = ["all", "codeforces", "leetcode", "atcoder", "codechef"];
const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "");
const MyBookmarks = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    if (!userId) navigate("/login");
  }, [userId, navigate]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/bookmarks/get/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch bookmarks");
        const data = await res.json();
        setBookmarks(data);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchBookmarks();
  }, [userId]);
 

const handleDelete = useCallback(async (e, contestId) => {
  e.preventDefault();
  try {
    const res = await fetch(
      `${API_BASE}/api/bookmarks/remove?userId=${userId}&contestId=${contestId}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      setBookmarks((prev) => prev.filter((c) => c.contestId !== contestId));
    } else {
      const data = await res.json();
      alert("Error removing bookmark: " + data.message);
    }
  } catch (err) {
    console.error("Error deleting bookmark:", err);
  }
}, [userId]);


  const filteredBookmarks =
    category === "all"
      ? bookmarks
      : bookmarks.filter((b) => b.platform.toLowerCase() === category);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeZone: "Asia/Kolkata",
    });
    return formatter.format(date);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-20">
         <div className="flex justify-center flex-wrap gap-x-3 gap-y-3 mb-6 sm:mb-20 pt-10 sm:pt-20">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 shadow-md ${
                category === cat
                  ? "bg-pink-600 text-white scale-105"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105"
              }`}
            >
              {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></span>
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <p className="text-center text-gray-400">No contests found in this category.</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center pb-16 px-8">
            {filteredBookmarks.map((contest) => (
              <motion.div
                key={contest.contestId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative flex flex-col justify-between p-6 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-pink-500/30 transition-all h-full w-full max-w-sm"
              >
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white leading-tight">{contest.name}</h2>
                  <p className="text-sm text-gray-400">
                    Platform: <span className="text-white capitalize">{contest.platform}</span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Date: <span className="text-white">{formatDate(contest.date)}</span>
                  </p>
                  <a
                    href={contest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-500 transition text-sm"
                  >
                    <Globe className="w-4 h-4" /> Visit Contest Page
                  </a>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, contest.contestId)}
                  className="mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-red-500 hover:to-red-600 text-white py-2 rounded-2xl transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Remove Bookmark
                </button>
              </motion.div>
            ))}
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default MyBookmarks;
