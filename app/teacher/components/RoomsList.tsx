"use client";
import React, { useEffect } from "react";
import { Preloaded, usePreloadedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import CreateRoom from "./CreatRoom";
import { Card, CardFooter } from "@/components/ui/card";
import { CircleHelp, Clock10, Pause } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import QuizCardSkeliton from "./QuizCardSkeliton";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function RoomsList(propert: {
  preloadedTasks: Preloaded<typeof api.room.getRooms>;
}) {
  const rooms = usePreloadedQuery(propert.preloadedTasks);

  const [parent, enableAnimations] = useAutoAnimate();

  if (!rooms) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((numb) => (
          <QuizCardSkeliton key={numb} />
        ))}
      </div>
    );
  }

  if (rooms.length == 0) {
    return (
      <div className="mt-6 flex h-30 w-full items-center justify-center rounded-2xl bg-gray-100">
        <CreateRoom />
      </div>
    );
  }
  return (
    <div
      className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      ref={parent}
    >
      {rooms.map((room) => {
        return (
          <Link key={room._id} href={`./teacher/${room._id}`}>
            <Card className="h-55 p-0">
              <div className="p-5">
                <div className="flex justify-between">
                  <h1 className="truncate font-bold">{room?.name}</h1>
                  <Badge
                    className={`h-6 w-fit rounded-4xl bg-[#A5D6A7] px-2 text-black`}
                  >
                    {room.status}
                  </Badge>
                </div>
                <div className="mt-5 space-y-3">
                  <div className="flex items-center">
                    <Clock10 className="mr-2 h-4 w-4" />
                    <span>
                      {room.duration
                        ? `${room.duration / 60000} minutes`
                        : "not have limit"}{" "}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <CircleHelp className="mr-2 h-4 w-4" />
                    <span> {room.numberOfQuestions} questions</span>
                  </div>
                </div>
              </div>

              <CardFooter className="flex h-full w-full justify-between rounded-b-xl bg-[#A5D6A7] dark:text-black">
                {new Date(room._creationTime).toDateString()}
                <Pause className="h-4 w-4" />
              </CardFooter>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export default RoomsList;
