import React from "react";
export default function SkeletonLoader({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {[...Array(count)].map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 space-y-4"
        >
          <div className="h-6 bg-white/20 rounded w-2/3"></div>
          <div className="h-4 bg-white/20 rounded w-1/2"></div>
          <div className="h-4 bg-white/10 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
}
