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
import ProfileSkeletonIcon from "../teacher/components/ProfileSkeletonIcon";
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
    return <ProfileSkeletonIcon />;
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
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center justify-center gap-1"
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
        <Card className="slide-in-from-top-5 animate-in absolute top-11 right-1 z-1 rounded-xl p-4 transition-all duration-200 ease-in-out">
          <CardContent className="flex items-center gap-2 truncate font-medium">
            <Avatar>
              <AvatarImage src={user.imageUrl} alt="profile" />
              <AvatarFallback>
                {getAvaterName(user.fullName ?? "")}
              </AvatarFallback>
            </Avatar>
            <div className="">
              <span>{user.fullName}</span>
              <span className="block text-xs font-light">
                {user.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          </CardContent>
          <Separator />

          <CardFooter
            onClick={handleSignOut}
            className="flex cursor-pointer items-center justify-center gap-2 text-center text-base font-normal text-red-500 dark:text-red-500"
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
