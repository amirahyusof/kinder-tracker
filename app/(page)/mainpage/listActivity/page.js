"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AllActivity from '@/app/interface/activity/AllChildrenActivity';
import Image from 'next/image';

export default function ChildrenActivities() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get('childId');
  const [child, setChild] = useState(null);
  const [childActivities, setChildActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  
      //parse child Id as number
      const parsedChildId = parseInt(childId);

      //get child profiles from local storage
      const childData = JSON.parse(localStorage.getItem('childrenData') || '[]');
      setChild(childData);
      console.log('Child Data in localStorage:', childData);

      //get list of child's activities from local storage
      const storageActivity = JSON.parse(localStorage.getItem('activityData') || '[]');
      setChildActivities(storageActivity);
      console.log('Activity Data of this child:', storageActivity);
      
      console.log("childId from URL:", childId);
      console.log("Parsed childId:", parsedChildId);


      setLoading(false);
    
    
  }, []);

  if (error) {
    return <div className="text-red-500 text-center p-6" >Error: {error}</div>;
  }

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  return (
    <section className='p-6 min-h-screen bg-[#FFF9CA] dark:bg-gray-900 transition-colors duration-300'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl'>
          List Activities of Children
        </h1>
      </div>
      
      {/* Activity List */}
      <div className='flex flex-col'>
        {/* Conditional rendering for tasks */}
        {(!childActivities || childActivities.length === 0) ? (
          <div className="mt-8">
            <p className="text-gray-500">No tasks yet</p>
            <p className="text-sm text-gray-400">
              There are no list activity for children.
              Please create activity on the child’s profile by clicking child's avatar on Home Page.
            </p>
          </div>
          ) : (
            // Display the list of activities if available
          <AllActivity 
            activityData={childActivities}
            setActivityData={setChildActivities}
            childData={child}
          />
        )}
      </div>
    </section>
  );
}