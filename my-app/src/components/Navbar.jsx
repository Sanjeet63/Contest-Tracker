import { NavLink, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes, FaBell } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import image from "../assets/Logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const notificationRef = useRef();
  const fallbackImage = "/image.png";

  const notifications = [
    {
      title: "👋 Welcome to CP Hub!",
      message: "We’re excited to help you ace your coding journey!",
    }
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClasses = ({ isActive }) =>
    `hover:text-pink-400 transition ${isActive ? "text-pink-500 font-semibold" : ""}`;

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl z-50 bg-gray-900 text-white px-6 py-4 rounded-full shadow-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img src={image} alt="logo" className="w-8 h-8" />
        <h1 className="text-xl font-semibold">
          <span className="text-green-500">CP</span> Hub
        </h1>
      </div>

      <div className="hidden md:flex gap-8 text-sm items-center font-medium">
        <NavLink to="/" className={navLinkClasses}>Home</NavLink>
        <NavLink to="/bookmarks" className={navLinkClasses}>Bookmarks</NavLink>
        <NavLink to="/past-contests" className={navLinkClasses}>Past Contests</NavLink>
        <NavLink to="/about" className={navLinkClasses}>About</NavLink>
      </div>

      <div className="flex items-center gap-4 relative" ref={notificationRef}>
        <button
          onClick={() => {
            setShowNotifications(!showNotifications);
            setHasUnread(false);
          }}
          className="relative text-xl hover:text-pink-400 transition duration-300 hover:scale-110"
        >
          <FaBell />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 bg-pink-500 w-2.5 h-2.5 rounded-full border-2 border-white animate-ping" />
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 top-12 mt-2 w-80 rounded-xl shadow-lg z-50 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border border-gray-700 text-white transition-all duration-300 transform opacity-100 scale-100">
            <div className="px-4 py-3 font-semibold text-pink-400 border-b border-gray-700">Notifications</div>
            <ul className="divide-y divide-gray-700">
              {notifications.map((note, index) => (
                <li key={index} className="px-4 py-3 hover:bg-gray-800 transition">
                  <div className="text-sm font-medium text-pink-300">{note.title}</div>
                  <div className="text-xs text-gray-400">{note.message}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!user ? (
          <Link
            to="/login"
            className="bg-gray-700 hover:bg-pink-600 transition px-4 py-2 rounded-full text-sm font-semibold"
          >
            Login
          </Link>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <img
              src={user.photoURL || fallbackImage}
              alt="profile"
              className="w-8 h-8 rounded-full"
              onError={(e) => { e.target.src = fallbackImage; }}
            />
            <button
              onClick={logout}
              className="bg-gray-700 hover:bg-pink-600 px-3 py-2 rounded-full text-sm text-semibold"
            >
              Logout
            </button>
          </div>
        )}

        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 w-full bg-gray-900 flex flex-col items-center py-4 gap-4 md:hidden rounded-b-xl shadow-md z-40">
          <NavLink to="/" onClick={() => setOpen(false)} className={navLinkClasses}>Home</NavLink>
          <NavLink to="/bookmarks" onClick={() => setOpen(false)} className={navLinkClasses}>Bookmarks</NavLink>
          <NavLink to="/past-contests" onClick={() => setOpen(false)} className={navLinkClasses}>Past Contests</NavLink>
          <NavLink to="/about" onClick={() => setOpen(false)} className={navLinkClasses}>About</NavLink>
          {!user ? (
            <Link to="/login" className="bg-gray-700 hover:bg-pink-500 px-4 py-2 rounded-full text-sm">Login</Link>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <img src={user.photoURL || fallbackImage} alt="profile" className="w-8 h-8 rounded-full" />
              <span className="text-sm">{user.email}</span>
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm mt-2"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
