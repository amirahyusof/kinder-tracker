"use client"
import { useRouter } from "next/navigation";
import NavBar from "@/app/interface/navbar";
import React from "react";
import UpdateBanner from "@/app/components/updateVersionBanner";
import ExitBanner from "@/app/components/exitBanner"; 
import { X, Home } from "lucide-react";
import { useExitHandler } from "@/app/hook/exithandler"; 

export default function Layout({ children }) {
  const router = useRouter();
  const { 
    showExitBanner, 
    handleExitClick, 
    handleExitConfirm, 
    handleExitCancel, 
    isPWA, 
    isMobile 
  } = useExitHandler(router);

  return (
    <div className="w-full top-0 min-h-screen p-4 bg-[#FFF9CA] dark:bg-gray-900 transition-colors duration-300">
      {/* Exit Banner - Shows when back button is pressed or exit button is clicked */}
      {showExitBanner && (
        <ExitBanner 
          onExit={handleExitConfirm} 
          onCancel={handleExitCancel} 
        />
      )}
      
      {/* Exit/Home Button - Only shows in PWA mode */}
      {isPWA && (
        <button 
          onClick={handleExitClick}
          className="fixed top-4 right-4 z-50 p-2 rounded-2xl flex items-center bg-[#FFB4B4] justify-center shadow-md transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: isMobile ? "rgba(255, 80, 80, 0.9)" : "rgba(255, 180, 180, 1)",
            backdropFilter: "blur(5px)",
          }}
          aria-label={isMobile ? "Exit Application" : "Return to Homepage"}
        >
          {isMobile ? (
            <X size={20} className="text-white" />
          ) : (
            <Home size={20} className="text-white" />
          )}
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