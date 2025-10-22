"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Label } from "@radix-ui/react-label";
import { useConvex } from "convex/react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import z from "zod";
const formSchema = z.string().min(1, "please enter quiz name");
function FindQuiz() {
  const [quizName, setRoomName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const convex = useConvex();
  const navigator = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const result = formSchema.safeParse(quizName);
    if (!result.success) {
      setError(result.error.issues[0].message);
      setIsLoading(false);
      return;
    }

    try {
      const isRoomExsist = await convex.query(api.quiz.FindQuiz, { quizName });
      if (typeof isRoomExsist === "string") {
        setError(isRoomExsist);
        return;
      }
      navigator.push(`/${isRoomExsist._id}/student`);
    } catch (e) {
      setError("something went wrong!");
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-80">
        <CardHeader>
          <h1 className="text-center font-bold">Quiz Details</h1>
        </CardHeader>
        <CardContent className="m-0">
          <form action="submit" onSubmit={onSubmit}>
            <Label htmlFor="quizName">Room Name</Label>
            <Input
              value={quizName}
              id="quizName"
              type="text"
              placeholder="Enter Room Name"
              onChange={(e) => setRoomName(e.target.value)}
            />
            <p className="text-red-700">{error && error}</p>
            <Button
              disabled={isLoading || !quizName}
              type="submit"
              className="mt-8 w-full"
            >
              {" "}
              {isLoading ? "Loading..." : "Find Room"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default FindQuiz;
