"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Label } from "@radix-ui/react-label";
import { useConvex, useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { useParams, useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import z from "zod";
const formSchema = z.string().min(1, "please enter your name");

function StudentInfoClient({ quizInfo }: { quizInfo: Doc<"quizzes"> }) {
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const creatStudent = useMutation(api.student.createStudent);
  const { quizId } = useParams();
  const navigator = useRouter();
  const convex = useConvex();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError("");
    const result = formSchema.safeParse(studentName);
    if (!result.success) {
      setError(result.error.issues[0].message);
      setIsLoading(false);
      return;
    }
    if (quizInfo.restriction) {
      try {
        const studenId = await convex.query(
          api.student.findStudentInLockedQuiz,
          {
            uniqueId: studentName,
            quizId: quizId as string,
          },
        );
        if (studenId === "student not found") {
          setError(studenId);
          return;
        }
        navigator.push(`/${quizId}/${studenId}/quiz`);
      } catch (e) {
        console.log(e);
        const errorMessage =
          e instanceof ConvexError ? e.data : "some thing went wrong";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        return;
      }
    }

    try {
      const studenId = await creatStudent({
        name: studentName,
        quizId: quizId as string,
      });
      if (studenId) {
        navigator.push(`/${quizId}/${studenId}/quiz`);
      }
    } catch (e) {
      const errorMessage =
        e instanceof ConvexError ? e.data : "some thing went wrong";
      setError(errorMessage);
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form action="submit" onSubmit={onSubmit} className="mx-3">
      <Label htmlFor="quizName">
        {quizInfo.restriction ? quizInfo.restriction.uniqueColumn : "Your Name"}
      </Label>
      <Input
        value={studentName}
        id="quizName"
        type="text"
        placeholder={`Enter your ${quizInfo?.restriction ? quizInfo.restriction.uniqueColumn : "Name"}`}
        onChange={(e) => setStudentName(e.target.value)}
      />
      <p className="text-red-700">{error && error}</p>
      <Button
        disabled={isLoading || !studentName}
        type="submit"
        className="mt-8 w-full"
      >
        {" "}
        {isLoading ? "Starting..." : "Start Quiz"}
      </Button>
    </form>
  );
}

export default StudentInfoClient;
