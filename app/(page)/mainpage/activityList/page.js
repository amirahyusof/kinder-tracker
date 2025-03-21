"use client"

import { routeDB } from "@/app/firebase/api/route";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ActivityList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const { getActivity, getChildData } = routeDB();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      const fetchAllActivities = async () => {
        try {
          setLoading(true);
          // Get all children data first
          const children = await getChildData(userId);
          
          // Create a Map to store unique activities
          const activitiesMap = new Map();
          
          // Fetch activities for each child
          for (const child of children) {
            const childActivities = await getActivity(userId, child.id);
            
            // Add each activity to the map with a unique key
            childActivities.forEach(activity => {
              const uniqueKey = `${child.id}-${activity.id}`;
              activitiesMap.set(uniqueKey, {
                ...activity,
                uniqueKey, // Add the unique key to the activity object
                childName: child.name,
                childAvatar: child.imageUrl || '/placeholder',
                childImageAlt: child.avatarAlt || `${child.name}'s avatar`
              });
            });
          }

          // Convert map to array and sort by creation date
          const uniqueActivities = Array.from(activitiesMap.values()).sort((a, b) => {
            return b.createdAt?.seconds - a.createdAt?.seconds;
          });

          setActivities(uniqueActivities);
        } catch (error) {
          console.error("Error fetching activities:", error);
          setError("Failed to fetch activities");
        } finally {
          setLoading(false);
        }
      };

      fetchAllActivities();
    }
  }, [userId]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <section className="p-6 min-h-screen bg-[#FFF9CA]">
      <h1 className="text-2xl font-bold mb-6">List of Activities</h1>

      {/* Activities Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.uniqueKey} className="card">
              <div className="card-body flex flex-row bg-white w-80 p-4 rounded-lg shadow">
                <div className="w-16 h-16 rounded-xl overflow-hidden">
                  <Image
                    src={activity.childAvatar}
                    alt={activity.childImageAlt}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder'; // Fallback image
                    }}
                  />
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-medium">Activity: <span>{activity.name || 'N/A'}</span></p>
                  <p className="text-sm text-gray-600">Child: <span>{activity.childName}</span></p>
                  <p>Due Date: <span>{activity.dueDate 
                    ? new Date(activity.dueDate).toLocaleDateString() 
                    : "N/A"}</span></p>
                  <p>Status: <span className={
                    activity.status === "undone" 
                      ? "text-red-500" 
                      : "text-green-500"
                  }>
                    {activity.status || "N/A"}
                  </span></p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No activities found</p>
        )}
      </div>
    </section>
  );
}