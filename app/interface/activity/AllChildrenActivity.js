"use client"

import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DeleteBanner from '@/app/components/deleteBanner';


export default function ListActivity({ activityData, setActivityData, childData}) {
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
    const activityToDelete = storageActivity.filter(activity => activity.id !== activityId);
    localStorage.setItem('activityData', JSON.stringify(activityToDelete));
    
    
    //update the UI
    setActivityData(activityToDelete);
    
    setDeletingTaskId(null);
    setDeleteTask(true);
    setTimeout(() => {
      router.refresh();
    }, 3000)
  
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "done":
        return "🥳 Done";
      case "in-progress":
        return "🫣 In Progress";
      default:
        return "🥹 Not started yet";
    }
  };

  if (!activityData || activityData.length === 0) {   
    return (
      <div className="text-center p-6 bg-[#FFB4B4] text-black rounded-lg">
        <p className="text-gray-700">No activities yet! Click the child’s profile to add one.</p>
      </div>
    );
  }


  return (
    <section className='mt-6 space-y-4'>
      {deleteTask && (
        <DeleteBanner
          message="Activity deleted successfully!"
          onClose={() => setDeleteTask(false)}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Display each activity card */}
        { activityData.map((data) => {
          //find the corresponding child data
          const child = childData.find((child) => child.id.toString() === data.childId);

          return(
            <div key={data.id} className="cursor-pointer border-2 border-[#FFDEB4] rounded-2xl transition hover:scale-105 duration-200">
            <div className=" bg-white shadow-md rounded-2xl px-2 py-4 flex flex-row items-center justify-between">
              <div className="px-2">
                <h3 className="font-semibold text-gray-600 text-sm">
                  Activity:
                  <span className="capitalize text-md"> {data.activity} </span>
                </h3>

                {/* Display child's description of activity */}
                <p className="text-gray-600 text-sm">Description: {data.description}</p>
              
                {/* Display due date of activity */}
                <div className="text-gray-600 text-sm">
                  <span className='font-medium'> Due Date:</span>{" "}
                  {data.dueDate ? new Date(data.dueDate).toLocaleDateString("en-GB") : "No due date"}
                </div>

                {/* Display status activity */}
                <div className="text-gray-600 text-sm">
                  <span className='font-medium'>Status:</span>{" "}
                  {/* Display status with different colors and emoji */}    
                  <span
                    className={`px-2 py-1 text-sm font-medium rounded ${
                      data.status === "done"
                      ? " bg-green-100 text-green-600"
                      : data.status === "in-progress"
                      ? "bg-yellow-100 text-yellow-600"
                      : " w-16 bg-red-100 text-red-600"
                    }`}
                  >
                    {getStatusDisplay(data.status)}
                  </span>
                </div>
              </div>

              <div className='px-2'>
                {/* display child's avatar and name */}
                { child ? (
                    <div className="flex flex-col items-center mt-2">
                      <div className="w-12 h-12 rounded-full flex overflow-hidden items-center justify-center border-2 border-gray-300" style={{ backgroundColor: child.avatar.bgcolor }} >
                      <span className='text-white text-2xl font-bold'>
                        {child.avatar.initials}
                      </span>
                      </div>
                      <h2 className="font-semibold py-1">{child.name}</h2>
                    </div>
                  ) : (
                      <p>Child not found</p>
                  )}
                
                {/* Edit and Delete buttons */}
                <div className='card-actions flex items-center justify-end space-x-2'>
                  <button
                    type='button'
                    onClick={() => handleEditTask(data.childId, data.id)}
                    className="btn btn-xs flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    type='button'
                    onClick={() => handleDeleteTask(data.id)}
                    className={`flex items-center justify-center w-8 h-8 text-white rounded-full
                      ${deleteTaskId === data.id ? 'bg-red-400 cursor-not-allowed' : "bg-red-500 hover:bg-red-600"}
                      `}
                    disabled={deleteTaskId === data.id}
                  >
                    {deleteTaskId === data.id ? '...' : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          );
        })};
      </div>
    </section>
  );
}