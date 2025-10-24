import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FindQuizClients from "./components/FindQuizClients";

function FindQuiz() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-80">
        <CardHeader>
          <h1 className="text-center font-bold">Quiz Details</h1>
        </CardHeader>
        <CardContent className=""></CardContent>
        <FindQuizClients />
      </Card>
    </div>
  );
}

export default FindQuiz;
