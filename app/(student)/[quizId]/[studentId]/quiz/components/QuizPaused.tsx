"use client";
import { Clock } from "lucide-react";

export default function QuizPaused() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
      <Clock className="text-primary h-12 w-12" />
      <h2 className="text-primary text-xl font-semibold">Quiz is paused</h2>
      <p className="text-muted-foreground">
        Please wait until your teacher starts the quiz.
      </p>
    </div>
  );
}
