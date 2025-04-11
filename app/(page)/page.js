
import Link from "next/link";
import Image from "next/image";
import MainImage from "@/public/asset/front-page.jpeg"


export default function Page() {
  return (
    <main className="bg-[#FFF9CA] min-h-screen flex items-center justify-center px-4 w-full">
      <div className="w-full rounded-3xl bg-white shadow-lg overflow-hidden">
        <div className="w-full relative">
          <Image
            src={MainImage}
            sizes="fill"
            loading="lazy"
            placeholder="blur"
            alt="Front Image" 
            className="object-cover "
          />
        </div>

        <div className="bg-[#FFF9CA]/70 px-6 py-8 text-center rounded-t-3xl -mt-10 relative z-10">
          <h1 className="text-2xl font-bold mb-2 text-[#FFB4B4]">Child Activity Tracker</h1>
          <p className="text-sm text-[#FFB4B4] mb-4">Let’s get started! Track and motivate your child’s daily progress.</p>

          <Link href="/mainpage">
            <button className="w-full py-3 rounded-full border-white  bg-[#FF9494] hover:bg-[#FFD1D1] text-white text-lg font-semibold transition-all">
              Get Start
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
