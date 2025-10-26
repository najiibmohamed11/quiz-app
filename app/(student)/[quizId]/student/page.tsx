import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import StudentInfoClient from "./components/StudentInfoClient";
import Invalid from "@/app/components/Invalid";
interface studentProps {
  params: {
    quizId: string;
    studentId: string;
  };
}

async function Student({ params }: studentProps) {
  const quizInfo = await fetchQuery(api.quiz.getQuiz, {
    quizId: params.quizId,
  });
  if (typeof quizInfo === "string") {
    return <Invalid />;
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-92">
        <CardHeader>
          <h1 className="text-center font-bold">Student info</h1>
        </CardHeader>
        <CardContent className="">
          <StudentInfoClient quizInfo={quizInfo} />
        </CardContent>
      </Card>
    </div>
  );
}

export default Student;
