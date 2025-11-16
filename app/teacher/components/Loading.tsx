import { Rubik } from "next/font/google";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function TeacherLoading() {
  return (
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Card key={idx} className="h-55 animate-pulse p-0">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-1/2" />
                <Badge className="h-6 w-16 rounded-full bg-green-200"></Badge>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center">
                  <Skeleton className="mr-2 h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-1/4" />
                </div>

                <div className="flex items-center">
                  <Skeleton className="mr-2 h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            </div>

            <CardFooter className="flex h-full w-full justify-between rounded-b-xl bg-[#A5D6A7] dark:text-black">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
  );
}

