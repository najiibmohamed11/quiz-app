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
    <div className="mx-auto min-h-screen max-w-6xl px-8">
      <header className="mt-4 flex h-fit justify-between text-2xl font-bold">
        <h1 className={`${rubik.className}`}>knowy</h1>

        <div className="flex justify-center gap-4">
          <ModeToggle />
          <CreateRoom />
          <Profile />
        </div>
      </header>
      <RoomsList preloadedTasks={preloadedTasks} />
    </div>
  );
}
