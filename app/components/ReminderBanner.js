import React from 'react';

const ReminderBanner = ({ onClose }) => {
  return (
    <div className="flex justify-between items-center bg-yellow-100 text-yellow-800 p-4 border border-yellow-300 rounded shadow-md my-4">
      <p className="text-base font-medium">
      🌞 Don&apos;t forget to check your child’s activities today!
      </p>
      <button className="text-yellow-800 text-xl hover:text-yellow-600" onClick={onClose}>
        ✕
      </button>
    </div>
  );
};



export default ReminderBanner;