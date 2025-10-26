"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import UpperCard from "./UpperCard";
import StudentPerformance from "./StudentPerformance";
import QuestionsList from "./QuestionsList";
import Settings from "./Settings";
import { Preloaded, useConvexAuth, usePreloadedQuery } from "convex/react";
import Invalid from "@/app/components/Invalid";
import UnAuthanticated from "@/app/components/UnAuthanticated";
import Back from "./Back";
interface reactivePartProp {
  preloadQuizDetails: Preloaded<typeof api.quiz.getQuizDetails>;
  students: Preloaded<typeof api.student.getAllStudentsInRoom>;
  quizId: string;
}
function ReactivePart(propert: reactivePartProp) {
  const quizData = usePreloadedQuery(propert.preloadQuizDetails);
  const studentData = usePreloadedQuery(propert.students);
  const [quizDetails, setQuizDetails] = useState(quizData);
  const [students, setStudents] = useState(studentData);
  const { isAuthenticated } = useConvexAuth();
  useEffect(() => {
    if (isAuthenticated) {
      setQuizDetails(quizData);
      setStudents(studentData);
    }
  }, [isAuthenticated, quizData, studentData]);
  if (quizData === "not authenticated" || students === "not authenticated")
    return <UnAuthanticated />;
  if (typeof quizDetails === "string" || typeof students === "string")
    return <Invalid />;

  return (
    <>
      <header className="mt-8 flex flex-col gap-3">
        <Back />
      </header>
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
              quizId={propert.quizId}
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
