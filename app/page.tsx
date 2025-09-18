"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex gap-6 flex-col justify-center items-center min-h-screen ">
      <h2 className="text-xl font-semibold text-purple-900 text-center mb-4">
        I am a...
      </h2>{" "}
      <div className="flex gap-10 ">
        <Link
          href="./sign-in"
          className="w-44 h-34 bg-purple-700 font-medium  text-center items-center flex justify-center text-l text-amber-50 border rounded-lg"
        >
          teacher
        </Link>
        <Link
          href="./student"
          className="w-44 h-34 border-purple-700  font-medium  text-center items-center flex justify-center text-l text-black border rounded-lg"
        >
          student
        </Link>
      </div>
    </div>
  );
}
