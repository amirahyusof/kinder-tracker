"use client"

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ReactConfetti from 'react-confetti';
import { PartyPopper } from 'lucide-react';

export default function EditActivityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get('childId');
  const activityId = searchParams.get('activityId');
  const [updatedActivity, setUpdatedActivity] = useState({
    name: '',
    description: '',
    dueDate: '',
    status: 'undone'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRewardAlert, setShowRewardAlert] = useState(false);
  const [previousStatus, setPreviousStatus] = useState('')

  useEffect(() => {
    const fetchTask = async () => {
      if(activityId) {
        try {
          const activity = await getActivityById(userId, childId, activityId);
          setUpdatedActivity(activity);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch activity');
          setLoading(false);
        }
      }
    };

    fetchTask();
  }, [childId, activityId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activityId) return alert('Activity ID is missing.');

    setIsEditing(true);

    try {
      const editActivity = await updateActivity(
        userId, 
        childId, 
        activityId, 
        {
          ...updatedActivity,
          updatedAt: new Date(),
        }, 
      );


      if (previousStatus !== 'done' && updatedActivity.status === 'done'){
        setShowConfetti(true);
        setShowRewardAlert(true);

        setTimeout(()=>{
          setShowConfetti(false);
        }, 5000);

        setTimeout(()=> {
          setShowRewardAlert(false)
        }, 10000);
      }

      console.log('Activity editing with ID:', editActivity);
      alert('Activity editing successfully!');

      if(updatedActivity.status === 'done'){
        setTimeout(() => {
          router.push(`/mainpage/activity?userId=${userId}&childId=${childId}`);
        }, 6000)
      } else {
        router.push(`/mainpage/activity?userId=${userId}&childId=${childId}`);
      }
      
    } catch (error) {
      console.error('Error editing activity:', error);
      setError("Failed to update activity");
      alert('Failed to edit the activity. Please try again.');

    } finally {
      setIsEditing(false);
    }
  };

  const handleCancel= () => {
    router.push(`/mainpage/activity?userId=${userId}&childId=${childId}`);
  }

  if(loading){
    return <div>Loading...</div>;
  }

  if(error){
    return <div>Error: {error}</div>;
  }

  return (
    <section className="p-6 h-screen relative">
      { showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={true}
          numberOfPieces={200}
        />
      )}

      {showRewardAlert && (
        <div className='fixed top-4 right-4 z-50 w-80'>
          <div role='alert' className='alert alret-sucess'>
            <PartyPopper className='h-4 w-4 text-yellow-500' />
            <h2 className='text-yellow-800'>
              Activity Completed! 🎉
            </h2>
            <p className='text-yellow-700'>
              Great job! Don't forget to give a reward for completing this activity!
            </p>
          </div>

        </div>
      )}

      <h1 className="text-xl font-semibold text-gray-600 mb-4"> ✍️ Edit Activity</h1>
      <form onSubmit={handleSubmit} className="w-full p-4">
        {/* Edit activity */}
        <div className="form-control mb-4">
          <label htmlFor="activity" className="label">
            <span className="block text-gray-700 font-medium">Activity</span>
          </label>
          <input
            id="activity"
            type="text"
            className="input-sm flex-1 border-none bg-gray-100 px-3"
            value={updatedActivity.name || ''}
            onChange={(e) => setUpdatedActivity({...updatedActivity, name: e.target.value})}
            required
          />
        </div>

        {/* edit avtivity description */}
        <div className="form-control mb-4">
          <label htmlFor="activityDescription" className="label">
            <span className="block text-gray-700 font-medium">Description</span>
          </label>
          <textarea
            id="activityDescription"
            type="text"
            className="input-md border-none bg-gray-100 p-3 rounded-lg"
            value={updatedActivity.description || ''}
            onChange={(e) => setUpdatedActivity({...updatedActivity, description:e.target.value})}
            required
          />
        </div>

        {/* edit due date */}
        <div className="form-control mb-4">
          <label htmlFor="date" className="label">
            <span className='block text-gray-700 font-medium'>Date</span>
          </label>
          <input
            id="duedate"
            type="date"
            className="input-sm flex-1 border-none bg-gray-100 px-3"
            value={updatedActivity.dueDate || ''}
            onChange={(e) => setUpdatedActivity({...updatedActivity, dueDate:e.target.value})}
          />
        </div>

        {/* Edit status */}
        <div className="form-control mb-4">
          <label className="block mb-2 text-grqy-700 font-medium">Status</label>
          <select
            value={updatedActivity.status || ''}
            onChange={(e) => setUpdatedActivity({...updatedActivity, status: e.target.value})}
            className="w-full p-2 border-none bg-gray-100 px-3 rounded"
          >
            <option value="undone">Undone</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Button */}
        <div className="flex justify-end mt-6 space-x-2 md:space-x-4">
          <button
            type="submit"
            className={`btn rounded-3xl border-green w-[100px] bg-green-400 text-white hover:bg-green-600
               ${isEditing ? 'bg-green-400 cursor-not-allowed' : 'hover:bg-green-400'}`}
            disabled={isEditing}
          >
            {isEditing ? 'Editing...' : 'Save Editing'}
          </button>

          <button 
            type="button" 
            className='btn rounded-3xl border-white bg-red-600 hover:bg-red-400 text-white w-[100px]'
            onClick={() => handleCancel()}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}