import { getToken } from "@/app/hooks/getToken";
import Back from "./components/Back";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import ReactivePart from "./components/ReactivePart";
interface RoomPageProps {
  params: {
    quizId: string;
  };
}
export default async function Room({ params }: RoomPageProps) {
  const token = await getToken();
  const { quizId } = await params;
  if (!token) return null;

  const preloadQuizDetails = await preloadQuery(
    api.quiz.getQuizDetails,
    {
      quizId: quizId as string,
    },
    { token },
  );
  const preloadStudents = await preloadQuery(
    api.student.getAllStudentsInRoom,
    {
      quizId: quizId as string,
    },
    { token },
  );

  return (
    <div className="mx-auto min-h-screen max-w-6xl">
      <header className="mt-8 flex flex-col gap-3">
        <Back />
      </header>
      <ReactivePart
        preloadQuizDetails={preloadQuizDetails}
        students={preloadStudents}
        quizId={quizId}
      />
    </div>
  );
}
