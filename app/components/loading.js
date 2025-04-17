"use client";

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-[#FFF9CA] flex flex-col items-center justify-center text-center gap-4 dark:bg-black text-black dark:text-white transition-colors duration-300">
      <div className="loading loading-spinner loading-lg text-pink-400"></div>
      <p className="text-lg font-semibold text-[#FF9494]">Loading, please wait...</p>
    </div>
  );
}
