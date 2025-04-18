"use client";

import React, { useState, useEffect} from 'react';
import { 
  useSearchParams, 
  useRouter 
} from 'next/navigation';
import ReactConfetti from 'react-confetti';
import { 
  PartyPopper, 
  CalendarIcon, 
  PencilIcon, 
  CheckCircleIcon 
} from 'lucide-react';
import SuccessBanner from '@/app/components/successBanner';


export default function EditActivity() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get('childId');
  const activityId = searchParams.get('activityId');

  const [updatedActivity, setUpdatedActivity] = useState({
    id: '',
    childId: '',
    activity: '',
    description: '',
    dueDate: '',
    status: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRewardAlert, setShowRewardAlert] = useState(false);
  const [previousStatus, setPreviousStatus] = useState('');
  const [journalEntry, setJournalEntry] = useState("");
  const [success, setSuccess] = useState(false)

  // Fetch activity from localStorage
  useEffect(() => {
    const fetchActivity = () => {
      const stored = localStorage.getItem('activityData');
      const activityList = stored ? JSON.parse(stored) : [];

      const activity = activityList.find(
        (act) => act.id.toString() === activityId && act.childId.toString() === childId
      );

      if (activity) {
        setUpdatedActivity(activity);
        setPreviousStatus(activity.status);
      } else {
        setError("Activity not found.");
      }

      setLoading(false);
    };

    fetchActivity();
  }, [childId, activityId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(true);

    try {
      const storage = localStorage.getItem('activityData');
      const allActivities = storage ? JSON.parse(storage) : [];

      const updatedActivities = allActivities.map((activity) =>
        activity.id.toString() === activityId
          ? {
              ...activity,
              ...updatedActivity,
              updatedAt: new Date().toISOString(),
            }
          : activity
      );

      localStorage.setItem('activityData', JSON.stringify(updatedActivities));

      //save journal only if status is done and entry exists
      if(updatedActivity.status === "done" && journalEntry.trim() !== "") {
        const journalData = JSON.parse(localStorage.getItem('parentJournals')) || [];
        
        const newEntry = {
          id: Date.now(),
          childId: updatedActivity.childId,
          activityId: updatedActivity.id,
          title: updatedActivity.activity,
          activityDescription: updatedActivity.description,
          journal: journalEntry,
          createdAt: new Date().toISOString(),
        };

        localStorage.setItem('parentJournals', JSON.stringify([...journalData, newEntry]));
        console.log("Journal entry saved:", newEntry);
      }


      if (previousStatus !== 'done' && updatedActivity.status === 'done') {
        setShowConfetti(true);
        setShowRewardAlert(true);

        setTimeout(() => setShowConfetti(false), 5000);
        setTimeout(() => setShowRewardAlert(false), 10000);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/mainpage/listActivity");
      }, updatedActivity.status === 'done' ? 6000 : 1000);
    } catch (error) {
      console.error('Error updating activity:', error);
      setError("Failed to update activity");
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    router.push("/mainpage/listActivity");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <section className="bg-yellow-50 p-6 rounded-2xl shadow-lg max-w-lg mx-auto">
      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={300}
        />
      )}

      {showRewardAlert && (
        <div className="fixed top-4 right-4 z-50 w-80 bg-yellow-100 p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2">
            <PartyPopper className="h-6 w-6 text-yellow-600" />
            <div>
              <h2 className="text-yellow-800 font-semibold">Activity Completed! 🎉</h2>
              <p className="text-yellow-700 text-sm">
                Great job! Don’t forget to give a reward for completing this activity!
              </p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <SuccessBanner
          message="Activity updated successfully!"
          onClose={() => setSuccess(false)}
        />
      )}

      <h2 className="text-xl font-semibold text-gray-600 mb-4">✍️ Edit Activity</h2>
      <form onSubmit={handleSubmit} className="w-full p-4">
        {/* Activity name */}
        <div className="form-control mb-4">
          <label htmlFor="activity" className="label">
            <span className="block text-gray-700 font-medium">🎗 Activity</span>
          </label>
          <div className='flex items-center border rounded-lg overflow-hidden'>
            <span className="p-2 bg-gray-200"><PencilIcon size={18} /></span>
            <input
            id="activity"
            type="text"
            className="input-sm flex-1 border-none bg-gray-100 px-3"
            value={updatedActivity.activity}
            onChange={(e) =>
              setUpdatedActivity({ ...updatedActivity, name: e.target.value })
            }
            required
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-control mb-4">
          <label htmlFor="activityDescription" className="label">
            <span className="block text-gray-700 font-medium">🧠 Description</span>
          </label>
          <textarea
            id="activityDescription"
            className="input-md border-none bg-gray-100 p-3 rounded-lg"
            value={updatedActivity.description}
            onChange={(e) =>
              setUpdatedActivity({ ...updatedActivity, description: e.target.value })
            }
            required
          />
        </div>

        {/* Due Date */}
        <div className="form-control mb-4">
          <label htmlFor="dueDate" className="label">
            <span className='block text-gray-700 font-medium'>⏰ Date</span>
          </label>
          <div className='flex items-center border rounded-lg overflow-hidden'>
            <span className="p-2 bg-gray-200"><CalendarIcon size={18} /></span>
            <input
            id="dueDate"
            type="date"
            className="input-sm flex-1 border-none bg-gray-100 px-3"
            value={updatedActivity.dueDate}
            onChange={(e) =>
              setUpdatedActivity({ ...updatedActivity, dueDate: e.target.value })
            }
          />
          </div>
          
        </div>

        {/* Status */}
        <div className="form-control mb-6">
          <label htmlFor="status" className="label font-medium text-gray-700">
            <span className='block text-gray-700 font-medium'>🙂 Status</span>
          </label>
          <span className="text-sm text-gray-500 mb-2">Select the current status of the activity</span>
          <div className='flex items-center border rounded-lg overflow-hidden'>
            <span className="p-2 bg-gray-200"><CheckCircleIcon size={18} /></span>
            <select
            id="status"
            className="input-sm flex-1 border-none bg-gray-100 px-3"
            value={updatedActivity.status}
            onChange={(e) =>
              setUpdatedActivity({ ...updatedActivity, status: e.target.value })
            }
          >
            <option value="undone">Undone</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          </div>
        </div>

        {/* Add journal field only if status is "done" */}
        {updatedActivity.status === "done" && (
          <textarea
            placeholder='Write a journal entry for this activity...'
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            className="w-full p-2 mt-2 border bg-gray-100 rounded-lg mb-4"
          />
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className={`btn rounded-3xl text-white w-[100px] 
              ${ isEditing ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'}`}
            disabled={isEditing}
          >
            {isEditing ? 'Editing...' : 'Save'}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="btn rounded-3xl bg-red-500 text-white hover:bg-red-400 w-[100px]"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
