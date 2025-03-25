"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from "@/app/firebase/hook";
import ListActivity from '@/app/interface/ListActivity';
import { routeDB } from '@/app/firebase/api/route';
import Image from 'next/image';

export default function ActivityRespectiveChild() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get('childId');
  const userId = searchParams.get('userId');
  const {user, loading} = useAuth();
  const { getActivity, getChildData } = routeDB();
  const [childDetails, setChildDetails] = useState(null);
  const [childActivities, setChildActivities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(userId && childId){
      const fetchChildAndTasks = async () => {
        try {
          const activities = await getActivity(userId, childId);
          console.log('Activity Data:', activities);
          setChildActivities(activities);

          const children = await getChildData(userId);
          const currentChild = children.find(child => child.id === childId);
          setChildDetails(currentChild);

          setError(null);
        } catch(error){
          console.error('Detailed error fetching child/activities:', error);
          setError("Failed to fetch child or activities");
        }
      };
      fetchChildAndTasks();
    }
  }, [userId, childId, getActivity, getChildData]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className='p-6 min-h-screen bg-[#FFF9CA]'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center'>
          {childDetails && (
            <>
            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
              <Image
                src={childDetails.imageUrl || '/default-avatar.png'} 
                alt={childDetails.name || "Child Avatar"} 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className='text-2xl'>
              Activities for <span>{childDetails.name}</span>
            </h1>
            </>
          )}
        </div>

        <div className='flex flex-row gap-2'>
          <button 
            onClick={() => router.push(`/mainpage/profile/parent/child?userId=${userId}&childId=${childId}`)}
            className='place-items-center mt-4 max-w-xs bg-[#FF9494] text-white px-4 py-2 rounded hover:bg-[#FFD1D1] transition'
          >
            View Profile
          </button>

          <button 
            onClick={() => router.push(`/mainpage/activity/create?userId=${userId}&childId=${childId}`)}
            className='place-items-center mt-4 max-w-xs bg-[#FF9494] text-white px-4 py-2 rounded hover:bg-[#FFD1D1] transition'
          >
            + New Task
          </button>
        </div>
      </div>
      
      
      <div className='flex flex-col'>
        {/* Conditional rendering for tasks */}
        {(!childActivities || childActivities.length === 0) ? (
          <div className="mt-8 text-left">
            <p className="text-gray-500">No tasks yet</p>
            <p className="text-sm text-gray-400">
              Click "Add New Task" to create your first task
            </p>
          </div>
          ) : (
          <ListActivity 
            activityData={childActivities}
            setActivityData = {setChildActivities}
          />
        )}
      </div>
    </section>
  );
}



