"use client";
import { useState, useEffect } from "react";

// Custom hook for detecting device type and PWA status
export function useDeviceDetection() {
  const [isPWA, setIsPWA] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const checkPWA = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches || 
                          window.navigator.standalone || 
                          document.referrer.includes("android-app://");
      setIsPWA(isStandalone);
    };

    // Check device type
    const checkDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      
      // Check if mobile
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      setIsMobile(mobile);
      
      // Check specific platforms
      setIsAndroid(/Android/i.test(userAgent));
      setIsIOS(/iPhone|iPad|iPod/i.test(userAgent));
    };

    checkPWA();
    checkDevice();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleChange = (e) => setIsPWA(e.matches);
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Listen for resize to detect orientation changes
    window.addEventListener("resize", checkDevice);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return { isPWA, isMobile, isAndroid, isIOS };
}