"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Router from "next/router";
import React, { useState } from "react";
import z from "zod";

const answerSchema = z
  .object({
    questionId: z.string(),
    answer: z.optional(z.union([z.string(), z.number()])),
  })
  .superRefine((data, ctx) => {
    if (data.answer == undefined) {
      ctx.addIssue({
        code: "custom",
        message: "answer is required at submission.",
        path: ["field"],
      });
    }
  });
function page() {
  const { roomId, studentId } = useParams<{
    roomId: string;
    studentId: string;
  }>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState<z.infer<typeof answerSchema>>({
    questionId: "",
    answer: undefined,
  });

  const studentInfo = useQuery(api.student.getStudent, { studentId, roomId });
  const questions = useQuery(api.question.getStudentsQuestions, { roomId });
  const submitAnswer = useMutation(api.answers.submitAnswer);
  const navigator=useRouter()

  if (studentInfo === undefined || !questions) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        loading for student info....
      </div>
    );
  }
  if (studentInfo === null || questions === null) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-5">
        <h1>opps something went wrong in url please </h1>
        <Link href={`/findroom`}>
          <Button>go back</Button>
        </Link>
      </div>
    );
  }

  if (questions.length == 0) {
    return (
      <div className="flex justify-center items-center">
        there is no question in this room
      </div>
    );
  }

  const handleNext = async () => {
    const result = answerSchema.safeParse(answer);
    if (!result.success) {
      console.log(result.error.issues[0]);
      setError(result.error.issues[0].message);
      return;
    }

    try {
      await submitAnswer({
        questionId: answer.questionId,
        answer: answer.answer,
        studentId: studentId,
        roomId: roomId,
      });
      setAnswer({ questionId: "", answer: undefined });
      if (questions.length - 1 === currentQuestionIndex) {
        navigator.push(`/${roomId}/${studentId}/result`)
        return;
      }
      setCurrentQuestionIndex((prev) => prev + 1);

      setError("");
    } catch (e) {
      const errorMessage =
        e instanceof ConvexError ? e.data : "something went wrong";
      setError(errorMessage);
      console.log(e);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-2xl ">
        <CardHeader>
          <Badge>
            question {currentQuestionIndex + 1}/{questions.length}
          </Badge>
        </CardHeader>
        <CardContent className="">
          <h1 className="text-xl font-bold">
            {questions[currentQuestionIndex].question}
          </h1>
          {questions[currentQuestionIndex].questionType != "Short Answer" ? (
            <div className="flex justify-center flex-col items-center gap-4 mt-6">
              {questions[currentQuestionIndex].options ? (
                questions[currentQuestionIndex].options.map((option, index) => (
                  <Button
                  key={index}
                    variant={`${answer.answer === index ? "default" : "outline"}`}
                    className={`w-full h-14  flex justify-start `}
                    onClick={() =>
                      setAnswer({
                        questionId: questions[currentQuestionIndex]._id,
                        answer: index,
                      })
                    }
                  >
                    {option}
                  </Button>
                ))
              ) : (
                <>
                  <Button
                    variant={`${answer.answer === 0 ? "default" : "outline"}`}
                    className={`w-full h-14  flex justify-start `}
                    onClick={() => {
                      setAnswer({
                        questionId: questions[currentQuestionIndex]._id,
                        answer: 0,
                      });
                    }}
                  >
                    True
                  </Button>
                  <Button
                    variant={`${answer.answer === 1 ? "default" : "outline"}`}
                    className={`w-full h-14  flex justify-start `}
                    onClick={() => {
                      setAnswer({
                        questionId: questions[currentQuestionIndex]._id,
                        answer: 1,
                      });
                    }}
                  >
                    False
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div>
              <Textarea
                value={answer.answer ?? ""}
                placeholder="write the answer her"
                onChange={(e) =>
                  setAnswer({
                    questionId: questions[currentQuestionIndex]._id,
                    answer: e.target.value,
                  })
                }
              />
            </div>
          )}
          <p className="text-red-500 text-center mt-3">{error && error}</p>
        </CardContent>
        <CardFooter className="flex justify-end cursor-pointer">
          <Button onClick={handleNext}>Submit</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default page;
