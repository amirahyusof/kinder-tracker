"use client";

import Link from "next/link";
import Image from "next/image";
import MainImage from "@/public/asset/front-page.png";
import { useEffect, useState } from "react";
import ExitBanner from "@/app/components/exitBanner";

export default function Page() {
  const [backPressCount, setBackPressCount] = useState(0);
  const [showExitBanner, setShowExitBanner] = useState(false);

  useEffect(() => {
    let timer;

    const handleBackButton = () => {
      if (backPressCount === 0) {
        setBackPressCount(1);
        setShowExitBanner(true);
        
        // Reset counter after 10 seconds (same as your banner auto-dismiss)
        timer = setTimeout(() => {
          setBackPressCount(0);
          setShowExitBanner(false);
        }, 10000);
        
        // Add a state to history to prevent immediate exit
        window.history.pushState({ preventExit: true }, '', window.location.href);
      }
    };

    const handlePopState = (event) => {
      event.preventDefault();
      handleBackButton();
    };

    // Only add event listener if we're in a PWA or mobile environment
    const isPWA = window.navigator.standalone || 
                  window.matchMedia('(display-mode: standalone)').matches;
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isPWA || isMobile) {
      // Push initial state
      window.history.pushState({ initial: true }, '', window.location.href);
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [backPressCount]);

  const handleExitConfirm = () => {
    setShowExitBanner(false);
    handleAppExit();
  };

  const handleExitCancel = () => {
    setShowExitBanner(false);
    setBackPressCount(0);
  };

  const handleAppExit = () => {
    const isPWA = window.navigator.standalone || 
                  window.matchMedia('(display-mode: standalone)').matches;
    
    if (isPWA) {
      // For PWA, try multiple exit strategies
      try {
        // First, try window.close()
        window.close();
      } catch (error) {
        try {
          // If that fails, try navigating to about:blank
          window.location.href = 'about:blank';
        } catch (error) {
          // Last resort, try to minimize
          window.blur();
        }
      }
    } else {
      // For regular browser
      window.close();
    }
  };

  return (
    <>
      <main className="min-h-screen flex items-center justify-center px-4 w-full bg-[#FFF9CA]">
        <div className="w-full rounded-3xl overflow-hidden">
          <div className="w-full relative flex items-center justify-center">
            <Image
              src={MainImage}
              sizes="fill"
              loading="lazy"
              placeholder="blur"
              alt="Front Image" 
              className="object-cover "
            />
          </div>

          <div className="px-6 py-8 text-center rounded-3xl -mt-16 relative z-10 bg-[#FFF9CA]/70">
            <h1 className="text-2xl font-extrabold mb-2 text-[#FF9494]">Kinder Track</h1>
            <p className="text-sm text-[#FFB4B4] mb-4 font-bold">Let&apos;s get started! Track and motivate your child&apos;s daily progress.</p>

            <Link href="/mainpage">
              <button className="w-full py-3 rounded-full border-white bg-[#FF9494] hover:bg-[#FF9494]/80 text-white text-lg font-semibold transition-all">
                Get Start
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Exit Banner for back button */}
      {showExitBanner && (
        <ExitBanner 
          onExit={handleExitConfirm}
          onCancel={handleExitCancel}
        />
      )}
    </>
  );
}
