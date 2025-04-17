"use client"

import React from 'react';
import Lottie from 'lottie-react';
import errorAnimation from '@/public/lottie/errorAnimation.json'


export default function FullScreenError({message = "Something went wrong"}){
  return(
    <div className='flex flex-col items-center justify-center h-screen dark:bg-gray-900 dark:text-red-100 text-red-800 bg-[#FFF9CA] transition-colors duration-300 z-50'>
      <div>
        <Lottie
          autoplay
          loop
          animationData={errorAnimation}
          style={{ height: '300px', width: '300px' }}
        />
      </div>
      <h2 className='text-2xl font-bold'>Error</h2>
      <p className='mt-2'>{message}</p>
    </div>
  )
}