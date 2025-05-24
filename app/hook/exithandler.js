"use client";
import { useState, useEffect, useRef } from "react";
import { useDeviceDetection } from "./deviceHooks";

export function useExitHandler(router) {
  const { isPWA, isMobile, isAndroid, isIOS } = useDeviceDetection();
  const [showExitBanner, setShowExitBanner] = useState(false);
  const [backButtonCount, setBackButtonCount] = useState(0);
  const backButtonTimerRef = useRef(null);
  const CapacitorAppRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && isPWA) {
      import("@capacitor/app").then(({ App }) => {
        CapacitorAppRef.current = App;

        App.addListener("backButton", () => {
          console.log("Capacitor backButton event");
        });
      });
    }

    if (!isPWA) return;

    const handlePopState = (event) => {
      event.preventDefault();
      if (backButtonCount === 0) {
        setShowExitBanner(true);
        setBackButtonCount(1);

        backButtonTimerRef.current = setTimeout(() => {
          setBackButtonCount(0);
        }, 3000);

        window.history.pushState({ page: "exit-dialog" }, "", window.location.href);
      }
    };

    window.history.pushState({ page: "main" }, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (backButtonTimerRef.current) clearTimeout(backButtonTimerRef.current);
    };
  }, [isPWA, isMobile, isAndroid, backButtonCount]);

  const handleExitClick = () => {
    setShowExitBanner(true);
  };

  const handleExitConfirm = () => {
    const App = CapacitorAppRef.current;

    if (isMobile && isPWA && App) {
      if (isAndroid) {
        router.push("/")
      } else {
        window.location.replace("/");
        setTimeout(() => window.close(), 100);
      }
    } else {
      router.push("/");
    }
  };

  const handleExitCancel = () => {
    setShowExitBanner(false);
    setBackButtonCount(0);
    window.history.replaceState({ page: "main" }, "", window.location.href);
  };

  return {
    showExitBanner,
    handleExitClick,
    handleExitConfirm,
    handleExitCancel,
    isPWA,
    isMobile,
  };
}
