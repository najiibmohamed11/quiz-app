import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ChevronDown, LogOut } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
    return;
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
        <div className="w-65 h-33  absolute right-1 top-11 rounded-xl bg-white border-1 border-gray-300 p-4 transition-all ease-in-out duration-200  slide-in-from-top-5 animate-in">
          <div className="flex items-center gap-2  font-medium truncate ">
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
          </div>
          <hr className="mt-4 h-2" />
          <button
            onClick={handleSignOut}
            className="flex  items-center justify-center text-center w-full   gap-2 hover:bg-gray-50 h-10 hover:rounded-xl text-red-500 text-l cursor-pointer"
          >
            <LogOut size={18} />
            <p>Log out</p>
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
