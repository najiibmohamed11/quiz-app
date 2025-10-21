"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h2 className="mb-4 text-center text-xl font-semibold">I am a...</h2>{" "}
      <div className="flex gap-10">
        <Link
          href="/teacher"
          className="bg-primary flex h-34 w-44 items-center justify-center rounded-lg border text-center font-medium text-white dark:text-black"
        >
          teacher
        </Link>
        <Link
          href="/find-room"
          className="text-l flex h-34 w-44 items-center justify-center rounded-lg border border-[#A5D6A7] text-center font-medium dark:text-white"
        >
          student
        </Link>
      </div>
    </div>
  );
}
