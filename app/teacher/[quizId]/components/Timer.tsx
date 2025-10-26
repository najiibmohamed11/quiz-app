"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

type TimerProp = {
  expiresAt: number | undefined;
  quizStatus: "active" | "pause";
  remainingTime: number | undefined;
  setIsTimerEnded: (isTimerEnd: boolean) => void;
};

function Timer({
  expiresAt,
  quizStatus,
  remainingTime,
  setIsTimerEnded,
}: TimerProp) {
  const [timer, setTimer] = useState(() =>
    expiresAt ? Math.max(0, expiresAt - Date.now()) : (remainingTime ?? 0),
  );

  useEffect(() => {
    if (!expiresAt || quizStatus === "pause") {
      setTimer(remainingTime ?? 0);
      return;
    }

    const id = setInterval(() => {
      const now = Date.now();
      const RemainingTime = Math.max(0, expiresAt - now);
      setTimer(RemainingTime);
      if (RemainingTime === 0) {
        setIsTimerEnded(true);
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [quizStatus, expiresAt, remainingTime]);

  const formatTime = (remainingTimeInMilliseconds: number) => {
    const remainingTimeInSeconds = Math.floor(
      remainingTimeInMilliseconds / 1000,
    );
    const hours = Math.floor(remainingTimeInSeconds / 3600);
    const minutes = Math.floor((remainingTimeInSeconds % 3600) / 60);
    const seconds = Math.floor(remainingTimeInSeconds % 60);
    return `${hours.toString().padStart(2, "0")} : ${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Button variant="outline" className="mr-9 w-60">
      {formatTime(timer)}
    </Button>
  );
}

export default Timer;
