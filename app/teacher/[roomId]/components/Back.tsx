"use client";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function Back() {
  const rout = useRouter();
  return (
    <Button
      variant="ghost"
      className="flex w-20 cursor-pointer justify-around"
      onClick={() => rout.back()}
    >
      <MoveLeft /> Back
    </Button>
  );
}

export default Back;
