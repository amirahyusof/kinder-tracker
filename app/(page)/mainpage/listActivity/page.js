"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AllActivity from '@/app/interface/activity/AllChildrenActivity';
import FullScreenLoader from '@/app/components/loader';
import FullScreenError from '@/app/components/error';

export default function ChildrenActivities() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get('childId');
  const [child, setChild] = useState(null);
  const [childActivities, setChildActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const start = Date.now();
    try {
      const loadData = () => {
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
  
        const duration = Date.now() - start;
        const remaining = Math.max(2000 - duration, 0); // Ensure non-negative
        setTimeout(() => setLoading(false), remaining);
      }

    } catch (err) {
      console.error('Error fetching child activities:', err);
      setError('Failed to fetch child activities. Please try again later.');
      setLoading(false);
    }
  }, [childId]);

  if (error) return <FullScreenError message={error} /> ;
  
  if (loading) return <FullScreenLoader duration={2000} /> ;
  
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
              Please create activity on the child&apos;s profile by clicking child&apos;s avatar on Home Page.
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