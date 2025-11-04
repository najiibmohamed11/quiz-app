"use client";
import { Button } from "@/components/ui/button";
import { HoverCardContent } from "@/components/ui/hover-card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { CheckCircle, CircleX } from "lucide-react";

function HoverAnswer({
  answer,
  decision,
  answerId,
}: {
  answer: string | number;
  decision: "correct" | "incorrect" | "waiting";
  answerId: Id<"answers">;
}) {
  const makeDecision = useMutation(api.answers.teacherDecision);
  return (
    <HoverCardContent className="w-56 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium">{answer}</p>
        <div className="flex items-center justify-center gap-3 pt-1">
          <Button
            variant={decision === "correct" ? "default" : "ghost"}
            className="flex items-center gap-1"
            onClick={() =>
              makeDecision({ answeId: answerId, decision: "correct" })
            }
          >
            <CheckCircle className={`h-4 w-4 text-green-600`} />
            <span className="text-xs">Correct</span>
          </Button>

          <Button
            variant={decision === "incorrect" ? "default" : "ghost"}
            className="flex items-center gap-1"
            onClick={() =>
              makeDecision({ answeId: answerId, decision: "incorrect" })
            }
          >
            <CircleX className={`h-4 w-4 text-red-600`} />
            <span className="text-xs">Wrong</span>
          </Button>
        </div>
      </div>
    </HoverCardContent>
  );
}

export default HoverAnswer;
