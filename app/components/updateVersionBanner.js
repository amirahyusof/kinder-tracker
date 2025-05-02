"use client";
import { useState, useEffect } from "react";
import { CURRENT_APP_VERSION } from "@/lib/constants";

export default function UpdateBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const storedVersion = localStorage.getItem("appVersion");

    if (storedVersion !== CURRENT_APP_VERSION) {
      setShowBanner(true);
      localStorage.setItem("appVersion", CURRENT_APP_VERSION);
    }
  }, []);

  if (!showBanner) return null;

  return (
    <div className="bg-yellow-200 text-yellow-800 p-4 text-center text-sm md:text-base flex flex-col md:flex-row items-center justify-between gap-2">
      🆕 New version {CURRENT_APP_VERSION} is available. You may refresh to see the latest updates.
      <div className="flex gap-2">
        <button
          className="bg-yellow-300 px-3 py-1 rounded hover:bg-yellow-400"
          onClick={() => window.location.reload()}
        >
          Refresh Now
        </button>
        <button
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          onClick={() => setShowBanner(false)}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
