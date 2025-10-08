"use client";

import { Button } from "@/components/ui/button";
import { ConvexError } from "convex/values";
import { useRouter } from "next/navigation";
import React from "react";

function Error({ error }: { error: Error & { digest?: string } }) {
  const navigator = useRouter(); // ✅ always runs, top-level

  if (error instanceof ConvexError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-2xl">
        <h1>⚠️ {error.data}</h1>
        <Button onClick={() => navigator.push("/sign-in")}>sign in</Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1>⚠️ an unexpected error happened</h1>
      <Button onClick={() => navigator.push("/")}>refresh</Button>
    </div>
  );
}

export default Error;
