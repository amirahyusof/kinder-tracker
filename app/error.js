'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100">
      <h2 className="text-xl font-bold">Something went wrong!</h2>
      <p className="mt-2">{error?.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
