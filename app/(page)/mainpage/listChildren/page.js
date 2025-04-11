import React from 'react';

// This is a simple child profile component that displays a list of child profiles
// You can replace the hardcoded data with dynamic data from your application state or API

export default function ListChildren(){
  const childProfiles = [
    { id: 1, name: 'John Doe', age: 10 },
    { id: 2, name: 'Jane Smith', age: 8 },
    { id: 3, name: 'Sam Wilson', age: 12 },
  ];

  return (
    <div>
      <h1>Child Profiles</h1>
      <ul>
        {childProfiles.map((child) => (
          <li key={child.id}>
            <h2>{child.name}</h2>
            <p>Age: {child.age}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};