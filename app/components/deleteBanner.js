"use client"
import { useEffect } from "react";

export default function DeleteBanner({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // auto-dismiss after 3s
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-red-100 border border-red-400 text-red-800 px-6 py-4 rounded-xl shadow-lg animate-scaleIn w-80 text-center">
        <p className="font-semibold text-lg">🗑️ {message}</p>
      </div>
    </div>
  );
}