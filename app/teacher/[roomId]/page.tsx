"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentPerformance from "./components/StudentPerformance";
import QuestionsList from "./components/QuestionsList";
import { api } from "@/convex/_generated/api";
import Settings from "./components/Settings";
import Back from "./components/Back";
import { useQuery } from "convex/react";
import UpperCard from "./components/UpperCard";
import { useParams } from "next/navigation";
type tab = "answers" | "questions" | "settings";
export default function Room() {
  const { roomId } = useParams();
  const roomDetails = useQuery(api.room.getRoomDetails, {
    roomId: roomId as string,
  });

  if (typeof roomDetails === "string") {
    return <div>this room is not valid please go back</div>;
  }

  if (!roomDetails?.roomInfo) {
    return <div>this room is not valid please go back</div>;
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl">
      <header className="mt-8 flex flex-col gap-3">
        <Back />
        <h1 className="mx-5 text-2xl font-bold">
          {roomDetails?.roomInfo.name}
        </h1>
      </header>
      {/* upper part of the quiz */}
      <UpperCard
        roomDetails={roomDetails?.roomInfo}
        studnetsLength={roomDetails.students}
        questionLength={roomDetails.questions.length}
      />

      <div className="mt-10">
        {/* middle part or tabs */}
        <Tabs defaultValue="answers">
          <div className="flex justify-between">
            <TabsList>
              <TabsTrigger value="answers">Student Answers</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>
          {/* lower part displays wich tab did you sellect */}
          <TabsContent value="answers">
            {/* first tab is ansers or contains answer of all student in quiz */}
            <StudentPerformance
              restriction={roomDetails.roomInfo.restriction}
              questions={roomDetails.questions}
            />
          </TabsContent>
          {/* second tab is question lis and where you can add new questions  */}
          <TabsContent value="questions">
            <QuestionsList questions={roomDetails.questions} />
          </TabsContent>

          {/* lastly we have settings  */}
          <TabsContent value="settings">
            <Settings
              settings={roomDetails.roomInfo.settings}
              roomId={roomId as string}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
