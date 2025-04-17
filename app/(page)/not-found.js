import Lottie from "lottie-react";
import NotFoundAnimation from "@/public/lottie/notfound-animation.json";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen dark:bg-gray-900 text-[#FFB4B4] dark:text-white bg-[#FFF9CA] transition-colors duration-300 z-50">
      <div className="w-60 h-60">
        <Lottie
          autoplay
          loop
          animationData={NotFoundAnimation}
          style={{ height: '300px', width: '300px' }}
        />
      </div>
      <h2 className="text-2xl font-bold mt-4 ">Page Not Found</h2>
      <p className="mt-2 text-center">The page you're looking for doesn't exist</p>
    </div>
  );
}