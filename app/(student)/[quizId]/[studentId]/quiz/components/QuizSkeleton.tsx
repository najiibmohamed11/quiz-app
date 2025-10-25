"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuizSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-2xl space-y-4 p-4">
        <CardHeader className="flex justify-between">
          <Skeleton className="h-6 w-32 rounded-md" />
          <Skeleton className="h-6 w-16 rounded-md" />
        </CardHeader>

        <CardContent className="space-y-6">
          <Skeleton className="h-6 w-3/4 rounded-md" />
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Skeleton className="h-10 w-24 rounded-md" />
        </CardFooter>
      </Card>
    </div>
  );
}
