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
  quizId,
  studentsLength,
}: {
  quizId: string;
  studentsLength: number;
}) => {
  const unlock = useMutation(api.quiz.unlockQuiz);
  const handleUnLock = async () => {
    try {
      await unlock({ quizId: quizId });
    } catch (e) {
      console.log(e);
    }
  };
  if (studentsLength === 0) {
    return (
      <Button onClick={handleUnLock}>
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
            All students who have already entered the quiz will be removed and
            lose their data.
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
