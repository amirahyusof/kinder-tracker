"use client"

import React from 'react';
import { routeDB } from '@/app/firebase/api/route';
import ChildProfile from './create-child-profile';
import { useSearchParams } from "next/navigation";
import { useAuth } from '@/app/firebase/hook';

export default function ProfileChildPage() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  const { user, loading} = useAuth()

  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user is logged in, redirect or show an error
  if (!userId) {
    return <div>Please log in to create a child profile</div>;
  }

  // Pass the entire user object or combine current user and user data
  const combinedUserData = {
    ...user,
    uid: user.uid,
  };

  return <ChildProfile data={combinedUserData} />;
}