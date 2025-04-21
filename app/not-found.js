"use client"

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import NotFoundAnimation from "@/public/lottie/notfound-animation";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player), 
  { ssr: false }
);

export default function NotFound() {
  return (
    <div className="w-full flex flex-col items-center justify-center h-screen dark:bg-gray-900 text-[#FFB4B4] dark:text-white bg-[#FFF9CA] transition-colors duration-300 z-50">
      <div className="mb-4">
        <Player
          autoplay
          loop
          src={NotFoundAnimation}
          style={{ height: '300px', width: '300px' }}
        />
      </div>
      <h2 className="text-2xl font-bold mt-4 ">Page Not Found</h2>
      <p className="mt-2 text-center">The page you&apos;re looking for doesn&apos;t exist</p>
      <button className="mt-4 px-4 py-2 bg-[#FFB4B4] text-white rounded hover:bg-[#FF9A9A] transition-colors duration-300">
        <Link href="/" className="text-center">Go Back Home</Link> 
      </button>
    </div>
  );
}