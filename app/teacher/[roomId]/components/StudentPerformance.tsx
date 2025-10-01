import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { CheckCircle, CircleX, Eye } from "lucide-react";
import { useParams } from "next/navigation";
import ImportStudents from "./ImportStudents";
import LockRoom from "./LockRoomModal";
import UnlockQuiz from "./UnlockQuiz";

type question = {
  _id: Id<"questions">;
  _creationTime: number;
  options?: string[] | undefined;
  correctAnswerIndex?: number | undefined;
  answer?: string | undefined;
  roomId: Id<"rooms">;
  question: string;
  questionType: "MCQ" | "True/False" | "Short Answer";
};

type answers = {
  _id: Id<"answers">;
  _creationTime: number;
  roomId: Id<"rooms">;
  answer: string | number;
  studentId: Id<"students">;
  questionId: Id<"questions">;
};

interface studentPerformanceProps {
  restriction:
    | {
        otherColumn?: string | undefined;
        uniqueColumn: string;
      }
    | undefined;
}
function StudentPerformance({ restriction }: studentPerformanceProps) {
  const { roomId } = useParams();
  const questions = useQuery(api.question.getRoomeQuestions, {
    roomId: roomId as string,
  });
  const students = useQuery(api.student.getAllStudentsInRoom, {
    roomId: roomId as string,
  });
  console.log(students);
  if (!questions || !students) {
    return <h1 className="flex justify-center items-center">loading....</h1>;
  }

  if (questions.length == 0) {
    return (
      <h1 className="flex justify-center items-center">
        {"room doesn't have any question please add questions first"}
      </h1>
    );
  }
  if (typeof questions === "string" || typeof students === "string") {
    return (
      <h1 className="flex justify-center items-center">
        this room is not valid room
      </h1>
    );
  }

  const formatStudentAnswers = (
    question: question,
    answer: string | number | undefined,
  ) => {
    if (answer === undefined) {
      return "---";
    }
    if (question.options && typeof answer === "number") {
      return (
        <div className="flex justify-center items-center gap-2">
          {question.correctAnswerIndex === answer ? (
            <CheckCircle className="h-4 w-4 text-green-600 " />
          ) : (
            <CircleX className="h-4 w-4 text-red-600 " />
          )}
          {String.fromCharCode(answer + 65)}
        </div>
      );
    }
    if (typeof answer === "number") {
      return (
        <div className="flex justify-center items-center gap-2">
          {question.correctAnswerIndex === answer ? (
            <CheckCircle className="h-4 w-4 text-green-600 " />
          ) : (
            <CircleX className="h-4 w-4 text-red-600 " />
          )}
          {answer === 0 ? "True" : "False"}
        </div>
      );
    }

    return answer;
  };

  const calculateStudentsScore = (answer: answers[]) => {
    let correctAnswerCount = 0;
    // if(answer.length>questions.length){
    //   return "---"
    // }
    questions.map((question) => {
      const answerOfthisQuestion = answer.find(
        (answer) => answer.questionId === question._id,
      );

      if (!answerOfthisQuestion) {
        return;
      }
      if (
        question.options &&
        typeof answerOfthisQuestion.answer === "number" &&
        question.correctAnswerIndex === answerOfthisQuestion.answer
      ) {
        correctAnswerCount++;
      } else if (
        typeof answerOfthisQuestion.answer === "number" &&
        question.correctAnswerIndex === answerOfthisQuestion.answer
      ) {
        correctAnswerCount++;
      }
    });
    return `${((correctAnswerCount / questions.length) * 100).toFixed(0)}%`;
  };

  const formatCorrectAnswer = (question: question) => {
    if (question.options && question.correctAnswerIndex != undefined) {
      return (
        <>
          <div className="text-muted-foreground text-xs flex gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 " />
            <h1 className="font-bold">
              {String.fromCharCode(question.correctAnswerIndex + 65)})
            </h1>
            {question.options[question.correctAnswerIndex]}
          </div>
        </>
      );
    }

    if (question.correctAnswerIndex != undefined) {
      return (
        <div className="text-muted-foreground text-xs flex gap-4">
          <CheckCircle className="h-4 w-4 text-green-600 " />
          {question.correctAnswerIndex === 0 ? "True" : "False"}
        </div>
      );
    }

    if (question.answer) {
      return (
        <div className="text-muted-foreground text-xs flex gap-4">
          <CheckCircle className="h-4 w-4 text-green-600 " />
          {question.answer}
        </div>
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between ">
          <h1 className="font-medium">Student Performance</h1>
          {!restriction ? (
            <LockRoom />
          ) : (
            <UnlockQuiz
              roomId={roomId as string}
              studentsLength={students.length}
            />
          )}
          {/* <Button id="restrict">restrict Particpents</Button> */}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="p-20">
            <TableRow>
              {!restriction ? (
                <TableHead>Name</TableHead>
              ) : (
                <>
                  <TableCell>{restriction.uniqueColumn}</TableCell>
                  {restriction.otherColumn && (
                    <TableCell>{restriction.otherColumn}</TableCell>
                  )}
                </>
              )}
              <TableHead>Score</TableHead>
              {questions.map((question) => {
                return (
                  <HoverCard key={question._id}>
                    <HoverCardTrigger asChild>
                      <TableHead key={question._id}>
                        <div
                          className={`${question.questionType == "MCQ" ? "bg-blue-100" : question.questionType === "Short Answer" ? "bg-orange-100 " : "bg-red-100 "} cursor-pointer  w-24 h-10  flex items-center justify-center rounded-sm flex-col mb-2`}
                        >
                          <div className="w-full truncate px-2 text-center ">
                            {question.question}
                          </div>
                          <Eye size={12} />
                        </div>
                      </TableHead>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-86 break-words">
                      <div className="space-y-1">
                        <p className="text-sm">{question.question}</p>
                        {formatCorrectAnswer(question)}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => {
              return (
                <TableRow key={student._id}>
                  {!restriction ? (
                    <TableHead>{student.name || "......."}</TableHead>
                  ) : (
                    <>
                      <TableCell>{student.uniqueId || ".........."}</TableCell>
                      {restriction.otherColumn && (
                        <TableCell>
                          {student.secondaryIdentifier || "------"}
                        </TableCell>
                      )}
                    </>
                  )}
                  <TableCell>
                    {calculateStudentsScore(student.answers)}
                  </TableCell>
                  {questions.map((question) => {
                    const answerOfThisQuestion = student.answers.find(
                      (answer) => answer.questionId === question._id,
                    );

                    return (
                      <TableCell className="text-center" key={question._id}>
                        {question.questionType != "Short Answer" ? (
                          <div className="w-24 h-10  bg-gray-200 rounded-md flex justify-center items-center">
                            {formatStudentAnswers(
                              question,
                              answerOfThisQuestion?.answer,
                            )}
                          </div>
                        ) : (
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <div className="w-24 h-10   bg-gray-200 rounded-md flex justify-center items-center">
                                <p className="w-full truncate px-2 text-center">
                                  {formatStudentAnswers(
                                    question,
                                    answerOfThisQuestion?.answer,
                                  )}
                                </p>
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="">
                              <div className="space-y-1">
                                <p className="text-sm">
                                  {answerOfThisQuestion?.answer}
                                </p>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default StudentPerformance;
