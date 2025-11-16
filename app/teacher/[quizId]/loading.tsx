import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function QuizDetailLoading() {
  return (
    <div className="mx-auto min-h-screen max-w-6xl">
      <header className="mt-8 flex flex-col gap-3">
        {/* Back button skeleton */}
        <Skeleton className="h-10 w-20" />
      </header>

      {/* Quiz title skeleton */}
      <Skeleton className="mx-5 mt-4 h-8 w-64" />

      {/* Upper card skeleton */}
      <Card className="mt-4 grid h-50 grid-cols-2 p-5">
        <div className="gap-y-2">
          <div>
            <Skeleton className="h-5 w-24" />
            <div className="mt-2 flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-8" />
            </div>
          </div>
          <div className="mt-4">
            <Skeleton className="h-5 w-28" />
            <div className="mt-2 flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-8" />
            </div>
          </div>
        </div>

        <div className="flex h-full flex-col items-end justify-between">
          {/* URL and copy button skeleton */}
          <div className="flex w-full gap-2">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>

          {/* Timer skeleton */}
          <Skeleton className="h-8 w-32" />

          {/* Status button skeleton */}
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </Card>

      {/* Tabs skeleton */}
      <div className="mt-10">
        <Tabs defaultValue="answers">
          <div className="flex justify-between">
            <TabsList>
              <TabsTrigger value="answers">Student Answers</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          {/* Tab content skeleton */}
          <div className="mt-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </Tabs>
      </div>
    </div>
  );
}

