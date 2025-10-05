"use client";

import CreateRoom from "./components/CreatRoom";
import Profile from "../components/Profile";
import RoomsList from "./components/RoomsList";
import Image from "next/image";
export default function Teacher() {
  return (
    <div className="max-w-6xl px-8 min-h-screen mx-auto ">
      <header className=" -700 flex  justify-between mt-4  ">
        <Image src="logo.svg" alt="log-image" width={150} height={50} />
        <div className="flex gap-4 justify-center">
          <CreateRoom />
          <Profile />
        </div>
      </header>
      {/* <ErrorBoundary fallback={<div>this shit is crashed</div>} > */}
      <RoomsList />
      {/* </ErrorBoundary> */}
    </div>
  );
}
