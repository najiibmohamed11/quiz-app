"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import z from "zod";
import Timer from "./components/Timer";
import { Id } from "@/convex/_generated/dataModel";
import { toast, Toaster } from "sonner";

const answerSchema = z
  .object({
    questionId: z.string(),
    answer: z.optional(z.union([z.string(), z.number()])),
  })
  .superRefine((data, ctx) => {
    if (data.answer == undefined) {
      ctx.addIssue({
        code: "custom",
        message: "answer is required ",
        path: ["field"],
      });
    }
  });
type eventType = "copy" | "paste" | "cut";
function Quiz() {
  const { quizId, studentId } = useParams<{
    quizId: string;
    studentId: string;
  }>();
  const [answeredQuestionsIds, setAnsweredQuestionsIds] = useState<
    Id<"questions">[]
  >([]);
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState<z.infer<typeof answerSchema>>({
    questionId: "",
    answer: undefined,
  });

  const fullQuizData = useQuery(api.student.getFullQuizData, {
    studentId,
    quizId,
  });
  const submitAnswer = useMutation(api.answers.submitAnswer);
  const navigator = useRouter();
  const [isTimerEnd, setIsTimerEnd] = useState(false);
  const [randomeNumber, setRandomNumber] = useState(Math.random());

  useEffect(() => {
    const readQuestionId = () => {
      const questionIds = localStorage.getItem(studentId);
      if (!questionIds) {
        return null;
      }
      setAnsweredQuestionsIds(JSON.parse(questionIds));
    };

    readQuestionId();
  }, []);

  //perventing copy text

  useEffect(() => {
    if (
      typeof fullQuizData === "string" ||
      !fullQuizData?.quizInfo.settings.aiPrevention
    ) {
      console.log(fullQuizData);
      return;
    }
    const handleEvent = (e: ClipboardEvent) => {
      e.preventDefault();
      const eventType = e.type as eventType;
      toast.error(`not allowed to ${eventType} `, {
        description:
          "this acctions would be reported to the teacher be carefull",
        duration: 5000,
      });
    };
    document.addEventListener("copy", handleEvent);
    document.addEventListener("cut", handleEvent);
    document.addEventListener("paste", handleEvent);
    return () => {
      document.removeEventListener("copy", handleEvent);
      document.removeEventListener("cut", handleEvent);
      document.removeEventListener("paste", handleEvent);
    };
  }, [fullQuizData]);

  if (fullQuizData === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        loading....
      </div>
    );
  }
  if (fullQuizData === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5">
        <h1>opps something went wrong in url please </h1>
        <Link href={`/findquiz`}>
          <Button>go back</Button>
        </Link>
      </div>
    );
  }

  if (fullQuizData === "no questions") {
    return (
      <div className="flex items-center justify-center">
        there is no question in this quiz
      </div>
    );
  }
  if (fullQuizData === "paused") {
    return (
      <div className="flex items-center justify-center">
        wait until teacher starts the quiz
      </div>
    );
  }
  if (fullQuizData === "expired" || isTimerEnd) {
    return (
      <div className="flex items-center justify-center">
        time of the quiz ended
      </div>
    );
  }

  const answeredSet = new Set(answeredQuestionsIds);
  const questions = fullQuizData.questions.filter(
    (question) => !answeredSet.has(question._id),
  );
  const quizInfo = fullQuizData.quizInfo;

  const handleNext = async () => {
    const result = answerSchema.safeParse(answer);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    if (answer.answer === undefined) {
      setError("answer is required");
      return;
    }

    try {
      await submitAnswer({
        questionId: answer.questionId,
        answer: answer.answer,
        studentId: studentId,
        quizId: quizId,
      });

      setAnsweredQuestionsIds((prev) => {
        const updated = [...prev, answer.questionId as Id<"questions">];
        if (updated.length === fullQuizData.questions.length) {
          localStorage.removeItem(studentId);
          navigator.push(`/${quizId}/${studentId}/result`);
          return updated;
        }
        localStorage.setItem(studentId, JSON.stringify(updated));
        return updated;
      });

      setRandomNumber(Math.random());
      setAnswer({ questionId: "", answer: undefined });
      setError("");
    } catch (e) {
      const errorMessage =
        e instanceof ConvexError ? e.data : "something went wrong";
      setError(errorMessage);
      console.log(e);
    }
  };
  const index = quizInfo.settings.randomizingQuestions
    ? Math.floor(randomeNumber * questions.length)
    : 0;
  console.log(quizInfo.settings.randomizingQuestions);
  console.log(index);
  console.log(randomeNumber);
  const currentQuestion = questions[index];
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center">
        there is no question in this quiz
      </div>
    );
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Toaster position="top-center" />
      <Card className="w-2xl">
        <CardHeader className="flex justify-between">
          <Badge>
            question {answeredQuestionsIds.length + 1}/
            {fullQuizData.questions.length}
          </Badge>
          {quizInfo.duration != 0 && quizInfo.expiresAt != undefined && (
            <Timer
              expiresAt={quizInfo.expiresAt}
              setIsTimerEnd={setIsTimerEnd}
            />
          )}
        </CardHeader>
        <CardContent className="">
          <h1 className="mb-6 text-xl font-bold break-words">
            {currentQuestion.question}
          </h1>
          {currentQuestion.questionType != "Short Answer" ? (
            <div className="mt-6 flex flex-col items-center justify-center gap-4">
              {currentQuestion.options ? (
                currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={`${answer.answer === index ? "default" : "outline"}`}
                    className={`flex h-14 w-full justify-start`}
                    onClick={() =>
                      setAnswer({
                        questionId: currentQuestion._id,
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
                    className={`flex h-14 w-full justify-start`}
                    onClick={() => {
                      setAnswer({
                        questionId: currentQuestion._id,
                        answer: 0,
                      });
                    }}
                  >
                    True
                  </Button>
                  <Button
                    variant={`${answer.answer === 1 ? "default" : "outline"}`}
                    className={`flex h-14 w-full justify-start`}
                    onClick={() => {
                      setAnswer({
                        questionId: currentQuestion._id,
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
                    questionId: currentQuestion._id,
                    answer: e.target.value,
                  })
                }
              />
            </div>
          )}
          <p className="mt-3 text-center text-red-500">{error && error}</p>
        </CardContent>
        <CardFooter className="flex cursor-pointer justify-end">
          <Button onClick={handleNext}>Submit</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Quiz;
