"use client";
import { useEffect, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import loadingAnimation from "@/public/lottie/love-animation"; // adjust if needed

export default function FullScreenLoader({duration = 2000}) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const steps = 100;
    const intervalDuration = duration / steps; // Calculate interval duration based on total duration 
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setPercent(currentStep);
      if (currentStep >= steps) clearInterval(interval);
      
    }, [intervalDuration]);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div className="inset-0 p-6 min-h-screen bg-[#FFF9CA] z-[9999] flex flex-col items-center justify-center text-[#FF9494]">
      <Player
        className="mt-4"
        autoplay
        loop
        src={loadingAnimation}
        style={{ height: "300px", width: "300px" }}
      />
      <h1 className="text-semibold text-2xl ">Loading..</h1>
      <p className="mt-4 text-xl font-semibold animate-pulse">{percent}%</p>
    </div>
  );
}
