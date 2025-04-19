"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  useSearchParams, 
  useRouter 
} from 'next/navigation';
import FullScreenError from '@/app/components/error';
import SuccessBanner from '@/app/components/successBanner';

const colorOptions = [
  '#FFB4B4', '#FFD1B4', '#FFE0B4', '#D4FFB4', '#B4FFF9', 
  '#D4B4FF', '#E4FBFF', '#A6B37D','#B99470' , '#8E1616'
];

function getInitialsName(name){
  return name
  .split(' ')
  .map((word => word[0]))
  .join("")
  .toUpperCase();
}


export default function EditChildProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get('childId');
  const [updateChild, setUpdateChild] = useState({
    name: "",
    age: "",
    bgcolor: "",
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);


  useEffect(() => {
    const fetchChildren = () => {
      //find children from local storage
      const data = localStorage.getItem('childrenData');
      const childrenList = data ? JSON.parse(data) : [];
      const child = childrenList.find((child) => child.id.toString() === childId);
      
      if (child) {
        setUpdateChild(child);
      } else {
        setError("Child not found.");
      }
    };
    fetchChildren();
  }, [childId]);

  const handleUpdate = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = localStorage.getItem('childrenData');
      const existingChildren = data ? JSON.parse(data) : [];

      const updatedChild = existingChildren.map((child) => 
        child.id.toString() === childId
        ? {
            ...child,
            name: updateChild.name,
            age: updateChild.age,
            avatar: {
              ...child.avatar,
              initials: getInitialsName(updateChild.name),
              bgcolor: updateChild.bgcolor, 
            },
          }
        : child
        );

      localStorage.setItem('childrenData', JSON.stringify(updatedChild));

      setSuccess(true);
      setTimeout(() => {
        router.push("/mainpage/listChildren");
      }, 5000);
    } catch (error) {       
      setError("Failed to update child profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (error) return <FullScreenError message={error} />;

  return (
    <section className="w-full p-8 mb-20 dark:bg-gray-900 transition-colors duration-300">
      {success && (
        <SuccessBanner
          message="Child profile edited successfully!"
          onClose={() => setSuccess(false)}
        />
      )}
      <div className="flex flex-col">
        <div className="mt-2">
          <h1 className="text-xl md:text-2xl font-bold">✏️ Edit Child Profile</h1>
        </div>

        <div className="mt-4 w-full bg-white shrink-0 rounded-2xl shadow-2xl p-6">
          <form onSubmit={handleUpdate}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input 
                type="text"
                placeholder="Name"
                value={updateChild.name}
                onChange={(e) => setUpdateChild({...updateChild, name:e.target.value})}
                className="input input-bordered input-md bg-white w-full max-w-md"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Age</span>
              </label>
              <input 
                type="number"
                placeholder="Age"
                value={updateChild.age}
                onChange={(e) => setUpdateChild({...updateChild, age:e.target.value})}
                className="input input-bordered input-md bg-white w-full max-w-md"
                required
                min="0"
                max="18"
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Select Avatar Background Color</span>
              </label>
              <div className='flex gap-2 flex-wrap'>
                {colorOptions.map((color) => (
                  <div  
                    key={color}
                    className={`cursor-pointer w-12 h-12 rounded-full border-4 transition-all duration-200 ${
                      updateChild.bgcolor === color
                        ? 'border-pink-400 scale-110' 
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setUpdateChild({...updateChild, bgcolor: color})}
                  >
                  </div>
                ))}
              </div>
            </div>

            {updateChild.name && (
              <div className='mt-4'>
                <label>Avatar Preview</label>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow"
                  style={{ backgroundColor: updateChild.bgcolor }}        
                >
                  {getInitialsName(updateChild.name)}
                </div>
              </div>
            )}

            <div className="form-control flex flex-row mt-6 space-x-4 justify-end">
              <button 
                type="submit" 
                className={`
                  btn btn-md border-pink-400 border-2 bg-[#FFB4B4] hover:border-[#FFDEB4] hover:bg-[#FFB4B4]/80 text-white
                  ${isSubmitting ? 'bg-pink-400': ''}
                  disabled:bg-[#FFE0E0] 
                  disabled:border-[#FFB4B4] 
                  disabled:text-gray-400 
                  disabled:cursor-not-allowed
                  `}
                disabled = {isSubmitting}
              >
                { isSubmitting ? 'Saving...' : 'Save'}
              </button>

              <button type="button" className='btn btn-md bg-gray-500 text-white'>
                <Link href={"/mainpage/listChildren"}>
                  Cancel
                </Link>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}