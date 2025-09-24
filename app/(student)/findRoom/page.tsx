"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Label } from "@radix-ui/react-label";
import { useConvex } from "convex/react";
import { useRouter } from "next/navigation";
import React, {
  FormEvent,
  useState,
} from "react";
import z from "zod";
const formSchema = z.string().min(1, "please enter room name");
// const roomSchema=z.object({
//   _creationTime: z.number(),
//   _id: z.string(),
//   duration: z.object({
//     hour: z.number(),
//     minute: z.number()
//   }),
//   name: z.string(),
//   teacher: z.string()
// })
function FindRoom() {
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const convex = useConvex();
  const navigator = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const result = formSchema.safeParse(roomName);
    if (!result.success) {
      setError(result.error.issues[0].message);
      setIsLoading(false);
      return;
    }

    try {
      const isRoomExsist = await convex.query(api.room.FindRoom, { roomName });
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
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-80">
        <CardHeader>
          <h1 className="font-bold text-center">Quiz Details</h1>
        </CardHeader>
        <CardContent className=" m-0">
          <form action="submit" onSubmit={onSubmit}>
            <Label htmlFor="roomName">Room Name</Label>
            <Input
              value={roomName}
              id="roomName"
              type="text"
              placeholder="Enter Room Name"
              onChange={(e) => setRoomName(e.target.value)}
            />
            <p className="text-red-700">{error && error}</p>
            <Button
              disabled={isLoading || !roomName}
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

export default FindRoom;
