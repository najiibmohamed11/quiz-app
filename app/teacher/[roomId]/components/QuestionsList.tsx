"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Pen, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AddQuestion from "./AddQuestion";
import { Doc } from "@/convex/_generated/dataModel";
function QuestionsList({ questions }: { questions: Doc<"questions">[] }) {
  if (!questions) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 6 }, (_, i) => i + 1).map((numb) => (
          <Skeleton key={numb} className="h-40 rounded-2xl"></Skeleton>
        ))}
      </div>
    );
  }
  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-5">
          <h1>no questions in this quiz</h1>
          <AddQuestion />
        </CardContent>
      </Card>
    );
  }
  if (typeof questions === "string") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-5">
          <h1>room id is not valid id</h1>
          <AddQuestion />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent className="mb-4 flex flex-col gap-4">
        <CardHeader>
          <div className="flex justify-between">
            <h1 className="font-medium">Student Performance</h1>
            <AddQuestion />
          </div>
        </CardHeader>
        {questions.map((question, index) => {
          return (
            <Card key={question._id}>
              <CardHeader className="flex">
                <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                  {index + 1}
                </Badge>
                <h1 className="mx-5 min-w-96 flex-1 font-semibold">
                  {question.question}
                </h1>
                <div className="flex flex-col items-center justify-center">
                  <Badge variant="secondary">{question.questionType}</Badge>
                  <div className="flex">
                    <Button variant="ghost">
                      <Pen />
                    </Button>
                    <Button variant="ghost">
                      <Trash className="text-red-700" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {question.questionType != "Short Answer" ? (
                  <div className="ml-8 flex list-none flex-col">
                    {question.options ? (
                      question.options.map((option, optionIndex) => {
                        return question.correctAnswerIndex === optionIndex ? (
                          <span
                            className="text-primary flex items-center gap-1"
                            key={optionIndex}
                          >
                            {" "}
                            <CheckCircle className="text-primary h-4 w-4" />
                            {option}
                          </span>
                        ) : (
                          <span className="ml-4" key={optionIndex}>
                            {option}
                          </span>
                        );
                      })
                    ) : (
                      <div className="flex gap-2">
                        <>
                          <div
                            className={`${question.correctAnswerIndex === 0 ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs" : "hover:bg-accent hover:text-accent-foreground border shadow-xs"} flex w-18 items-center justify-center gap-1 rounded-sm font-medium`}
                          >
                            {question.correctAnswerIndex === 0 && (
                              <CheckCircle className="h-4 w-4" />
                            )}
                            <p>True</p>
                          </div>
                          <div
                            className={`${question.correctAnswerIndex === 1 ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs" : "hover:bg-accent hover:text-accent-foreground border shadow-xs"} flex h-10 w-18 items-center justify-center gap-1 rounded-sm font-medium`}
                          >
                            {question.correctAnswerIndex === 1 && (
                              <CheckCircle className="h-4 w-4" />
                            )}
                            <p>false</p>
                          </div>
                        </>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="ml-8 flex gap-2">
                      <span className="text-green-600">answer:</span>
                      <p>{question.answer}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default QuestionsList;
