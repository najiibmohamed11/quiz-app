"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface settingProps {
  settings: {
    aiPrevention: boolean;
    randomizingQuestions: boolean;
  };
}

function Settings({ settings }: settingProps) {
  const { quizId }: { quizId: string } = useParams();
  const switchAiPrevention = useMutation(api.quiz.SwitchAiPrevention);
  const switchRandomizingQuestion = useMutation(
    api.quiz.SwitchRandomizingQuestions,
  );
  const deletQuiz = useMutation(api.quiz.deleteQuiz);
  const navigator = useRouter();

  const handleRandomizeQuestionToggle = async () => {
    try {
      await switchRandomizingQuestion({ quizId });
    } catch (e) {
      console.log(e);
    }
  };
  const handleAiPreventionToggle = async () => {
    try {
      await switchAiPrevention({ quizId });
    } catch (e) {
      console.log(e);
    }
  };
  const handleDelte = async () => {
    try {
      await deletQuiz({ quizId });
      navigator.replace("/teacher");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl">Settings</h1>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div className="space-y-2">
            <Label id="randomizing-questions" className="">
              randomize questions
            </Label>
            <p className="text-gray- text-muted-foreground text-sm">
              Show questions in random order for each participant
            </p>
          </div>
          <Switch
            checked={settings.randomizingQuestions}
            onCheckedChange={handleRandomizeQuestionToggle}
            id="randomizing-questions"
            className="cursor-pointer"
          />
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between">
          <div className="space-y-2">
            <Label id="randomizing-questions " className="">
              Prevent AI usage
            </Label>
            <ul className="text-muted-foreground ml-6 list-disc text-sm">
              <li>{"student can't copy past text "}</li>
              <li>tracking tap switches </li>
            </ul>
          </div>
          <Switch
            checked={settings.aiPrevention}
            onCheckedChange={handleAiPreventionToggle}
            id="randomizing-questions"
            className="cursor-pointer text-green-400"
          />
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between">
          <div className="space-y-2">
            <Label id="randomizing-questions" className="">
              Delet Quiz
            </Label>
            <p className="text-gray- text-muted-foreground text-sm">
              once you delete the quiz all data would be lost there is no
              getting back
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-red-600 text-white hover:bg-red-700">
                <Trash /> Delet Quiz
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Once you delete quiz all data would be lost; there&apos;s no
                  getting back.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 text-white hover:bg-red-700"
                  onClick={handleDelte}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <Separator className="my-4" />
      </CardContent>
    </Card>
  );
}

export default Settings;
