import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, TrendingUp, Award } from "lucide-react";
import { Progress } from "@/components/ui/Progress";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Invalid from "@/app/components/Invalid";
interface studentPageProps {
  params: {
    studentId: string;
    quizId: string;
  };
}
export default async function StudentScoreDisplay({
  params,
}: studentPageProps) {
  const { quizId, studentId } = await params;
  // Hardcoded example data
  const info = await fetchQuery(api.answers.getScore, { studentId, quizId });

  if (typeof info === "string") return <Invalid />;

  const studentName = "Ahmed Hassan";
  const totalQuestions = info.questionsLength;
  const answeredQuestions =
    info.correctAnswers + info.inCorrectAnswers + info.waiting;
  const correctAnswers = info.correctAnswers;
  const waitingForReview = info.waiting;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="flex min-h-[100vh] items-center justify-center">
      {/* Header Card */}
      {/* <Card className="border-primary/20 bg-gradient-to-br from-card to-accent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">{studentName}</CardTitle>
              <p className="text-muted-foreground text-sm mt-1">Quiz Performance Overview</p>
            </div>
            <Award className="h-12 w-12 text-primary" />
          </div>
        </CardHeader>
      </Card> */}

      {/* Stats Grid */}
      <div className="flex flex-col items-center justify-center gap-5 sm:flex-row md:flex-row lg:flex-row">
        {/* Score Card */}
        <Card className="border-primary/30 w-[220px]">
          <CardHeader className="pb-3">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {waitingForReview === 0 ? "Score" : "Current Score"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-primary text-4xl font-bold">
                {scorePercentage}%
              </span>
            </div>
            <div className="text-muted-foreground mt-2 flex items-center gap-1 text-xs">
              <CheckCircle className="text-primary h-3 w-3" />
              <span>
                {correctAnswers} out of {totalQuestions} correct
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Waiting Questions Card */}
        {waitingForReview !== 0 && (
          <Card className="w-[220px] border-yellow-500/30 bg-yellow-50/50 dark:bg-yellow-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-yellow-600 dark:text-yellow-500">
                  {waitingForReview}
                </span>
                <span className="text-muted-foreground text-sm">questions</span>
              </div>
              <div className="text-muted-foreground mt-2 flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3 text-yellow-600 dark:text-yellow-500" />
                <span>Awaiting teacher approval</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detailed Progress Card */}
    </div>
  );
}
