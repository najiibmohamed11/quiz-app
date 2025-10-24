"use client";

import { Button } from "@/components/ui/button";
import { ConvexError } from "convex/values";
import { useRouter } from "next/navigation";
import React from "react";
type errorType = {
  message: string;
  code: string;
  data: string;
};
function Error({ error }: { error: Error }) {
  const navigator = useRouter(); // ✅ always runs, top-level

  if (error.name === "ConvexError") {
    const errorMessagesplited = error.message.split("ConvexError:");
    if (errorMessagesplited.length < 1) {
      return;
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-2xl">
        <h1>⚠️ {errorMessagesplited[1].trim()}</h1>
        <Button onClick={() => navigator.push("/teacher")}>go back</Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1>⚠️ some thing went wrong</h1>
      <Button onClick={() => navigator.push("/")}>refresh</Button>
    </div>
  );
}

export default Error;
