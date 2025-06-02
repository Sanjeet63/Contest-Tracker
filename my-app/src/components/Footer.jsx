import { Link, useNavigate } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFeedbackClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate("/login");
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-950 text-gray-300 py-12 px-6 mt-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-green-400 text-2xl font-bold">CP</span>
            <span className="text-2xl font-semibold">Hub</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            CP Hub is your one-stop solution for all things Competitive Programming.
            Track contests, bookmark problems, set reminders and grow your skills.
          </p>
        </div>


        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-green-400 transition">Home</Link></li>
            <li><Link to="/bookmarks" className="hover:text-green-400 transition">Bookmarks</Link></li>
            <li><Link to="/past-contests" className="hover:text-green-400 transition">Past Contests</Link></li>
            <li><Link to="/about" className="hover:text-green-400 transition">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Contact</h4>
          <p className="text-sm text-gray-400 mb-2">Email: sanjeetpatel6969@gmail.com</p>
          <div className="flex gap-4 text-xl mt-2">
            <a
              href="https://github.com/Sanjeet63"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/sanjeet-patel-08785725a/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://x.com/SanjeetPatel04"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Feedback</h4>
          <p className="text-sm text-gray-400 mb-3">
            We’d love to hear your thoughts.
          </p>
          <Link
            to="/feedback"
            onClick={handleFeedbackClick}
            className="inline-block bg-pink-500 hover:bg-pink-600 text-white text-sm py-2 px-4 rounded transition"
          >
            Give Feedback
          </Link>
        </div>

      </div>
      <div className="mt-10 border-t border-gray-800 pt-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} CP Hub. Built with ❤️ for coders.
      </div>
    </footer>
  );
}
