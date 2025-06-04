"use client"

import React, { useState } from 'react';
import { ScrollText, Settings, Candy, Sticker, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import ExitBanner from '@/app/components/exitBanner';

export default function NavBar() {
  const [error, setError] = useState('');
  const [showExitBanner, setShowExitBanner] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleExitClick = (e) => {
    e.preventDefault();
    setShowExitBanner(true);
  }

  const handleExitConfirm = (e) => {
    setShowExitBanner(false);
    if(pathname === '/'){
      handlePWAExit();
    } else {
      router.push("/")
    }
  }

  const handleExitCancel =() => {
    setShowExitBanner(false)
  }

  const handlePWAExit = () => {
    // For PWA, try different exit strategies
    if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
      // Try to close the PWA
      try {
        window.close();
      } catch (error) {
        // If window.close() doesn't work, navigate to a blank page
        window.location.href = 'about:blank';
      }
    } else {
      // For regular browser, just close the tab/window
      window.close();
    }
  };

  const navItems = [
    { href: "/mainpage", icon: ScrollText, label: 'Main' },
    { href: "/mainpage/listActivity", icon: Sticker, label: 'Activity' },
    { href: "/mainpage/listChildren", icon: Candy, label: 'Children' },
    { href: "/mainpage/more", icon: Settings, label: 'More' },
  ];

  return (
    <>
      {/* Navigation bar bottom */}
        <div className="fixed bottom-0 left-0 right-0 flex flex-row justify-center mx-auto w-11/12 rounded-2xl bg-[#FFB4B4] text-white">
          <div className="p-4 mx-6 sm:mx-0">
            <nav>
              <ul className="grid grid-cols-5 gap-16 md:gap-24">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    href={item.href}
                    className="flex flex-col items-center rounded-lg transition-colors"
                  >
                    <item.icon size={30} className='hover:bg-[#FFDEB4]/70 rounded-lg' />
                    <span className="items-center">{item.label}</span>
                  </Link>
                </li>
              ))}

                <li>
                  <button
                    onClick={handleExitClick}
                    className='flex flex-col items-center rounded-lg transition-colors'
                  >
                    <X size={30} className='hover:bg-[#FFDEB4]/70 rounded-lg' />
                    <span className='items-center text-xs'>Close</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Spacer for mobile layout */}
      <div className="h-16 md:h-0"></div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded shadow-lg">
          {error}
        </div>
      )}

      {showExitBanner &&(
        <ExitBanner 
          onExit={handleExitConfirm}
          onCancel={handleExitCancel}
        />
      )}
    </>
  );
}




