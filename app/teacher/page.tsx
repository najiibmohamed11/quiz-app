"use client";

import CreateRoom from "./components/CreatRoom";
import Profile from "../components/Profile";
import RoomsList from "./components/RoomsList";
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
      <RoomsList />
      {/* </ErrorBoundary> */}
    </div>
  );
}
