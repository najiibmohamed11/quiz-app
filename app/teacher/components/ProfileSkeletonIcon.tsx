import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";

export default function ProfileSkeletonIcon() {
  return (
    <div className="flex animate-pulse cursor-pointer items-center justify-center gap-1">
      {/* Avatar Circle */}
      <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>

      {/* Chevron placeholder */}
      <div className="h-5 w-5 rounded bg-gray-300 dark:bg-gray-700"></div>
    </div>
  );
}
