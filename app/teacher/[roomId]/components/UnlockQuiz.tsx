import { Button } from "@/components/ui/button";
import { LockKeyholeOpen } from "lucide-react";
import React from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UnlockQuiz = ({
  roomId,
  studentsLength,
}: {
  roomId: string;
  studentsLength: number;
}) => {
  const unloack = useMutation(api.room.unlockRoom);
  const handleUnLock = async () => {
    try {
      await unloack({ roomId: roomId });
    } catch (e) {
      console.log(e);
    }
  };
  if (studentsLength === 0) {
    return (
      <Button>
        <LockKeyholeOpen /> unlockQuiz
      </Button>
    );
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <LockKeyholeOpen /> unlockQuiz
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            All students all ready entred quiz would be deleted and lost there
            data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleUnLock}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnlockQuiz;
