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
      className="cursor-pointer  w-20 flex justify-around "
      onClick={() => rout.back()}
    >
      <MoveLeft /> Back
    </Button>
  );
}

export default Back;
