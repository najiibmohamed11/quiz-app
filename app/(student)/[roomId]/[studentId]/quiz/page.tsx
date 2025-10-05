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
  const { roomId, studentId } = useParams<{
    roomId: string;
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
    roomId,
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
      !fullQuizData?.roomInfo.settings.aiPrevention
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
      <div className="flex justify-center items-center min-h-screen">
        loading....
      </div>
    );
  }
  if (fullQuizData === null) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-5">
        <h1>opps something went wrong in url please </h1>
        <Link href={`/findroom`}>
          <Button>go back</Button>
        </Link>
      </div>
    );
  }

  if (fullQuizData === "no questions") {
    return (
      <div className="flex justify-center items-center">
        there is no question in this room
      </div>
    );
  }
  if (fullQuizData === "paused") {
    return (
      <div className="flex justify-center items-center">
        wait until teacher starts the quiz
      </div>
    );
  }
  if (fullQuizData === "expired" || isTimerEnd) {
    return (
      <div className="flex justify-center items-center">
        time of the quiz ended
      </div>
    );
  }

  const answeredSet = new Set(answeredQuestionsIds);
  const questions = fullQuizData.questions.filter(
    (question) => !answeredSet.has(question._id),
  );
  const roomInfo = fullQuizData.roomInfo;

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
        roomId: roomId,
      });

      setAnsweredQuestionsIds((prev) => {
        const updated = [...prev, answer.questionId as Id<"questions">];
        if (updated.length === fullQuizData.questions.length) {
          localStorage.removeItem(studentId);
          navigator.push(`/${roomId}/${studentId}/result`);
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
  const index = roomInfo.settings.randomizingQuestions
    ? Math.floor(randomeNumber * questions.length)
    : 0;
  console.log(roomInfo.settings.randomizingQuestions);
  console.log(index);
  console.log(randomeNumber);
  const currentQuestion = questions[index];
  if (!currentQuestion) {
    return (
      <div className="flex justify-center items-center">
        there is no question in this room
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Toaster position="top-center" />
      <Card className="w-2xl ">
        <CardHeader className="flex justify-between">
          <Badge>
            question {answeredQuestionsIds.length + 1}/
            {fullQuizData.questions.length}
          </Badge>
          {roomInfo.duration != 0 && roomInfo.expiresAt != undefined && (
            <Timer
              expiresAt={roomInfo.expiresAt}
              setIsTimerEnd={setIsTimerEnd}
            />
          )}
        </CardHeader>
        <CardContent className="">
          <h1 className="text-xl font-bold break-words mb-6">
            {currentQuestion.question}
          </h1>
          {currentQuestion.questionType != "Short Answer" ? (
            <div className="flex justify-center flex-col items-center gap-4 mt-6">
              {currentQuestion.options ? (
                currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={`${answer.answer === index ? "default" : "outline"}`}
                    className={`w-full h-14  flex justify-start `}
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
                    className={`w-full h-14  flex justify-start `}
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
                    className={`w-full h-14  flex justify-start `}
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
          <p className="text-red-500 text-center mt-3">{error && error}</p>
        </CardContent>
        <CardFooter className="flex justify-end cursor-pointer">
          <Button onClick={handleNext}>Submit</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Quiz;
