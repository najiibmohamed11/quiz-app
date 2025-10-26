"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NoQuestions() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-primary text-2xl font-semibold">
        No questions available for this quiz.
      </h2>
      <p className="text-muted-foreground">
        The teacher may not have added any questions yet.
      </p>
      <Link
        href="/find-quiz"
        className="bg-primary text-background mt-6 rounded-sm px-15 py-2.5 transition hover:opacity-90"
      >
        <Button>Go Back</Button>
      </Link>
    </div>
  );
}
