"use client";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";

function CopyToClipboard() {
  const [isCopied, setIscopied] = useState(false);
  const { roomId } = useParams();
  const quizeUrl = `${window.location.origin}/${roomId}/student`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(quizeUrl);
      setIscopied(true);
      setTimeout(() => {
        setIscopied(false);
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Button
      variant="ghost"
      className="hover:bg-transparent cursor-pointer"
      onClick={copyToClipboard}
    >
      {isCopied ? <Check /> : <Copy />}
    </Button>
  );
}

export default CopyToClipboard;
