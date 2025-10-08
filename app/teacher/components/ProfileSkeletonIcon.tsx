import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";

export default function ProfileSkeletonIcon() {
  return (
    <div className="flex justify-center items-center gap-1 cursor-pointer animate-pulse">
      {/* Avatar Circle */}
      <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>

      {/* Chevron placeholder */}
      <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
    </div>
  );
}
