import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function StudentPerformanceLoading() {
  return (
    <Card>
      <CardHeader>
        <h1 className="font-medium">Loading Student Performance...</h1>
      </CardHeader>
      <CardContent className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <Skeleton className="h-5 w-32" />
            <div className="flex gap-2">
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} className="h-8 w-16" />
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default StudentPerformanceLoading;
