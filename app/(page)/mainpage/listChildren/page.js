"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FullScreenLoader from "@/app/components/loader";
import FullScreenError from "@/app/components/error";

export default function ChildrenList() {
  const [childData, setChildData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        const data = JSON.parse(localStorage.getItem("childrenData") || "[]");
        console.log("Loaded Children Data:", data);
        setChildData(data);
        setLoading(false);
      }, 5000); // Simulate a 5 second loading time
      return () => clearTimeout(timer); // Cleanup the timer on unmount

    } catch(err) {
      console.error("Error loading children data:", err);
      setError("Failed to load data. Please try again later.");
      setLoading(false);
    }
    
  }, []);

  const handleDelete = () => {
    const updated = childData.filter((child) => child.id !== id);
    localStorage.setItem("childrenData", JSON.stringify(updated));
    setChildData(updated);
  };

   if (error) return <FullScreenError message={error} />; // Show error message if there's an error

   if (loading) return <FullScreenLoader />; // Show loader while loading data

  return (
    <main className="min-h-screen bg-[#FFF9CA] p-6 dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-3xl font-bold text-[#FF9494] text-center mb-6">🧒🏻 Your Children</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {childData.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">No children added yet.</p>
        ) : (
          childData.map((child) => (
            <div key={child.id} className="bg-white cursor-pointer rounded-2xl shadow-md p-4 flex flex-row items-center gap-3 transition hover:scale-105 duration-200">
              <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-gray-400"
                style={{ backgroundColor: child.avatar.bgcolor }} 
              >
                <span className='text-white text-4xl font-bold'>
                  {child.avatar.initials}
                </span>
              </div>

              <div className="flex flex-col">
                <h2 className="text-xl font-semibold text-[#FF9494]">{child.name}</h2>
                <p className="text-gray-500 text-sm">{child.age} years old</p>
              </div>
              

              <div className="flex justify-end gap-2 ml-auto">
                <Link href={`/edit-child/${child.id}`}>
                  <button className="px-3 py-1 rounded-md bg-[#FFB4B4] text-white hover:bg-[#FFB4B4]/80">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(child.id)}
                  className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-600/80"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
