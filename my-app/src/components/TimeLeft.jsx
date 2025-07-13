import React, { useState, useEffect } from 'react';

const TimeLeft = ({ startTime }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getTheTimeLeft = () => {
    const start = new Date(startTime + "Z");
    const diff = start - now;

    if (diff <= 0) return "Started";
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    return `${h}h ${m}m ${s}s`;
  };

  return (
    <p className="flex items-center text-yellow-400 text-base gap-1">
      ⏳ <span className="font-semibold">{getTheTimeLeft()}</span>
    </p>
  );
};

export default TimeLeft;