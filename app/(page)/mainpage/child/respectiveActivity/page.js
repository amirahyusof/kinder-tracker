"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ListActivity from '@/app/interface/activity/RespectiveChildActivity';
import FullScreenLoader from '@/app/components/loader';
import FullScreenError from '@/app/components/error';


export default function ActivityRespectiveChild() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get('childId');
  const [child, setChild] = useState(null);
  const [childActivities, setChildActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if(!childId) return;

    try {
      //parse child Id as number
      const parsedChildId = parseInt(childId);

      //Load child profiles from local storage
      const storageChildDetail = JSON.parse(localStorage.getItem('childrenData') || '[]');
      const selectedChild = storageChildDetail.find((child)=> child.id === parsedChildId);
      setChild(selectedChild);
      console.log('Child Data in Activity:', storageChildDetail);

      //Load child's activities from local storage
      const storageActivity = JSON.parse(localStorage.getItem('activityData') || '[]');
      const filteredActivity = storageActivity.filter((activity) => activity.childId === childId);
      setChildActivities(filteredActivity);
      console.log('Activity Data of this child:', storageActivity);
      
      console.log("childId from URL:", childId);
      console.log("Parsed childId:", parsedChildId);


      setLoading(false);
    } catch(err) {
      setError("Failed to load data");
      setLoading(false);
    }
    
    }, 5000);
    return () => clearTimeout(timer); // Cleanup the timer on unmount
  
  }, [childId]);

  if (error) return <FullScreenError message={error} />; // Show error message if there's an error

  if (loading) return <FullScreenLoader />; // Show loader while loading data
  

  return (
    <section className='p-6 min-h-screen bg-[#FFF9CA] dark:bg-gray-900 transition-colors duration-300'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center'>
          {child ? (
            <>
              <div className="w-16 h-16 flex rounded-full overflow-hidden mr-4 items-center justify-center border-2 border-gray-400" style={{ backgroundColor: child.avatar.bgcolor }} >
              <span className='text-white text-4xl font-bold'>
                  {child.avatar.initials}
                </span>
              </div>
              <h1 className='text-xl'>
                List Activities for <span className='font-semibold'>{child.name}</span>
              </h1>
            </>
          ) : (
            <p className="text-gray-500">
              Child not found
            </p>
          )}
        </div>


        {/* Buttons for adding activity */}
        <div className='flex items-center'>
          <button 
            onClick={() => router.push(`/mainpage/activities/create?childId=${childId}`)}
            className='flex items-center justify-center w-10 h-10 bg-[#FF9494] text-white font-bold text-2xl rounded-full 
            hover:bg-[#FFD1D1] transition-transform duration-200 ease-in-out hover:scale-110'
          >
            +
          </button>
        </div>
      </div>
      
      {/* Activity List */}
      <div className='flex flex-col'>
        {/* Conditional rendering for tasks */}
        {(!childActivities || childActivities.length === 0) ? (
          <div className="mt-8 text-left ml-10">
            <p className="text-gray-500">No tasks yet</p>
            <p className="text-sm text-gray-400">
              Click "+ Task" to create your child's first task
            </p>
          </div>
          ) : (
            // Display the list of activities if available
          <ListActivity 
            activityData={childActivities}
            setActivityData = {setChildActivities}
            childId={parseInt(childId)}
          />
        )}
      </div>
    </section>
  );
}



