import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";

function Timer({
  expiresAt,
  setIsTimerEnd,
}: {
  expiresAt: number;
  setIsTimerEnd: (isTimerEnd: boolean) => void;
}) {
  const [timer, setTimer] = useState(() => Math.max(0, expiresAt - Date.now()));
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      const remainingTime = Math.max(0, expiresAt - now);
      setTimer(remainingTime);
      if (remainingTime === 0) {
        setIsTimerEnd(true);
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const formatTimer = (timer: number) => {
    const minutes = Math.floor(timer / 60000);
    if (minutes < 100) {
      const seconds = Math.floor((timer % 60000) / 1000);
      return `${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`;
    }
    const hour = Math.floor(timer / 3600000); //1h is equal to 3,600,000 milliseconds
    const remainderMinutes = Math.floor((timer % 3600000) / 60000); //1minute is equal to 60,000 milliseconds
    const seconds = Math.floor((timer % 60000) / 1000); //1minute is equal to 60,000 milliseconds
    return `${hour.toString().padStart(2, "0")} : ${remainderMinutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`;
  };
  return (
    <div>
      <Badge>{formatTimer(timer)}</Badge>
    </div>
  );
}

export default Timer;
