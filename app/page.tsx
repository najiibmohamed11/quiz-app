"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex gap-6 flex-col justify-center items-center min-h-screen ">
      <h2 className="text-xl font-semibold  text-center mb-4">I am a...</h2>{" "}
      <div className="flex gap-10 ">
        <Link
          href="/sign-in"
          className="w-44 h-34 bg-primary text-white dark:text-black font-medium  text-center items-center flex justify-center  border rounded-lg"
        >
          teacher
        </Link>
        <Link
          href="/findroom"
          className="w-44 h-34 border-[#A5D6A7] dark:text-white  font-medium  text-center items-center flex justify-center text-l border rounded-lg"
        >
          student
        </Link>
      </div>
    </div>
  );
}
