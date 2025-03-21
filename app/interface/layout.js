import NavBar from "@/app/interface/navbar";
import React from "react";

export default function Layout({ children }) {
  return (
    <div className="w-full top-0 min-h-screen p-4 bg-[#FFF9CA]">
      <main className="min-h-screen">
        {children}
      </main>
      <NavBar />
    </div>
  );
}


