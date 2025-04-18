"use client"
import { useEffect } from "react";

export default function SuccessBanner({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // auto-dismiss after 3s
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-xl shadow-lg animate-scaleIn w-80 text-center">
        <p className="font-semibold text-lg">🎉 {message}</p>
      </div>
    </div>
  );
}
