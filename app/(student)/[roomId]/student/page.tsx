"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Label } from "@radix-ui/react-label";
import {  useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { useParams, useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import z from "zod";
const formSchema = z.string().min(1, "please enter your name");

function StudentInfo() {
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const creatStudent = useMutation(api.student.creatStudent);
  const { roomId } = useParams();
  const navigator = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const result = formSchema.safeParse(studentName);
    if (!result.success) {
      setError(result.error.issues[0].message);
      setIsLoading(false);
      return;
    }
    try {
      const studenId = await creatStudent({
        name: studentName,
        roomId: roomId as string,
      });
      if (studenId) {
        navigator.push(`/${roomId}/${studenId}/quiz`);
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
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-96">
        <CardHeader>
          <h1 className="font-bold text-center">Student info</h1>
        </CardHeader>
        <CardContent className=" m-0">
          <form action="submit" onSubmit={onSubmit}>
            <Label htmlFor="roomName">Your Name</Label>
            <Input
              value={studentName}
              id="roomName"
              type="text"
              placeholder="Enter Room Name"
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
        </CardContent>
      </Card>
    </div>
  );
}

export default StudentInfo;
