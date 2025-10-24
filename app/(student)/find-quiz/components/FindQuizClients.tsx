"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Label } from "@radix-ui/react-label";
import { useConvex } from "convex/react";
import { ConvexError } from "convex/values";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import z from "zod";

const formSchema = z.string().min(1, "please enter quiz name");

function FindQuizClients() {
  const [quizName, setRoomName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const convex = useConvex();
  const navigator = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const result = formSchema.safeParse(quizName.trim());
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
    } catch (error) {
      const message =
        error instanceof ConvexError ? error.data : "something went wrong!";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form action="submit" onSubmit={onSubmit} className="mx-4">
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
  );
}

export default FindQuizClients;
