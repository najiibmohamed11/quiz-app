"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { api } from "@/convex/_generated/api";
import UpperCard from "./UpperCard";
import StudentPerformance from "./StudentPerformance";
import QuestionsList from "./QuestionsList";
import Settings from "./Settings";
import { Preloaded, usePreloadedQuery } from "convex/react";
interface reactivePartProp {
  preloadQuizDetails: Preloaded<typeof api.quiz.getRoomDetails>;
  students: Preloaded<typeof api.student.getAllStudentsInRoom>;
  quizId: string;
}
function ReactivePart(propert: reactivePartProp) {
  const quizDetails = usePreloadedQuery(propert.preloadQuizDetails);
  const students = usePreloadedQuery(propert.students);

  return (
    <>
      <h1 className="mx-5 text-2xl font-bold">{quizDetails?.quizInfo.name}</h1>
      {/* upper part of the quiz */}
      <UpperCard
        quizDetails={quizDetails?.quizInfo}
        studnetsLength={quizDetails.students}
        questionLength={quizDetails.questions.length}
        quizId={propert.quizId}
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
              restriction={quizDetails.quizInfo.restriction}
              questions={quizDetails.questions}
              students={students}
            />
          </TabsContent>
          {/* second tab is question lis and where you can add new questions  */}
          <TabsContent value="questions">
            <QuestionsList questions={quizDetails.questions} />
          </TabsContent>

          {/* lastly we have settings  */}
          <TabsContent value="settings">
            <Settings settings={quizDetails.quizInfo.settings} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default ReactivePart;
