import React, {useState, useEffect, useRef} from "react";

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

// Hook for handling back button and exit behavior with custom banner
export function useExitHandler(router) {
  const { isPWA, isMobile, isAndroid } = useDeviceDetection();
  const [showExitBanner, setShowExitBanner] = useState(false);
  const [backButtonCount, setBackButtonCount] = useState(0);
  const backButtonTimerRef = useRef(null);

  useEffect(() => {
    if (!isPWA) return;

    // Handle Android back button specially
    if (isAndroid) {
      let historyLength = window.history.length;
      
      // Add history entry to handle back button
      window.history.pushState({ page: "main" }, "", window.location.href);
      
      const handlePopState = (event) => {
        // Show exit banner on first back press
        if (backButtonCount === 0) {
          event.preventDefault();
          setShowExitBanner(true);
          setBackButtonCount(1);
          
          // Reset back button count after 3 seconds
          backButtonTimerRef.current = setTimeout(() => {
            setBackButtonCount(0);
          }, 3000);
          
          // Push state to prevent immediate navigation
          window.history.pushState({ page: "exit-dialog" }, "", window.location.href);
        } 
      };
      
      window.addEventListener("popstate", handlePopState);
      
      return () => {
        window.removeEventListener("popstate", handlePopState);
        if (backButtonTimerRef.current) {
          clearTimeout(backButtonTimerRef.current);
        }
      };
    } 
    // Non-Android mobile devices
    else if (isMobile) {
      window.history.pushState({ page: "main" }, "", window.location.href);
      
      const handlePopState = (event) => {
        event.preventDefault();
        setShowExitBanner(true);
        window.history.pushState({ page: "exit-dialog" }, "", window.location.href);
      };
      
      window.addEventListener("popstate", handlePopState);
      
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [isPWA, isMobile, isAndroid, backButtonCount]);

  // Function to handle manual exit button click
  const handleExitClick = () => {
    if (isMobile) {
      setShowExitBanner(true);
    } else {
      // For desktop, go directly to home page
      router.push("/");
    }
  };

  // Function to execute on exit confirmation
  const handleExitConfirm = () => {
    if (isMobile && isPWA) {
      // For Android, simply let the back button do its natural thing
      if (isAndroid) {
        // This actually exits the app on Android by letting the system handle the back action
        window.history.go(-2);
      } 
      // For iOS, we try to go back to the homescreen
      else if (isIOS) {
        window.location.replace("/");
        setTimeout(() => {
          window.close();
        }, 100);
      }
      // For other mobile browsers
      else {
        window.close();
      }
    } else {
      // For desktop, go to home page
      router.push("/");
    }
  };

  // Function to cancel exit
  const handleExitCancel = () => {
    setShowExitBanner(false);
    setBackButtonCount(0);
    // Push another state to maintain history stack
    window.history.replaceState({ page: "main" }, "", window.location.href);
  };

  return { 
    showExitBanner, 
    handleExitClick, 
    handleExitConfirm, 
    handleExitCancel, 
    isPWA, 
    isMobile 
  };
}