"use client";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import CreateRoom from "./components/CreatRoom";
import { UserButton } from "@clerk/nextjs";
import Profile from "../components/Profile";
import { CircleHelp, Menu, MenuSquareIcon, Pause, Users } from "lucide-react";
import RoomsList from "./components/RoomsList";
import ErrorBoundary from "./components/ErrorBoundary";
export default function Teacher() {
  return (
    <div className="max-w-6xl px-8 min-h-screen mx-auto ">
      <header className=" -700 flex  justify-between mt-4  ">
        <h1>A</h1>
        <div className="flex gap-4 justify-center">
          <CreateRoom />
          <Profile />
        </div>
      </header>
         {/* <ErrorBoundary fallback={<div>this shit is crashed</div>} > */}
      <RoomsList/>
         {/* </ErrorBoundary> */}
    </div>
  );
}


