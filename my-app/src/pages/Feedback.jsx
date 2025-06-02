import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Feedback = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          email: user?.email || 'Anonymous',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('✅ Feedback sent successfully!');
        setMessage('');
      } else {
        setStatus(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('❌ Error sending feedback.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-4">
      <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl p-6 w-full max-w-md border border-white/10 mt-20">
        <h2 className="text-3xl font-bold text-center text-pink-400 mb-2">We’d love your thoughts!</h2>
        <p className="text-center text-gray-300 mb-6">Tell us how we can improve ✨</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="message" className="text-sm text-gray-400">Your Message</label>
            <textarea
              id="message"
              rows="5"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-[#1f2937] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your feedback..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition duration-200"
          >
            🚀 Submit Feedback
          </button>
        </form>

        {status && <p className="text-center mt-4 text-sm text-gray-300">{status}</p>}
      </div>
    </div>
  );
};

export default Feedback;
