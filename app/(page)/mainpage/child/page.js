"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";
import Link from 'next/link';


const colorOptions = [
  '#FFB4B4', '#FFD1B4', '#FFE0B4', '#D4FFB4', '#B4FFF9', '#D4B4FF'
];

function getInitialsName(name){
  return name
  .split(' ')
  .map((word => word[0]))
  .join("")
  .toUpperCase();
}


export default function CreateChildProfile() {
  const [childData, setChildData] = useState({
    name: "", 
    age: "", 
    color: colorOptions[0],
    
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [childCount, setChildCount] = useState(0);
  const [isMaxReached, setIsMaxReached] = useState(false);
  const router = useRouter();

  useEffect(() => {
    //check existing children count from local storage
    const existingChildren = JSON.parse(localStorage.getItem('childrenData') || '[]');
    setChildCount(existingChildren.length);
    setIsMaxReached(existingChildren.length >= 3);
  }, []);

  const handleAddChildProfile = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validate inputs
    if (!childData.name || !childData.age || !childData.color) {
      setError('Please fill out all required fields and select a background color');
      setIsSubmitting(false);
      return;
    }

    //get existing children from local storage
    const existingChildren = JSON.parse(localStorage.getItem('childrenData') || '[]');

    if(existingChildren.length >= 3) {
      setError('Maximum to create child profile is 3');
      setIsSubmitting(false);
      return;
    }

    //create new child profile
    const newChild = {
      id: Date.now(),
      name: childData.name,
      age: childData.age,
      avatar: {
        type: "initials",
        initials: getInitialsName(childData.name),
        bgcolor: childData.color,
      }
    };

    const  updatedChildren = [...existingChildren, newChild];

    //save new child profile to local storage
    localStorage.setItem('childrenData', JSON.stringify(updatedChildren));
    alert('Successfully created child profile!');
    router.push("/mainpage");
  };

  if (error) return <div className="text-center p-6">{error}</div>;

  
  return (
    <section className="w-full p-8 mb-20 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-col">
        <div className="mt-2">
          <h1 className="text-xl md:text-2xl font-bold">Add Child Profile</h1>
        </div>

        {isMaxReached ? (
          <div className='flex flex-col items-center justify-center' >
            <div className="text-red-500 mt-4 text-center">
              Maximum number of child profiles reached. Please delete an existing profile to add a new one.
            </div>
            <button className="mt-4">
              <Link href={"/mainpage"}>
                <button type="button" className='btn border-white bg-[#FFB4B4] hover:border-[#FFDEB4] hover:bg-[#FFB4B4]/80 text-white'>
                  Back to Main Page
                </button>
              </Link>
            </button>
          </div>
          
          ) : (
          <div className="mt-4 w-full bg-white shrink-0 rounded-2xl shadow-2xl p-6">
            <form onSubmit={handleAddChildProfile}>
              {error && <div className="text-red-500 mb-4">{error}</div>}

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input 
                  type="text"
                  placeholder="Name"
                  value={childData.name}
                  onChange={(e) => setChildData({...childData, name:e.target.value})}
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
                  value={childData.age}
                  onChange={(e) => setChildData({...childData, age:e.target.value})}
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
                      className={`cursor-pointer w-12 h-12 rounded-full border-4 ${
                        childData.color === color
                          ? 'border-pink-400 scale-110' 
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setChildData({...childData, color})}
                    >
                    </div>
                  ))}
                </div>
              </div>

              {childData.name && (
                <div className='mt-4'>
                  <label>Avatar Preview</label>
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow"
                    style={{ backgroundColor: childData.color }}        
                  >
                    {getInitialsName(childData.name)}
                  </div>
                </div>
              )}

              <div className="form-control flex flex-row mt-6 space-x-4 justify-end">
                <button 
                  type="submit" 
                  className={`
                    btn btn-md border-pink-400 border-2 bg-[#FFB4B4] hover:border-[#FFDEB4] hover:bg-[#FFB4B4]/80 text-white
                    ${isSubmitting ? '...': 'Adding'}
                    `}
                  disabled = {isSubmitting || isMaxReached}
                >
                  { isSubmitting ? 'Adding...' : 'Add Child'}
                </button>

                <button>
                  <Link href={"/mainpage"}>
                    <button type="button" className='btn btn-md btn-neutral text-white'>
                      Cancel
                    </button>
                  </Link>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}