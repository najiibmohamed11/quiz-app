"use client";
import { AlarmClockOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function QuizExpired() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <AlarmClockOff className="text-primary h-12 w-12" />
      <h2 className="text-primary text-xl font-semibold">Time’s up!</h2>
      <p className="text-muted-foreground">
        The quiz duration has ended. You can check your resault if you submit
        answers
      </p>
      <Link href="/result">
        <Button>chek what i have so far</Button>
      </Link>
    </div>
  );
}
