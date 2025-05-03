
import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
  
export default function AvatarChild({childData}) {
  return (
    <section className='p-4 w-full'>
      <h1 className='text-xl font-bold'>Your Children</h1>
      <div className='flex mt-4 gap-2 overflow-x-auto'>
        {/* Add Profile Button */}
        <div className='avatar placeholder'>
          <Link href={"/mainpage/child"}>
            <div className='w-20 h-20 bg-[#FFB4B4] rounded-full flex items-center justify-center'>
              <span className='text-white'>
                <Plus className='h-10 w-10' />
              </span>
            </div>
            <p className='mt-2 text-sm text-center'>
              Add Profile
            </p>
          </Link>
        </div>

        {/* Render Child Avatars */}
        { childData && Array.isArray(childData) && childData.length === 0 ? (
          <div className='flex items-center ml-4'>
            <p className='text-gray-500'>No child profiles found.</p>
          </div>
          ) : (
          childData.map((child) => (
            <div key={child.id} className='avatar flex flex-col cursor-pointer '>
              {/* Avatar with Link to respective activity */}
              <Link href={`/mainpage/child/respectiveActivity?childId=${child.id}`}>
                <div className='w-20 h-20 rounded-full flex items-center justify-center'
                   style={{ backgroundColor: child.avatar.bgcolor }}
                >
                  <span className='text-white text-4xl font-bold'>
                    {child.avatar.initials}
                  </span>
                </div>
              </Link>
              <p className='text-sm text-center mt-2 text-gray-400'>{child.name || "Unknown"}</p>
            </div>
          ))
          
        )}
          
      </div>
    </section>
  )
}

