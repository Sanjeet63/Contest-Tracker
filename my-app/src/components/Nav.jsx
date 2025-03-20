import { Link } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const fallbackImage = "/image.png"; // make sure this image exists in your public folder

  return (
    <nav className="bg-gray-900 text-white px-6 sm:px-8 py-4 flex items-center justify-between shadow-lg relative z-50">
      <h1 className="text-2xl font-bold">CP Hub</h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 text-base items-center">
        <Link className="hover:text-yellow-400" to="/">Home</Link>
        <Link className="hover:text-yellow-400" to="/bookmarks">Bookmarks</Link>
        <Link className="hover:text-yellow-400" to="/past-contests">Past Contests</Link>
        <Link className="hover:text-yellow-400" to="/about">About</Link>

        {!user ? (
          <Link className="hover:text-yellow-400" to="/login">Login</Link>
        ) : (
          <div className="flex items-center gap-3">
            <img
              src={user.photoURL || fallbackImage}
              alt="profile"
              className="w-8 h-8 rounded-full"
              loading="lazy"
              onError={(e) => { e.target.src = fallbackImage; }}
            />
            <button
              onClick={logout}
              className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <button
        className="md:hidden text-xl focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Dropdown */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-gray-900 flex flex-col items-center py-4 gap-4 md:hidden shadow-md">
          <Link onClick={() => setOpen(false)} className="hover:text-yellow-400" to="/">Home</Link>
          <Link onClick={() => setOpen(false)} className="hover:text-yellow-400" to="/bookmarks">Bookmarks</Link>
          <Link onClick={() => setOpen(false)} className="hover:text-yellow-400" to="/past-contests">Past Contests</Link>
          <Link onClick={() => setOpen(false)} className="hover:text-yellow-400" to="/about">About</Link>

          {!user ? (
            <Link onClick={() => setOpen(false)} className="hover:text-yellow-400" to="/login">Login</Link>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <img
                src={user.photoURL || fallbackImage}
                alt="profile"
                className="w-8 h-8 rounded-full"
                loading="lazy"
                onError={(e) => { e.target.src = fallbackImage; }}
              />
              <span className="text-sm">{user.email}</span>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
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
