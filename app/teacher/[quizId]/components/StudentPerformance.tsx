"use client";

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
import { Id, Doc } from "@/convex/_generated/dataModel";
import { CheckCircle, CircleX, Eye, TriangleAlert } from "lucide-react";
import LockRoom from "./LockQuizModal";
import UnlockQuiz from "./UnlockQuiz";
import { FunctionReturnType } from "convex/server";
import StudentPerformanceLoading from "./StudentPerformanceLoading";
import InValidQuiz from "./InValidQuiz";
import AddQuestion from "./AddQuestion";

type question = {
  _id: Id<"questions">;
  _creationTime: number;
  options?: string[] | undefined;
  correctAnswerIndex?: number | undefined;
  answer?: string | undefined;
  quizId: Id<"quizzes">;
  question: string;
  questionType: "MCQ" | "True/False" | "Short Answer";
};

type answers = {
  _id: Id<"answers">;
  _creationTime: number;
  quizId: Id<"quizzes">;
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

  questions: Doc<"questions">[];
  students: FunctionReturnType<typeof api.student.getAllStudentsInRoom>;
  quizId: string;
}
function StudentPerformance({
  restriction,
  questions,
  students,
  quizId,
}: studentPerformanceProps) {
  if (!questions || !students) {
    return <StudentPerformanceLoading />;
  }

  if (questions.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center space-y-2 p-10 text-center">
        <TriangleAlert className="h-10 w-10 text-yellow-500" />
        <h2 className="text-lg font-semibold">No Questions Available</h2>
        <p className="text-muted-foreground text-sm">
          This quiz doesn’t have any questions yet. Add questions to view
          student performance.
        </p>
        <AddQuestion />
      </Card>
    );
  }
  if (typeof questions === "string" || typeof students === "string") {
    return <InValidQuiz />;
  }

  const formatStudentAnswers = (
    question: question,
    answer: string | number | undefined,
  ) => {
    //if there is no answer for this question return --
    if (answer === undefined) {
      return "---";
    }
    //if answer there options in question and answers are number it is mcq
    if (question.options && typeof answer === "number") {
      return (
        <div className="flex items-center justify-center gap-2">
          {question.correctAnswerIndex === answer ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <CircleX className="h-4 w-4 text-red-600" />
          )}
          {String.fromCharCode(answer + 65)}
        </div>
      );
    }
    //if answer is number only and there is no options in this question it is true/false
    if (typeof answer === "number") {
      return (
        <div className="flex items-center justify-center gap-2">
          {/* check if it is correct answe or not */}
          {question.correctAnswerIndex === answer ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <CircleX className="h-4 w-4 text-red-600" />
          )}
          {answer === 0 ? "True" : "False"}
        </div>
      );
    }
    //if answer is not one of the above it is short answer so return answer we cant notice if it is correct or incorrect
    return answer;
  };

  const calculateStudentsScore = (answers: answers[]) => {
    let correctAnswerCount = 0;
    // if(answer.length>questions.length){
    //   return "---"
    // }
    questions.map((question) => {
      const answerOfthisQuestion = answers.find(
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
          <div className="text-muted-foreground flex gap-2 text-xs">
            <CheckCircle className="h-4 w-4 text-green-600" />
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
        <div className="text-muted-foreground flex gap-4 text-xs">
          <CheckCircle className="h-4 w-4 text-green-600" />
          {question.correctAnswerIndex === 0 ? "True" : "False"}
        </div>
      );
    }

    if (question.answer) {
      return (
        <div className="text-muted-foreground flex gap-4 text-xs">
          <CheckCircle className="h-4 w-4 text-green-600" />
          {question.answer}
        </div>
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <h1 className="font-medium">Student Performance</h1>
          {!restriction ? (
            <LockRoom />
          ) : (
            <UnlockQuiz
              quizId={quizId as string}
              studentsLength={students.length}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="p-20">
            <TableRow className="hover:bg-transparent">
              {!restriction ? (
                <TableHead>Name</TableHead>
              ) : (
                <>
                  <TableHead>{restriction.uniqueColumn}</TableHead>
                  {restriction.otherColumn && (
                    <TableHead>{restriction.otherColumn}</TableHead>
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
                          className={`${
                            question.questionType === "MCQ"
                              ? "bg-[#E6F0FF] text-[#0A3D91] hover:bg-[#D6E5FF] dark:bg-[#0B1E3A] dark:text-[#AFCBFF] dark:hover:bg-[#102B55]"
                              : question.questionType === "Short Answer"
                                ? "bg-[#FFF3E0] text-[#9A4A00] hover:bg-[#FFE6BF] dark:bg-[#2B1A00] dark:text-[#FFD7A3] dark:hover:bg-[#3B2608]"
                                : "bg-[#FDE8E8] text-[#8B1E1E] hover:bg-[#F9D6D6] dark:bg-[#2A0E0E] dark:text-[#FFB3B3] dark:hover:bg-[#3C1616]"
                          } mb-2 flex h-10 w-24 cursor-pointer flex-col items-center justify-center rounded-sm transition-colors`}
                        >
                          <div className="w-full truncate px-2 text-center">
                            {question.question}
                          </div>
                          <Eye size={12} />
                        </div>
                      </TableHead>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className={`w-86 break-words ${
                        question.questionType === "MCQ"
                          ? "bg-[#E6F0FF] text-[#0A3D91] hover:bg-[#D6E5FF] dark:bg-[#0B1E3A] dark:text-[#AFCBFF] dark:hover:bg-[#102B55]"
                          : question.questionType === "Short Answer"
                            ? "bg-[#FFF3E0] text-[#9A4A00] hover:bg-[#FFE6BF] dark:bg-[#2B1A00] dark:text-[#FFD7A3] dark:hover:bg-[#3B2608]"
                            : "bg-[#FDE8E8] text-[#8B1E1E] hover:bg-[#F9D6D6] dark:bg-[#2A0E0E] dark:text-[#FFB3B3] dark:hover:bg-[#3C1616]"
                      }`}
                    >
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
                    <TableCell>{student.name || "......."}</TableCell>
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
                          <div className="dark:bg-border flex h-10 w-24 items-center justify-center rounded-md bg-gray-200">
                            {formatStudentAnswers(
                              question,
                              answerOfThisQuestion?.answer,
                            )}
                          </div>
                        ) : (
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <div className="dark:bg-border flex h-10 w-24 items-center justify-center rounded-md bg-gray-200">
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
