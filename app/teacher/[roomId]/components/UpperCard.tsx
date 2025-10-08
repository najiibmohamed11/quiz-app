import { Card } from "@/components/ui/card";
import { ShieldQuestionMark, User } from "lucide-react";
import React from "react";
import CopyToClipboard from "./CopyToClipboard";
import Timer from "./Timer";
import QuizStatusBtn from "./QuizStatusBtn";
import { Id, Doc } from "@/convex/_generated/dataModel";

function UpperCard({
  roomDetails,
  questionLength,
  studnetsLength,
}: {
  roomDetails: Doc<"rooms">;
  questionLength: number;
  studnetsLength: number;
}) {
  return (
    <Card className="p-5 mt-4 grid grid-cols-2 h-50">
      <div className="gap-y-2 ">
        <div>
          <h1 className="font-semibold ">Queations</h1>
          <div className="mt-2 flex items-center gap-2">
            <ShieldQuestionMark size={18} />
            <h1 className="font-semibold">{questionLength}</h1>
          </div>
        </div>
        <div className="mt-2">
          <h1 className="font-semibold ">Participants</h1>
          <div className="mt-2 flex items-center gap-2   ">
            <User size={18} />
            <h1 className="font-semibold">{studnetsLength}</h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between h-full items-end">
        <div className="flex ">
          <div className="w-full bg-accent-foreground p-2 rounded-md  font-semibold text-white dark:text-black">
            http://quiz-app/room/we.........
          </div>
          <CopyToClipboard />
        </div>
        <Timer
          remainingTime={roomDetails.remainingTime}
          roomStatus={roomDetails.status}
          expiresAt={roomDetails.expiresAt}
        />
        <QuizStatusBtn roomStatus={roomDetails.status} />
      </div>
    </Card>
  );
}

export default UpperCard;
