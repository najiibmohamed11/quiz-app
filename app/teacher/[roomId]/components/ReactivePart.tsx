"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { api } from "@/convex/_generated/api";
import UpperCard from "./UpperCard";
import StudentPerformance from "./StudentPerformance";
import QuestionsList from "./QuestionsList";
import Settings from "./Settings";
import { Preloaded, usePreloadedQuery } from "convex/react";
function ReactivePart(propert: {
  preloadRoomDetails: Preloaded<typeof api.room.getRoomDetails>;
}) {
  const roomDetails = usePreloadedQuery(propert.preloadRoomDetails);

  return (
    <>
      <h1 className="mx-5 text-2xl font-bold">{roomDetails?.roomInfo.name}</h1>
      {/* upper part of the quiz */}
      <UpperCard
        roomDetails={roomDetails?.roomInfo}
        studnetsLength={roomDetails.students}
        questionLength={roomDetails.questions.length}
      />

      {/* middle part or tabs */}
      <div className="mt-10">
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
            <Settings settings={roomDetails.roomInfo.settings} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default ReactivePart;
