"use client";
import { useEffect, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import loadingAnimation from "@/public/lottie/love-animation"; // adjust if needed

export default function FullScreenLoader() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setPercent((prev) => {
        if (prev < 100) return prev + 1;
        clearInterval(interval);
        return 100;
      });
    }, 50); // adjust speed if needed

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 p-6 min-h-screen bg-[#FFF9CA] z-[9999] flex flex-col items-center justify-center text-[#FF9494]">
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
