"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DurationPicker } from "@/components/ui/duration-picker";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";

function QuizStatusBtn({
  roomStatus,
  remainingTime,
  duration,
  expiresAt,
}: {
  roomStatus: "active" | "pause";
  remainingTime: number;
  duration: number;
  expiresAt: number;
}) {
  const changeRoomStatus = useMutation(api.room.changeRoomStatus);
  const restartQuiz = useMutation(api.room.restartEndedQuiz);
  const { roomId } = useParams();
  const [durationState, setDuration] = useState<number>(0);
  const [isloading, setIsloading] = useState(false);
  const [error, setErorr] = useState("");

  const handleRoomStatusChange = async () => {
    try {
      await changeRoomStatus({ roomId: roomId as string });
    } catch (e) {
      console.log(e);
    }
  };
  const handleRestart = async () => {
    try {
      await restartQuiz({
        duration: durationState,
        roomId: roomId as Id<"rooms">,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const isExpired = expiresAt && Date.now() > expiresAt; // 1s buffer

  if (
    (isExpired && duration && roomStatus === "active") ||
    (roomStatus === "pause" && !remainingTime && duration)
  ) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mr-9 w-60 cursor-pointer">
            <RotateCcw />
            Replay
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="cursor-pointer dark:text-[#A5D6A7]">
              Creare Room
            </DialogTitle>
          </DialogHeader>
          <DurationPicker value={durationState} onChange={setDuration} />
          <DialogFooter>
            <Button
              disabled={isloading}
              type="submit"
              onClick={handleRestart}
              className="cursor-pointer bg-[#255026] hover:bg-[#255026] dark:bg-[#A5D6A7] dark:text-black"
            >
              {isloading ? "creating...." : "Create"}
            </Button>
          </DialogFooter>
          <div className="text-center text-red-500">{error}</div>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Button
      className="mr-9 w-60 cursor-pointer"
      variant={`${roomStatus === "active" ? "outline" : "default"}`}
      onClick={handleRoomStatusChange}
    >
      {roomStatus === "active" ? (
        <>
          <Pause className="" />
          pause
        </>
      ) : (
        <>
          <Play />
          active
        </>
      )}
    </Button>
  );
}

export default QuizStatusBtn;
