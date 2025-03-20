import React from "react";

export default function ReminderDialog({ contest, onClose, onSetReminder }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-80 space-y-4 text-center">
        <h3 className="text-xl font-semibold text-white">
          Set Reminder for <br /> {contest.title}
        </h3>
        <p className="text-sm text-gray-400">When do you want to be reminded?</p>
        <div className="flex justify-around">
          {[10, 20, 30].map((min) => (
            <button
              key={min}
              onClick={() => onSetReminder(min)}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              {min} mins
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 text-sm mt-2 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
