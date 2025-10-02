"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Label } from "@radix-ui/react-label";
import { useConvex, useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { useParams, useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import z from "zod";
const formSchema = z.string().min(1, "please enter your name");

function StudentInfo() {
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const creatStudent = useMutation(api.student.createStudent);
  const { roomId } = useParams();
  const navigator = useRouter();
  const roomInfo = useQuery(api.room.getRoom, { roomId: roomId as string });
  const convex = useConvex();

  if (!roomInfo) {
    return <div>loading...</div>;
  }

  if (typeof roomInfo === "string") {
    return <div>{roomInfo}</div>;
  }

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
    if (roomInfo.restriction) {
      try {
        const studenId = await convex.query(
          api.student.findStudentInLockedQuiz,
          {
            uniqueId: studentName,
            roomId: roomId as string,
          },
        );
        if (studenId === "student not found") {
          setError(studenId);
          return;
        }
        navigator.push(`/${roomId}/${studenId}/quiz`);
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
            <Label htmlFor="roomName">
              {roomInfo.restriction
                ? roomInfo.restriction.uniqueColumn
                : "Your Name"}
            </Label>
            <Input
              value={studentName}
              id="roomName"
              type="text"
              placeholder={`Enter ${roomInfo?.restriction ? roomInfo.restriction.uniqueColumn : "Name"}`}
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
