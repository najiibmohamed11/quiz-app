"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Pause, Play } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

function QuizStatusBtn({ roomStatus }: { roomStatus: string }) {
  const changeRoomStatus = useMutation(api.room.changeRoomStatus);
  const { roomId } = useParams();
  const router = useRouter();

  const handleRoomStatusChange = async () => {
    try {
      await changeRoomStatus({ roomId: roomId as string });
      router.refresh();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Button
      className="w-60 mr-9  cursor-pointer"
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
