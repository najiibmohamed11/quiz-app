"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, TrendingUp, Award } from "lucide-react";
import { Progress } from "@/components/ui/Progress";

export default function StudentScoreDisplay() {
  // Hardcoded example data
  const studentName = "Ahmed Hassan";
  const totalQuestions = 15;
  const answeredQuestions = 12;
  const correctAnswers = 10;
  const waitingForReview = 2;
  const scorePercentage = Math.round(
    (correctAnswers / answeredQuestions) * 100,
  );
  const progressPercentage = Math.round(
    (answeredQuestions / totalQuestions) * 100,
  );

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
      <div className="flex items-center justify-center gap-5">
        {/* Score Card */}
        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Current Score
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
                {correctAnswers} out of {answeredQuestions} correct
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Waiting Questions Card */}
        <Card className="border-yellow-500/30 bg-yellow-50/50 dark:bg-yellow-950/20">
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
      </div>

      {/* Detailed Progress Card */}
    </div>
  );
}
