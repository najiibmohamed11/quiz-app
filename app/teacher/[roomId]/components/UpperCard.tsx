import { Card } from "@/components/ui/card";
import { ShieldQuestionMark, User } from "lucide-react";
import React, { useState } from "react";
import CopyToClipboard from "./CopyToClipboard";
import Timer from "./Timer";
import QuizStatusBtn from "./QuizStatusBtn";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { useForceUpdate } from "@/app/hooks/useForceUpdate";

function UpperCard({
  roomDetails,
  questionLength,
  studnetsLength,
}: {
  roomDetails: Doc<"rooms">;
  questionLength: number;
  studnetsLength: number;
}) {
  const forceRerender = useForceUpdate();
  return (
    <Card className="mt-4 grid h-50 grid-cols-2 p-5">
      <div className="gap-y-2">
        <div>
          <h1 className="font-semibold">Queations</h1>
          <div className="mt-2 flex items-center gap-2">
            <ShieldQuestionMark size={18} />
            <h1 className="font-semibold">{questionLength}</h1>
          </div>
        </div>
        <div className="mt-2">
          <h1 className="font-semibold">Participants</h1>
          <div className="mt-2 flex items-center gap-2">
            <User size={18} />
            <h1 className="font-semibold">{studnetsLength}</h1>
          </div>
        </div>
      </div>

      <div className="flex h-full flex-col items-end justify-between">
        <div className="flex">
          <div className="bg-accent-foreground w-full rounded-md p-2 font-semibold text-white dark:text-black">
            http://quiz-app/room/we.........
          </div>
          <CopyToClipboard />
        </div>
        <Timer
          remainingTime={roomDetails.remainingTime}
          roomStatus={roomDetails.status}
          expiresAt={roomDetails.expiresAt}
          setIsTimerEnded={forceRerender}
        />
        <QuizStatusBtn
          roomStatus={roomDetails.status}
          remainingTime={roomDetails.remainingTime}
          duration={roomDetails.duration}
          expiresAt={roomDetails.expiresAt ?? 0}
        />
      </div>
    </Card>
  );
}

export default UpperCard;
