"use client";

import React, { useState, useEffect, useContext } from "react";
import ActivityCard from "@/app/interface/dashboard/activityCard-Undone";
import AvatarChild from "@/app/interface/dashboard/avatarChild";
import ReminderBanner from "@/app/components/ReminderBanner";

export default function Homepage(){
  const [childData, setChildData] = useState([]);
  const [activityUndoneData, setActivityUndoneData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReminder, setShowReminder] = useState(false);

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

    //Check daily reminder
    const reminderSetting = JSON.parse(localStorage.getItem("dailyReminder") || "false");
    setShowReminder(reminderSetting);

    setLoading(false);
  }, []);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <section className= "bg-[#FFF9CA]  md:mx-10 dark:bg-gray-900 transition-colors duration-300" >
      {showReminder && <ReminderBanner /> }
      <AvatarChild childData={childData} />
      <ActivityCard 
        activityData={activityUndoneData} 
        childData={childData}
      />
    </section>
  );
};
