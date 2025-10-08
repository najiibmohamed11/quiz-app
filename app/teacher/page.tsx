import CreateRoom from "./components/CreatRoom";
import Profile from "../components/Profile";
import RoomsList from "./components/RoomsList";
import { ModeToggle } from "../components/ModeToggle";
import { Rubik } from "next/font/google";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getToken } from "../hooks/getToken";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default async function Teacher() {
  const token = await getToken();

  const preloadedTasks = await preloadQuery(
    api.room.getRooms,
    {},
    { token: token },
  );

  return (
    <div className="max-w-6xl px-8 min-h-screen mx-auto ">
      <header className=" h-fit  flex  justify-between mt-4 text-2xl font-bold ">
        <h1 className={`${rubik.className}`}>knowy</h1>

        <div className="flex gap-4 justify-center">
          <ModeToggle />
          <CreateRoom />
          <Profile />
        </div>
      </header>
      <RoomsList />
    </div>
  );
}
