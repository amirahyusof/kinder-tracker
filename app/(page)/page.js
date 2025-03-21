
import Link from "next/link";
import Image from "next/image";
import MainImage from "@/public/asset/front-page.jpeg"


export default function Page() {
  return (
    <main className="hero bg-[#FFF9CA] h-screen">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-[#FFB4B4]">Child Activity Tracker</h1>
          <Image
          src={MainImage}
          width={350}
          height={400}
          loading="lazy"
          placeholder="blur"
          alt="Front Image"
          className="w-auto h-auto object-contain"
          />
        </div>

        <div className="mt-4 mx-auto justify-center max-w-sm">
          <Link href="/mainpage">
            <button className="w-56 btn border-white  bg-[#FF9494] hover:bg-[#FFD1D1] text-black text-xl font-bold">
              Start
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
