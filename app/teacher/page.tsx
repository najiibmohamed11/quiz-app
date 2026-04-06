// app/teacher/page.tsx
import CreateRoom from "./components/CreatRoom";
import Profile from "../components/Profile";
import { ModeToggle } from "../components/ModeToggle";
import { Rubik } from "next/font/google";
import { getToken } from "../hooks/getToken";
import Link from "next/link";
import { Suspense } from "react";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import QuizList from "./components/QuizList";
import TeacherLoading from "./components/Loading";


const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default async function Teacher() {


  return (
    <div className="mx-auto min-h-screen max-w-6xl px-8">
      <header className="mt-4 flex h-fit justify-between text-2xl font-bold">
        <Link href="/teacher" className="bg-d-500 relative gap-0">
          <h1 className={`${rubik.className} `}>knowy</h1>
          <svg
            className="absolute top-6"
            width="65"
            height="15"
            viewBox="0 0 228 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M225.069 12.9066C188.269 4.90658 66.703 10.4947 8.86967 15.4947C4.03634 15.6613 -4.03033 14.5947 2.36967 8.9947C2.36967 2.99467 219.569 -4.09344 225.069 2.90656C229.469 8.50656 226.902 11.9066 225.069 12.9066Z"
              fill="#A5D6A7"
            />
          </svg>
        </Link>

        <div className="flex justify-center gap-4">
          <ModeToggle />
          <CreateRoom />
          <Profile />
        </div>
      </header>
      <Suspense fallback={<TeacherLoading/>}>
        <DynamicQuizList />
      </Suspense>
    </div>
  );
}



  async function DynamicQuizList() {
  // This will suspend if it takes time
  const token = await getToken();

  if (!token) return null;
  const preloadedTasks = await preloadQuery(
    api.quiz.getQuizzes,
    {},
    { token }
  );

  return <QuizList preloadedTasks={preloadedTasks} />;
}