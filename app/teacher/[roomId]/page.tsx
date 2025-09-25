"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldQuestionMark, MoveLeft, User, Copy, Check } from "lucide-react";
import StudentPerformance from "./components/StudentPerformance";
import QuestionsList from "./components/QuestionsList";
import AddQuestion from "./components/AddQuestion";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueries, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
type tab = "answers" | "questions" | "settings";
export default function Room() {
  const [activeTab, setActiveTab] = useState<tab>("answers");
  const rout = useRouter();
  const {roomId}=useParams()
  const roomDetails=useQuery(api.room.getRoomDetails,{roomId:roomId as string})
  const [isCopied,setIscopied]=useState(false)
  if(typeof roomDetails==="string"){
    return <div>this room is not valid please go back</div>
  }
  if(!roomDetails?.roomInfo){
    return <div>this room is not valid please go back</div>
  }
  const quizeUrl=`localhost:3000/${roomId}/student`
  const copyToClipboard=async()=>{
    try{
      await navigator.clipboard.writeText(quizeUrl)
      setIscopied(true)
      setTimeout(()=>{
        setIscopied(false)
      },1000)
    }catch(e){
      console.log(e)
    }
  }
  return (
    <div className=" max-w-6xl  min-h-screen mx-auto">
      <header className="flex gap-3 mt-8  flex-col ">
        <button
          className="cursor-pointer  w-20 flex justify-around "
          onClick={() => rout.back()}
        >
          <MoveLeft /> Back
        </button>
        <h1 className="font-bold text-2xl mx-5 ">{roomDetails?.roomInfo.name}</h1>
      </header>
      <Card className="p-5 mt-4 grid grid-cols-2 h-50">
        <div className="gap-y-2 ">
          <div>
            <h1 className="font-semibold text-l">Queations</h1>
            <div className="mt-2 flex items-center gap-2   ">
              <ShieldQuestionMark size={18} />
              <h1 className="font-semibold">{roomDetails.questionLength}</h1>
            </div>
          </div>
          <div className="mt-2">
            <h1 className="font-semibold text-l">Participants</h1>
            <div className="mt-2 flex items-center gap-2   ">
              <User size={18} />
              <h1 className="font-semibold">{roomDetails.participants}</h1>
            </div>
          </div>
        </div>
        {/* <div className="gap-y-2 ">
          <div>
            <h1 className="font-semibold text-l">Queations</h1>
            <div className="mt-2 flex items-center gap-2   ">
              <ShieldQuestionMark size={18} />
              <h1 className="font-semibold">10</h1>
            </div>
          </div>
          <div className="mt-2">
            <h1 className="font-semibold text-l">Participants</h1>
            <div className="mt-2 flex items-center gap-2   ">
              <User size={18} />
              <h1 className="font-semibold">10</h1>
            </div>
          </div>
        </div> */}
        <div className="flex flex-col justify-between h-full items-end">
          <div className="flex ">
            <div className="w-full bg-purple-100 p-2 rounded-md text-l font-semibold text-purple-700">
              http://quiz-app/room/we.........
            </div>
            <Button variant="ghost" className="hover:bg-transparent" onClick={copyToClipboard}>
             {isCopied?<Check/>: <Copy />}
            </Button>
          </div>
          <Button className="w-60 mr-9">00 : 30 : 10</Button>
          <Button className="w-60 mr-9" variant="outline">
            puase
          </Button>
        </div>
      </Card>

      <div className=" mt-10">
        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => setActiveTab(value as tab)}
        >
          <div className="flex justify-between">
            <TabsList>
              <TabsTrigger value="answers">Student Answers</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            {activeTab === "questions" && <AddQuestion />}
          </div>
          <TabsContent value="answers">
            <StudentPerformance />
          </TabsContent>
          <TabsContent value="questions">
            <QuestionsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
