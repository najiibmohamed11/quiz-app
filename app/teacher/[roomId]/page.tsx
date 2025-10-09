import { getToken } from "@/app/hooks/getToken";
import Back from "./components/Back";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import ReactivePart from "./components/ReactivePart";
interface RoomPageProps {
  params: {
    roomId: string; // The dynamic segment is always a string.
  };
}
export default async function Room({ params }: RoomPageProps) {
  const token = await getToken();
  const { roomId } = params;

  const preloadRoomDetails = await preloadQuery(
    api.room.getRoomDetails,
    {
      roomId: roomId as string,
    },
    { token },
  );
  const preloadStudents = await preloadQuery(
    api.student.getAllStudentsInRoom,
    {
      roomId: roomId as string,
    },
    { token },
  );

  return (
    <div className="mx-auto min-h-screen max-w-6xl">
      <header className="mt-8 flex flex-col gap-3">
        <Back />
      </header>
      <ReactivePart
        preloadRoomDetails={preloadRoomDetails}
        students={preloadStudents}
      />
    </div>
  );
}
