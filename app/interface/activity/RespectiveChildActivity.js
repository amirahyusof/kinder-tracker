"use client"

import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';



export default function ListActivity({ activityData, setActivityData, childId}) {
  const router = useRouter();
  const [deleteTaskId, setDeletingTaskId] = useState(null);

  const handleEditTask = (childId, activityId) => {
    const parsedChildId = parseInt(childId);
    router.push(`/mainpage/activities/edit?childId=${childId}&activityId=${activityId}`);
  };

  const handleDeleteTask = (activityId) => {
    const confirmDelete = window.confirm('Are you sure want to delete this activity?');

    if (confirmDelete) {
      setDeletingTaskId(activityId);

      //get acyivity data from localStorage
      const storageActivity = JSON.parse(localStorage.getItem('activityData') || '[]');
      const activityToDelete = storageActivity.filter(activity => activity.id !== activityId);
      localStorage.setItem('activityData', JSON.stringify(activityToDelete));
      
      
      //update the UI
      setActivityData(activityToDelete.filter(activity => activity.childId === childId));
      setDeletingTaskId(null);
      alert('Activity deleted successfully!');
      router.refresh();
    }
  };

  const uniqueActivities = Array.from(new Map(activityData.map(activity => [activity.id, activity])).values());


  return (
    <section className='mt-6 space-y-4'>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {uniqueActivities.map((activity, index) => (
          <div key={`${activity.id}-${index}`} className="border-2 border-[#FFDEB4] rounded-2xl">
            <div className=" bg-white shadow-md rounded-2xl px-2 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 capitalize">
                  Activity: <span className='capitalize'>{activity.activity}</span>
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
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
                {activity.dueDate ? new Date(activity.dueDate).toLocaleDateString() : "No due date"}
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