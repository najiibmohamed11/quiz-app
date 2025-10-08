"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import CreateRoom from "./CreatRoom";
import { Card, CardFooter } from "@/components/ui/card";
import { CircleHelp, Clock10, Pause, Users } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

function RoomsList() {
  const rooms = useQuery(api.room.getRooms);

  if (!rooms) {
    return (
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
        {Array.from({ length: 6 }, (_, i) => i + 1).map((numb) => (
          <Skeleton
            key={numb}
            className="h-55 rounded-2xl  bg-gray-200"
          ></Skeleton>
        ))}
      </div>
    );
  }

  if (rooms.length == 0) {
    return (
      <div className="w-full h-30 bg-gray-100 flex justify-center items-center mt-6 rounded-2xl">
        <CreateRoom />
      </div>
    );
  }
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
      {rooms.map((room) => {
        return (
          <Link key={room._id} href={`./teacher/${room._id}`}>
            <Card className=" h-55 p-0">
              <div className="  p-5">
                <div className="flex justify-between">
                  <h1 className="font-bold">{room?.name}</h1>
                  <Badge className="bg-green-200 w-fit  rounded-4xl px-2 text-green-900">
                    active
                  </Badge>
                </div>
                <div className="space-y-3 mt-5">
                  <div className="flex items-center ">
                    <Clock10 className="h-4 w-4 mr-2" />
                    <span>
                      {room.duration
                        ? `${room.duration / 60000} minutes`
                        : "not have limit"}{" "}
                    </span>
                  </div>

                  <div className="flex items-center ">
                    <CircleHelp className="h-4 w-4 mr-2" />
                    <span> {room.numberOfQuestions} questions</span>
                  </div>
                </div>
              </div>

              <CardFooter className="w-full h-full rounded-b-xl bg-[#A5D6A7] dark:text-black flex justify-between">
                {new Date(room._creationTime).toDateString()}
                <Pause className="h-4 w-4 " />
              </CardFooter>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export default RoomsList;
