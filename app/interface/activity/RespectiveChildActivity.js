"use client"

import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DeleteBanner from '@/app/components/deleteBanner';


export default function ListActivity({ activityData, setActivityData, childId}) {
  const router = useRouter();
  const [deleteTaskId, setDeletingTaskId] = useState(null);
  const [deleteTask, setDeleteTask] = useState(false);

  const handleEditTask = (childId, activityId) => {
    const parsedChildId = parseInt(childId);
    router.push(`/mainpage/activities/edit?childId=${parsedChildId}&activityId=${activityId}`);
  };

  const handleDeleteTask = (activityId) => {
    setDeletingTaskId(activityId);

    //get activity data from localStorage
    const storageActivity = JSON.parse(localStorage.getItem('activityData') || '[]');
    //remove the one with matching id
    const activityToDelete = storageActivity.filter(activity => activity.id !== activityId);
    
    //save the updated activity data to localStorage
    localStorage.setItem('activityData', JSON.stringify(activityToDelete));
    
    
    //update the UI
    setActivityData(activityToDelete);
    
    setDeletingTaskId(null);
    setDeleteTask(true);
    setTimeout(() => {
      router.refresh();
    }, 3000)
    
    
  };

  const uniqueActivities = Array.from(new Map(activityData.map(activity => [activity.id, activity])).values());


  return (
    <section className='mt-6 space-y-4'>
      {deleteTask && (
        <DeleteBanner
          message="Activity deleted successfully!"
          onClose={() => setDeleteTask(false)}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {uniqueActivities.map((activity, index) => (
          <div key={`${activity.id}-${index}`} className="cursor-pointer border-2 border-[#FFDEB4] rounded-2xl">
            <div className=" bg-white shadow-md rounded-2xl p-4 transition hover:scale-105 duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 capitalize">
                  Activity: <span className='capitalize'>{activity.activity}</span>
                </h3>
                <span
                  className={`px-2 py-1 text-xs capitalize font-medium rounded ${
                    activity.status === "done"
                    ? "bg-green-100 text-green-600"
                    : activity.status === "in-progress"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
                  }`}
                >
                {activity.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm">Description: {activity.description}</p>
              <div className="text-gray-600 text-sm">
                <span className='font-medium'> Due Date:</span>{" "}
                {activity.dueDate ? new Date(activity.dueDate).toLocaleDateString("en-GB") : "No due date"}
              </div>

              <div className='card-actions flex items-center justify-end space-x-2'>
                <button
                  type='button'
                  onClick={() => handleEditTask(childId, activity.id)}
                  className="btn btn-xs flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  type='button'
                  onClick={() => handleDeleteTask(activity.id)}
                  className={`flex items-center justify-center w-8 h-8 text-white rounded-full
                    ${deleteTaskId === activity.id ? 'bg-red-400 cursor-not-allowed' : "bg-red-500 hover:bg-red-600"}
                    `}
                  disabled={deleteTaskId === activity.id}
                >
                  {deleteTaskId === activity.id ? '...' : <Trash2 className="h-4 w-4" />}
                </button>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}