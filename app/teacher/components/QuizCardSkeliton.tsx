import { Card, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function QuizCardSkeliton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <Card key={idx} className="h-55 animate-pulse p-0">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="h-5 w-1/2 rounded bg-gray-300 dark:bg-gray-700"></div>
              <Badge className="h-6 w-16 rounded-full bg-green-200"></Badge>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div className="h-4 w-1/4 rounded bg-gray-300 dark:bg-gray-700"></div>
              </div>

              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div className="h-4 w-1/4 rounded bg-gray-300 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>

          <CardFooter className="flex h-full w-full justify-between rounded-b-xl bg-[#A5D6A7] dark:text-black">
            <div className="h-4 w-1/4 rounded bg-gray-300 dark:bg-gray-700"></div>
            <div className="h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
