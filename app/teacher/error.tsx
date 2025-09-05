"use client";

import { Button } from "@/components/ui/button";
import { ConvexError } from "convex/values";
import { useRouter } from "next/navigation";
import React from "react";

function Error({ error }) {
  const navigator = useRouter();
  if (error instanceof ConvexError) {
    return (
      <div className="flex justify-center items-center min-h-screen flex-col gap-4 text-2xl">
        <h1>⚠️{error.data}</h1>{" "}
        <Button onClick={() => navigator.push("/sign-in")}>sign in</Button>
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-center items-center min-h-screen flex-col">
        <h1>⚠️"an expected error hapened"</h1>{" "}
        <Button onClick={() => navigator.push("/")}>refresh</Button>
      </div>
    </div>
  );
}

export default Error;
