import React from "react";

// Custom hook for detecting device type and PWA status
export function useDeviceDetection() {
  const [isPWA, setIsPWA] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isAndroid, setIsAndroid] = React.useState(false);
  const [isIOS, setIsIOS] = React.useState(false);

  React.useEffect(() => {
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
  const [showExitBanner, setShowExitBanner] = React.useState(false);

  React.useEffect(() => {
    if (!isPWA) return;

    // Add a history entry to catch back button presses
    window.history.pushState({ page: "main" }, "", window.location.href);
    
    const handlePopState = (event) => {
      // Only intercept on mobile and especially Android
      if (isMobile) {
        event.preventDefault();
        
        // Show custom exit banner instead of confirm dialog
        setShowExitBanner(true);
        
        // Push a new state to prevent immediate navigation
        window.history.pushState({ page: "exit-dialog" }, "", window.location.href);
      }
    };
    
    window.addEventListener("popstate", handlePopState);
    
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isPWA, isMobile, isAndroid, router]);

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
      // Try multiple exit methods for mobile
      window.location.href = "about:blank";
      setTimeout(() => {
        window.close();
      }, 100);
    } else {
      // For desktop, go to home page
      router.push("/");
    }
  };

  // Function to cancel exit
  const handleExitCancel = () => {
    setShowExitBanner(false);
    // Push another state to maintain history stack
    window.history.pushState({ page: "main" }, "", window.location.href);
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