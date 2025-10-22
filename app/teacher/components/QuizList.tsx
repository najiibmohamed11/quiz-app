"use client";
import React, { useEffect, useState } from "react";
import { Preloaded, usePreloadedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import CreateRoom from "./CreatRoom";
import { Card, CardFooter } from "@/components/ui/card";
import { CircleHelp, Clock10 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import QuizCardSkeliton from "./QuizCardSkeliton";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function QuizList(propert: {
  preloadedTasks: Preloaded<typeof api.quiz.getQuizzes>;
}) {
  const quizzes = usePreloadedQuery(propert.preloadedTasks);

  const [parent] = useAutoAnimate();

  if (!quizzes) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((numb) => (
          <QuizCardSkeliton key={numb} />
        ))}
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="border-muted-foreground/30 bg-muted/10 hover:border-muted-foreground/50 hover:bg-muted/20 mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center transition-all">
        <div className="bg-primary/10 text-primary mb-6 flex h-24 w-24 items-center justify-center rounded-full">
          <CircleHelp className="h-12 w-12" />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight">
          No quizzes found
        </h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          You haven’t created any quizzes yet. Create your first quiz to get
          started.
        </p>

        <div className="mt-6">
          <CreateRoom />
        </div>
      </div>
    );
  }

  return (
    <div
      className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      ref={parent}
    >
      {quizzes.map((quiz) => {
        return (
          <Link key={quiz._id} href={`./teacher/${quiz._id}`}>
            <Card className="h-55 p-0">
              <div className="p-5">
                <div className="flex justify-between">
                  <h1 className="truncate font-bold">{quiz?.name}</h1>
                  <Badge
                    className={`h-6 w-fit rounded-4xl ${quiz.status === "active" ? "bg-[#A5D6A7]" : "bg-yellow-400"} px-2 text-black`}
                  >
                    {quiz.status}
                  </Badge>
                </div>
                <div className="mt-5 space-y-3">
                  <div className="flex items-center">
                    <Clock10 className="mr-2 h-4 w-4" />
                    <span>
                      {quiz.duration
                        ? `${quiz.duration / 60000} minutes`
                        : "not have limit"}{" "}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <CircleHelp className="mr-2 h-4 w-4" />
                    <span> {quiz.numberOfQuestions} questions</span>
                  </div>
                </div>
              </div>

              <CardFooter className="flex h-full w-full justify-between rounded-b-xl bg-[#A5D6A7] dark:text-black">
                {new Date(quiz._creationTime).toDateString()}
                {/* <Pause className="h-4 w-4" /> */}
              </CardFooter>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export default QuizList;
