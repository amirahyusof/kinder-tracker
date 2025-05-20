"use client"
import { useEffect } from "react";
import NavBar from "@/app/interface/navbar";
import React, { useState } from "react";
import UpdateBanner from "@/app/components/updateVersionBanner";
import { X } from "lucide-react";

export default function Layout({ children }) {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsPWA(isStandalone);
    
    if (isStandalone) {
      // Add a dummy state to history to ensure we can handle back navigation
      window.history.pushState({ page: "main" }, "", window.location.href);
      
      const handlePopState = (event) => {
        // Prevent the default back behavior
        event.preventDefault();
        
        // Show confirmation dialog
        const confirmExit = window.confirm("Do you want to exit the app?");
        
        if (confirmExit) {
          // Try multiple approaches to exit
          window.location.href = "about:blank";
          // Fallback
          window.close();
        } else {
          // User decided not to exit, restore our state
          window.history.pushState({ page: "main" }, "", window.location.href);
        }
      };
      
      window.addEventListener("popstate", handlePopState);
      
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, []);

  // Function to handle explicit exit button press
  const handleExitApp = () => {
    if (window.confirm("Do you want to exit the app?")) {
      window.location.href = "about:blank";
      // Fallback
      window.close();
    }
  };

  return (
    <div className="w-full top-0 min-h-screen p-4 bg-[#FFF9CA] dark:bg-gray-900 transition-colors duration-300">
      {isPWA && (
        <button 
          onClick={handleExitApp}
          className="fixed top-4 right-4 z-50 bg-red-500 text-white p-2 rounded-full"
          aria-label="Exit Application"
        >
          <X size={20} />
        </button>
      )}
      <main className="min-h-screen">
        <UpdateBanner />
        {children}
      </main>
      <NavBar />
    </div>
  );
}

