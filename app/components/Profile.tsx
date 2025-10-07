"use client";

import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ChevronDown, LogOut } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
function Profile() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigater = useRouter();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleClick = (e: Event) => {
      if (
        !profileRef.current ||
        profileRef.current.contains(e.target as Node)
      ) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen]);

  if (!isLoaded) {
    return (
      <div className="relative">
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 py-1 rounded-full "
        >
          <Skeleton className="h-8 w-8 rounded-full bg-gray-400" />
          <Skeleton className="h-4 w-4 bg-gray-400" />
        </Button>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      navigater.push("/");
    } catch (e) {
      console.log(e);
    }
  };
  const getAvaterName = (fullName: string) => {
    return fullName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className=" relative" ref={profileRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-center items-center gap-1 cursor-pointer"
      >
        <Avatar>
          <AvatarImage src={user.imageUrl} alt="profile" />
          <AvatarFallback>{getAvaterName(user.fullName ?? "")}</AvatarFallback>
        </Avatar>
        <ChevronDown
          size={20}
          className={`transition-transform ${isOpen && "rotate-180"}`}
        />
      </button>
      {isOpen && (
        <Card className="  absolute right-1 top-11 rounded-xl  p-4 transition-all ease-in-out duration-200  slide-in-from-top-5 animate-in">
          <CardContent className="flex items-center gap-2  font-medium truncate ">
            <Avatar>
              <AvatarImage src={user.imageUrl} alt="profile" />
              <AvatarFallback>
                {getAvaterName(user.fullName ?? "")}
              </AvatarFallback>
            </Avatar>
            <div className="">
              <span>{user.fullName}</span>
              <span className="font-light block text-xs ">
                {user.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          </CardContent>
          <Separator />

          <CardFooter
            onClick={handleSignOut}
            className="flex  items-center justify-center text-center   gap-2   dark:text-red-500 text-red-500  cursor-pointer"
          >
            <LogOut size={18} />
            <p>Log out</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export default Profile;
