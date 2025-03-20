import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Trash2, Globe } from "lucide-react";

const categories = ["all", "codeforces", "leetcode", "atcoder", "codechef"];

const MyBookmarks = () => {
  const { userId } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/bookmarks/get/${userId}`);
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

  const handleDelete = async (e, contestId) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:5000/api/bookmarks/remove?userId=${userId}&contestId=${contestId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setBookmarks((prev) => prev.filter((c) => c.contestId !== contestId));
      } else {
        const data = await res.json();
        console.error("Server responded with error:", data.message);
        alert("Error removing bookmark: " + data.message);
      }
    } catch (err) {
      console.error("Error deleting bookmark:", err);
    }
  };

  const filteredBookmarks = category === "all"
    ? bookmarks
    : bookmarks.filter(b => b.platform.toLowerCase() === category);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <h1 className="text-4xl font-bold text-white mb-4 text-center py-8"> 🔖 My Bookmarks </h1>

      {/* Pills / Tabs */}
      <div className="flex justify-center space-x-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              category === cat
                ? "bg-pink-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {cat === "all"
              ? "All"
              : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {filteredBookmarks.length === 0 ? (
        <p className="text-center text-gray-400">No contests found in this category.</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center py-8">
          {filteredBookmarks.map((contest) => (
            <div
              key={contest.contestId}
              className="flex flex-col justify-between h-full w-full max-w-xs bg-gradient-to-br from-[#1E1E2E] to-[#151521] backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-gray-700 hover:scale-105 hover:shadow-2xl transition-transform duration-300"
            >
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">{contest.name}</h2>
                <p className="text-sm text-gray-400">Platform: <span className="text-white">{contest.platform}</span></p>
                <p className="text-sm text-gray-400">Date: <span className="text-white">{formatDate(contest.date)}</span></p>
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
                className="mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-2xl hover:from-red-600 hover:to-red-700 transition-all"
              >
                <Trash2 className="w-4 h-4" /> Remove Bookmark
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookmarks;
