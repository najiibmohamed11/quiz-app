"use client";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import CreateRoom from "./components/CreatRoom";
import { UserButton } from "@clerk/nextjs";
import Profile from "../components/Profile";

export default function Teacher() {
  return (
    <div>
      <header className="flex  justify-around mt-4  ">
        <h1>A</h1>
        <div className="flex gap-4 justify-center">
          <CreateRoom />
          <Profile />
        </div>
      </header>
    </div>
  );
}
