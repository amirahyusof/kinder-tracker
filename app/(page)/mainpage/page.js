"use client"

import React, {useState, useEffect} from "react";
import ActivityCard from "@/app/interface/dashboard/activityCard-Undone";
import AvatarChild from "@/app/interface/dashboard/avatarChild";

export default function Dashboard(){
  const [childData, setChildData] = useState([]);
  const [activityUndoneData, setActivityUndoneData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //get child profile from local storage
    const data = JSON.parse(localStorage.getItem('childrenData') || '[]');
    console.log("Loaded Children Data:", data); // Debugging
    setChildData(data);

    //get list of undone activity from local storage
    const activities = JSON.parse(localStorage.getItem('activityData') || '[]');
    const undoneActivities = activities.filter((data) => data.status === "undone");
    console.log("Loaded Activity Data:", activities); // Debugging
    setActivityUndoneData(undoneActivities);

    setLoading(false);
  }, []);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <section className="bg-[#FFF9CA] md:mx-10">
      <AvatarChild childData={childData} />
      <ActivityCard 
        activityData={activityUndoneData} 
        childData={childData}
      />
    </section>
  );
};
