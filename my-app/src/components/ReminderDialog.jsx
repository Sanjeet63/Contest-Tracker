// ReminderDialog.jsx
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function ReminderDialog({ contest, onClose, onSetReminder }) {
  const [email, setEmail] = useState("");
  const [time, setTime] = useState(10); // default 10 mins before

  const handleSubmit = () => {
    if (!email) return alert("Email is required!");
    onSetReminder({ email, time });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white text-black p-6 rounded-xl w-80 relative space-y-4">
        <button
          className="absolute top-3 right-3 text-black"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <h2 className="text-xl font-semibold mb-4">Set Reminder</h2>
        <p className="text-sm mb-2">Contest: {contest?.title}</p>
        <input
          type="email"
          placeholder="Your Email"
          className="w-full border px-2 py-1 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          className="w-full border px-2 py-1 rounded"
          value={time}
          onChange={(e) => setTime(parseInt(e.target.value))}
        >
          <option value={10}>10 minutes before</option>
          <option value={30}>30 minutes before</option>
          <option value={60}>1 hour before</option>
        </select>
        <button
          className="bg-pink-500 text-white w-full py-2 rounded hover:bg-pink-600"
          onClick={handleSubmit}
        >
          Set Reminder
        </button>
      </div>
    </div>
  );
}
