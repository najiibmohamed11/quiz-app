"use client";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import React, { useEffect, useState } from "react";

function CopyToClipboard({ quizId }: { quizId: string }) {
  const [isCopied, setIscopied] = useState(false);
  const [quizeUrl, setQuizeUrl] = useState<string | null>(null);

  useEffect(() => {
    setQuizeUrl(`${window.location.origin}/${quizId}/student`);
  }, [quizId]);

  const copyToClipboard = async () => {
    try {
      if (!quizeUrl) {
        return;
      }
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
      className="cursor-pointer hover:bg-transparent"
      onClick={copyToClipboard}
    >
      {isCopied ? <Check /> : <Copy />}
    </Button>
  );
}

export default CopyToClipboard;
