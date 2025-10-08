import { Card, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function QuizCardSkeliton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <Card key={idx} className="h-55 p-0 animate-pulse">
          <div className="p-5">
            <div className="flex justify-between items-center">
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              <Badge className="bg-green-200 w-16 h-6 rounded-full"></Badge>
            </div>

            <div className="space-y-3 mt-5">
              <div className="flex items-center">
                <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded-full mr-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
              </div>

              <div className="flex items-center">
                <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded-full mr-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          </div>

          <CardFooter className="w-full h-full rounded-b-xl bg-[#A5D6A7] dark:text-black flex justify-between">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
