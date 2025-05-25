"use client"
import NavBar from "@/app/interface/navbar";
import React from "react";
import UpdateBanner from "@/app/components/updateVersionBanner";

export default function Layout({ children }) {
  return (
    <div className="w-full top-0 min-h-screen p-4 bg-[#FFF9CA] dark:bg-gray-900 transition-colors duration-300">
      <main className="min-h-screen">
        <UpdateBanner />
        {children}
      </main>
      <NavBar />
    </div>
  );
}