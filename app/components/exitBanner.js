"use client"
import React, { useState, useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import sadAnimation from "@/public/lottie/sad-animation";

export default function ExitBanner({ onExit, onCancel, message }) {
  const [isVisible, setIsVisible] = useState(true);

  // Handle exit confirmation
  const handleExit = () => {
    setIsVisible(false);
    onExit();
  };

  // Handle cancel
  const handleCancel = () => {
    setIsVisible(false);
    onCancel();
  };

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onCancel();
    }, 10000);
    return () => clearTimeout(timer);
  }, [onCancel]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[9999] backdrop-blur-sm">
      <div className="border px-6 py-4 rounded-xl bg-[#FFF9CA] shadow-lg animate-scaleIn max-w-md text-center text-[#FF9494]">
        <Player
          className="mt-4"
          autoplay
          loop
          src={sadAnimation}
          style={{ height: "300px", width: "300px" }}
        />
        <h1 className="text-xl font-semibold">
          {message || "Do you want to exit the app?"}
        </h1>
        <div className="flex justify-center gap-4 mt-4 mb-2">
          <button 
            onClick={handleExit}
            className="btn px-6 py-2 rounded-lg border-white bg-[#FFB4B4] hover:border-[#FFDEB4] hover:bg-[#FFB4B4]/80 text-white font-medium transition-all"
          >
            Yes
          </button>
          <button 
            onClick={handleCancel}
            className="btn px-6 py-2 rounded-lg border-white bg-red-500 hover:border-red-500 hover:bg-red-500/80 text-white font-medium transition-all"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}