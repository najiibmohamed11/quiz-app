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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQueries, useQuery } from "convex/react";
import { CheckCircle, Eye } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";

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

function StudentPerformance() {
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
        room doesn't have any question please add questions first{" "}
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
    answer: string | number,
  ) => {
    if (answer === undefined) {
      console.log("question//.......");
      console.log(question);
      return "---";
    }
    if (question.options && typeof answer === "number") {
      return String.fromCharCode(answer + 65);
    }
    if (typeof answer === "number") {
      return answer === 0 ? "True" : "False";
    }

    return answer;
  };

  const formatCorrectAnswer = (question: question) => {
    if (question.options && question.correctAnswerIndex != undefined) {
      return (
        <>
          <div className="text-muted-foreground text-xs flex gap-4">
            <CheckCircle className="h-4 w-4 text-green-600 " />
            {String.fromCharCode(question.correctAnswerIndex + 65)}
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
        <h1 className="font-medium">Student Performance</h1>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="p-20">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Score</TableHead>
              {questions.map((question) => {
                return (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <TableHead key={question._id}>
                        <div
                          className={`${question.questionType == "MCQ" ? "bg-blue-100 w-24 max-w-24" : question.questionType === "Short Answer" ? "bg-orange-100" : "bg-red-100 w-24 max-w-24"}   cursor-pointer  min-w-24 min-h-10  flex items-center justify-center rounded-sm flex-col mb-2`}
                        >
                          <div className="w-full truncate px-2 text-center">
                            {question.question}
                          </div>
                          <Eye size={12} />
                        </div>
                      </TableHead>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-86">
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
            {students.map((student, index) => {
              return (
                <TableRow className="text-center">
                  <TableCell>{student.name}</TableCell>
                  <TableCell>50%</TableCell>
                  {questions.map((question, index) => {
                    console.log(student.answers);
                    const answerOfThisQuestion = student.answers.find(
                      (answer) => answer.questionId === question._id,
                    );
                    if (!answerOfThisQuestion) {
                      return <TableCell>.....</TableCell>;
                    }

                    return (
                      <TableCell className="text-center">
                        {formatStudentAnswers(
                          question,
                          answerOfThisQuestion.answer,
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
