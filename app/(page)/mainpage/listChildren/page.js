"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FullScreenLoader from "@/app/components/loader";
import FullScreenError from "@/app/components/error";
import DeleteBanner from "@/app/components/deleteBanner";

export default function ChildrenList() {
  const [childData, setChildData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteChild, setDeleteChild] = useState(false);
  const [deleteChildId, setDeletingChildId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const start = Date.now();
    try {
      const loadData = () => {
        const data = JSON.parse(localStorage.getItem("childrenData") || "[]");
        console.log("Loaded Children Data:", data);
        setChildData(data);
        
        const duration = Date.now() - start;
        const remaining = Math.max(2000 - duration, 0); // Ensure non-negative
        setTimeout(() => setLoading(false), remaining);
      }

      loadData(); // Load data immediately

    } catch(err) {
      console.error("Error loading children data:", err);
      setError("Failed to load data. Please try again later.");
      setLoading(false);
    }
    
  }, []);

  const handleEditChild = (childId) => {
    const parsedChildId = parseInt(childId);
    router.push(`/mainpage/child/edit?childId=${parsedChildId}`);
  };

  const handleViewActivity = (childId) => {
    const parsedChildId = parseInt(childId);
    router.push(`/mainpage/child/respectiveActivity?childId=${parsedChildId}`);
  };

  const handleDeleteChild = (childId) => {
    setDeletingChildId(childId);
    

    //remove child from local storage
    const dataChild = JSON.parse(localStorage.getItem("childrenData") || "[]");
    const childToDelete = dataChild.filter((child) => child.id !== childId);
    localStorage.setItem("childrenData", JSON.stringify(childToDelete));
    setChildData(childToDelete);

    //remove associated activity from local storage
    const activities = JSON.parse(localStorage.getItem("activityData") || "[]");
    console.log("Before deletion - activities:", activities);
    console.log("Deleting activities for childId:", childId);
    console.log("Deleting activities for childId (as string):", childId.toString());

    const activityToDelete = activities.filter((activity) => {
      return String(activity.childId) !== String(childId);
    });
    console.log("After deletion - activities:", activityToDelete);
    localStorage.setItem("activityData", JSON.stringify(activityToDelete));

    setDeletingChildId(null);
    setDeleteChild(true);
    setTimeout(() => {
      router.refresh()
    }, 2000); // Show success message for 2 seconds
  };

   if (error) return <FullScreenError message={error} />; // Show error message if there's an error

   if (loading) return <FullScreenLoader duration={2000} />; // Show loader while loading data

  return (
    <main className="min-h-screen bg-[#FFF9CA] p-6 dark:bg-gray-900 transition-colors duration-300">
      {deleteChild && (
        <DeleteBanner
          message="Child's profile deleted successfully!"
          onClose={() => setDeleteChild(false)}
        />
      )}

      <h1 className="text-3xl font-bold text-[#FF9494] text-center mb-6">🧒🏻 Your Children</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {childData.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">No children added yet.</p>
        ) : (
          childData.map((child) => (
            <div key={child.id} className="bg-white cursor-pointer rounded-2xl shadow-md p-4 flex flex-row items-center gap-3 transition hover:scale-105 duration-200">
              <div className="w-10 h-10 md:w-20 md:h-20 rounded-full flex items-center justify-center border-4 border-gray-400"
                style={{ backgroundColor: child.avatar.bgcolor }}
                onClick={() => handleViewActivity(child.id)} 
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
                <button 
                  onClick={() => handleEditChild(child.id)}
                  className="px-3 py-1 rounded-md bg-[#FFB4B4] text-white hover:bg-[#FFB4B4]/80">
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteChild(child.id)}
                  className={`px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-600/80
                    ${deleteChildId === child.id ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                    disabled={deleteChildId === child.id}
                >
                  {deleteChildId === child.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
