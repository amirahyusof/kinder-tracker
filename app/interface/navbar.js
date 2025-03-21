"use client"

import { Menu, Bell, LogOut, Home, User, Settings, Sticker } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useAuth } from '../firebase/hook';
import { useRouter, useSearchParams } from 'next/navigation';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId')
  const { logout } = useAuth();
  const router = useRouter();

  if (!userId) {
    console.error("UserId is missing from the URL. Ensure it is provided.");
    return null;
  }

  const handleLogOut = async(e) => {
    e.preventDefault();
    setError('');

    try {
      await logout();
      router.push('/signout');
    } catch(error) {
      setError("Failed to log out.");
      console.log(error);
    }
  };

  const navItems = [
    { href: `/mainpage?userId=${userId}`, icon: Home, label: 'Home' },
    { href: `/mainpage/profile/parent?userId=${userId}`, icon: User, label: 'Profile' },
    { href: `/mainpage/activityList?userId=${userId}`, icon: Sticker, label: 'Activity' },
    { href: `/mainpage/setting?userId=${userId}`, icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-[#FFB4B4] text-white z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-[#FFDEB4] rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <h1 className="text-xl font-bold">My Family</h1>
          
          <button className="p-2 hover:bg-[#FFDEB4] rounded-lg transition-colors">
            <Bell size={24} />
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#FFB4B4] shadow-lg">
            <nav className="px-2 py-3">
              <ul className="space-y-1">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link 
                      href={item.href}
                      className="flex items-center px-4 py-3 hover:bg-[#FFDEB4] rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon size={20} />
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <button 
                    onClick={handleLogOut}
                    className="w-full flex items-center px-4 py-3 hover:bg-[#FFDEB4] rounded-lg transition-colors"
                  >
                    <LogOut size={20} />
                    <span className="ml-3">Sign Out</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-[#FFB4B4] text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8">My Family</h1>
          <nav>
            <ul className="space-y-4">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    href={item.href}
                    className="flex items-center px-4 py-3 hover:bg-[#FFDEB4] rounded-lg transition-colors"
                  >
                    <item.icon size={20} />
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* Desktop Footer */}
        <div className="mt-auto p-6">
          <button 
            onClick={handleLogOut}
            className="w-full flex items-center px-4 py-3 hover:bg-[#FFDEB4] rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="ml-3">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Notification Bell for Desktop */}
      <div className="hidden md:block fixed top-6 right-6 z-50">
        <button className="p-2 bg-[#FFB4B4] hover:bg-[#FFDEB4] rounded-lg transition-colors text-white">
          <Bell size={24} />
        </button>
      </div>

      {/* Spacer for mobile layout */}
      <div className="h-16 md:h-0"></div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded shadow-lg">
          {error}
        </div>
      )}
    </>
  );
}




