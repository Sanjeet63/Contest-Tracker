import { useState } from "react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";

export default function ReminderDialog({ contest, onClose, onSetReminder }) {
  const [email, setEmail] = useState("");
  const [time, setTime] = useState(10);

  const handleSubmit = () => {
    if (!email) return toast.error("Please enter your email");
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Please enter a valid email address");
    onSetReminder({ email, time });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-[#1e293b] text-white p-6 rounded-2xl w-96 relative shadow-lg border border-gray-700">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-pink-500 transition"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold mb-4">Set Reminder</h2>
        <p className="text-sm text-gray-300 mb-3">📅 {contest?.title}</p>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={time}
          onChange={(e) => setTime(parseInt(e.target.value))}
        >
          <option value={10}>10 minutes before</option>
          <option value={30}>30 minutes before</option>
          <option value={60}>1 hour before</option>
        </select>
        <button
          onClick={handleSubmit}
          className="bg-pink-500 hover:bg-pink-600 transition-colors text-white w-full py-2 rounded-xl"
        >
          Set Reminder
        </button>
      </div>
    </div>
  );
}
