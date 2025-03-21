"use client"

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { routeDB } from '@/app/firebase/api/route';

export default function CreateActivity() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const childId = searchParams.get('childId');
  const userIdFromParams = searchParams.get('userId');
  const { createActivity } = routeDB();
  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    dueDate: "", 
    status: 'undone'
    
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!childId) return alert('Child ID is misssing');
    const userId = userIdFromParams;
    setIsSubmitting(true);

    try {
      const task = await createActivity(
        userId, 
        childId,
        {
          name: taskData.name,
          description: taskData.description,
          dueDate: taskData.dueDate,
          status: 'undone',
          createdAt: new Date(),
        }, 
      );

      console.log('Activity created with ID:', task);
      alert('Activity created successfully!');
      router.push(`/mainpage/activity?userId=${userId}&childId=${childId}`);

    } catch (error) {
      console.error('Error creating activity:', error);
      alert('Failed to create the activity. Please try again.');

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="p-6 h-screen bg-[#FFF9CA]">
      <h1 className="text-xl mb-4">Create New Activity</h1>
      <form onSubmit={handleSubmit} className="w-full p-6 bg-white mx-auto justify-center rounded-2xl shadow-xl">
        <div className="form-control">
          <label htmlFor="taskName" className="label">
            <span className="text-black">Activity</span>
          </label>
          <input
            id="taskName"
            type="text"
            placeholder="Title"
            className="input input-bordered input-md p-2 bg-[#FFE3E1] w-full"
            value={taskData.name}
            onChange={(e) => setTaskData({...taskData, name:e.target.value})}
            required
          />
        </div>

        <div className="form-control">
          <label htmlFor="taskDescription" className="label">
            <span className="text-black">Description</span>
          </label>
          <textarea
            id="taskDescription"
            type="text"
            placeholder="Description"
            className="input input-bordered input-md p-2 bg-[#FFE3E1] w-full"
            value={taskData.description}
            onChange={(e) => setTaskData({...taskData, description:e.target.value})}
            required
          />
        </div>

        <div className="form-control">
          <label htmlFor="date" className="label">
            <span className='text-black'>Due Date</span>
          </label>
          <input
            id="duedate"
            type="date"
            className="input input-bordered input-md w-full p-2 bg-[#FFE3E1] border rounded"
            value={taskData.dueDate}
            onChange={(e) => setTaskData({...taskData, dueDate:e.target.value})}
          />
        </div>

        <div className="flex justify-end mt-6 space-x-2 md:space-x-4">
          <button
            type="submit"
            className={`btn border-green w-[150px] bg-green-400 text-white hover:bg-green-600
               ${isSubmitting ? 'bg-green-400 cursor-not-allowed`' : 'hover:bg-green-400'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        
          <button
            onClick={() => router.push(`/mainpage/activity?userId=${userIdFromParams}&childId=${childId}`)}
            type="button" 
            className='btn border-white bg-gray-400 text-white w-[150px]'
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
