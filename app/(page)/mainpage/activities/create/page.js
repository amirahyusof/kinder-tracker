"use client"

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CalendarIcon, PencilIcon } from "lucide-react";
import SuccessBanner from '@/app/components/successBanner';

export default function CreateActivity() {
  const searchParams = useSearchParams();
  const childId = searchParams.get('childId');
  const [activityData, setActivityData] = useState({
    activity: "",
    description: "",
    dueDate: "", 
    status: 'undone'
    
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();


  const handleSubmitActivity = async (e) => {
    e.preventDefault();

    if (!childId) return alert('Child ID is misssing');
    setIsSubmitting(true);

    //validate inputs
    if(!activityData.activity || !activityData.dueDate){
      setError("Please fill out all required fields");
      setIsSubmitting(false);
      return
    }

    //create activity
    const newActivity = {
      id: Date.now(),
      childId: childId,
      activity: activityData.activity,
      description: activityData.description,
      dueDate: activityData.dueDate,
      status: 'undone',
      createdAt: new Date(),
    }

    //get existing activity from local storage
    const existingActivities = JSON.parse(localStorage.getItem('activityData') || '[]');

    //update existing activity with new activity
    const updatedActivities = [...existingActivities, newActivity];
    localStorage.setItem('activityData', JSON.stringify(updatedActivities));
    
    setSuccess(true);
    setTimeout(() => {
      router.push(`/mainpage/child/respectiveActivity?childId=${childId}`);
    }, 5000)
  };

  return (
    <section className="bg-yellow-50 p-6 rounded-2xl shadow-lg max-w-lg mx-auto mt-10">
      {success && (
        <SuccessBanner
          message="Activity created successfully!"
          onClose={() => setSuccess(false)}
        />
      )}
      
      <h2 className="text-xl font-semibold text-gray-600 mb-4">🎯 Create New Activity</h2>
      <form onSubmit={handleSubmitActivity} className="w-full p-4">
        {/* Get the activity name */}
        <div className="form-control mb-4">
          <label htmlFor="activity" className="label">
            <span className="block text-gray-700 font-medium">🎗 Activity</span>
          </label>
          <div className='flex items-center border rounded-lg overflow-hidden'>
            <span className="p-2 bg-gray-200"><PencilIcon size={18} /></span>
            <input
              id="activity"
              type="text"
              placeholder="e.g: 🎨Drawing"
              className="input-sm flex-1 border-none bg-gray-100 px-3"
              value={activityData.activity}
              onChange={(e) => setActivityData({...activityData, activity:e.target.value})}
              required
            />
          </div>
        </div>

        {/* Get the activity description */}
        <div className="form-control mb-4">
          <label htmlFor="activityDescription" className="label">
            <span className="block text-gray-700 font-medium">🧠 Description</span>
          </label>
          <textarea
            id="activityDescription"
            type="text"
            placeholder="Add a fun description..."
            className="input-md border-none bg-gray-100 p-3 rounded-lg"
            value={activityData.description}
            onChange={(e) => setActivityData({...activityData, description:e.target.value})}
          
          />
        </div>

        {/* Get the due date */}
        <div className="form-control mb-4">
          <label htmlFor="date" className="label">
            <span className='block text-gray-700 font-medium'>⏰ Date</span>
          </label>
          <div className='flex items-center border rounded-lg overflow-hidden'>
            <span className="p-2 bg-gray-200"><CalendarIcon size={18} /></span>
            <input
            id="duedate"
            type="date"
            className="input-sm flex-1 border-none bg-gray-100 px-3"
            value={activityData.dueDate}
            onChange={(e) => setActivityData({...activityData, dueDate:e.target.value})}
            required
          />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-2 md:space-x-4">
          <button
            type="submit"
            className={`btn rounded-3xl border-green w-[100px] bg-green-400 text-white hover:bg-green-600
               ${isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'hover:bg-green-400'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        
          <button
            onClick={() => router.push(`/mainpage/child/respectiveActivity?childId=${childId}`)}
            type="button" 
            className='btn rounded-3xl border-white bg-red-600 hover:bg-red-400 text-white w-[100px]'
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
