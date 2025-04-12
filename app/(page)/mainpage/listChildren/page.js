"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function ChildrenList() {
  const [childData, setChildData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("childrenData") || "[]");
    console.log("Loaded Children Data:", data);
    setChildData(data);
  }, []);

  const handleDelete = () => {
    const updated = childData.filter((child) => child.id !== id);
    localStorage.setItem("childrenData", JSON.stringify(updated));
    setChildData(updated);
  };

  return (
    <main className="min-h-screen bg-[#FFF9CA] p-6">
      <h1 className="text-3xl font-bold text-[#FF9494] text-center mb-6">🧒🏻 Your Children</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {childData.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">No children added yet.</p>
        ) : (
          childData.map((child) => (
            <div
              key={child.id}
              className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center gap-3 transition hover:scale-105 duration-200"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#FFB4B4]">
                <Image
                  src={child.avatar?.src || "/placeholder.png"}
                  alt={child.avatar?.alt || "Child's avatar"}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <h2 className="text-xl font-semibold text-[#FF9494]">{child.name}</h2>

              <div className="flex gap-2 mt-2">
                <Link href={`/edit-child/${child.id}`}>
                  <button className="px-3 py-1 rounded-md bg-[#FFB4B4] text-white hover:bg-[#FFD1D1]">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(child.id)}
                  className="px-3 py-1 rounded-md bg-red-400 text-white hover:bg-red-300"
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
