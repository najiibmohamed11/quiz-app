"use client";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import CreateRoom from "./components/CreatRoom";
import { UserButton } from "@clerk/nextjs";
import Profile from "../components/Profile";
import { CircleHelp, Menu, MenuSquareIcon, Pause, Users } from "lucide-react";
import { Card, CardFooter } from "@/components/ui/card";

export default function Teacher() {
  return (
    <div className="max-w-6xl px-8 min-h-screen mx-auto ">
      <header className=" -700 flex  justify-between mt-4  ">
        <h1>A</h1>
        <div className="flex gap-4 justify-center">
          <CreateRoom />
          <Profile />
        </div>
      </header>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
        {(Array.from({length:5},(_,i)=>i+1)).map((arr)=>{
          return(
                    <Card className=" h-55 p-0">

        <div className="  p-5">
        <div className="flex justify-between">
                <h1 className="font-bold">C1211</h1>
                <div className="bg-green-200 w-fit  rounded-4xl px-2 text-green-900">active</div>
        </div>
          <div className="space-y-3 mt-5">
                    <div className="flex items-center text-purple-800">
                      <Users className="h-4 w-4 mr-2" />
                      <span>
                         0 participants
                      </span>
                    </div>

                    <div className="flex items-center text-purple-800 ">
                    <CircleHelp className="h-4 w-4 mr-2"/>
                        <span > 0 questions</span>
                    </div>
                    </div>


        </div>
          
  <CardFooter className="w-full h-full rounded-b-xl bg-pink-400 flex justify-between">
    {(new Date()).toDateString()}
          <Pause className="h-4 w-4 " />

  </CardFooter>
        </Card>
          )
        })}

      </div>
    </div>
  );
}
