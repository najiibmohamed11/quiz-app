import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import React from "react";

function InValidQuiz() {
  return (
    <Alert variant="destructive" className="mx-auto mt-6 max-w-lg">
      <TriangleAlert className="h-5 w-5" />
      <AlertTitle>Invalid Room</AlertTitle>
      <AlertDescription>
        The quiz you’re trying to access doesn’t exist or is no longer
        available.
      </AlertDescription>
    </Alert>
  );
}

export default InValidQuiz;
