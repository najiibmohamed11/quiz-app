import CreateRoom from "./components/CreatRoom";
import Profile from "../components/Profile";
import RoomsList from "./components/RoomsList";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ModeToggle } from "../components/ModeToggle";
export default function Teacher() {
  return (
    <div className="max-w-6xl px-8 min-h-screen mx-auto ">
      <header className=" -700 flex  justify-between mt-4  ">
        <div className="relative w-[150px] h-[50px]">
          <Image
            src="/logo-dark.svg"
            alt="logo for light theme"
            fill
            className="block dark:hidden"
          />
          <Image
            src="/logo-light.svg"
            alt="logo for dark theme"
            fill
            className="hidden dark:block"
          />
        </div>
        <div className="flex gap-4 justify-center">
          <ModeToggle />
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
