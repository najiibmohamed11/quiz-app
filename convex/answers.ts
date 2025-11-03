import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const submitAnswer = mutation({
  args: {
    questionId: v.id("questions"),
    studentId: v.string(),
    answer: v.union(v.string(), v.number()),
    quizId: v.string(),
    decision: v.union(
      v.literal("correct"),
      v.literal("incorrect"),
      v.literal("waiting"),
    ),
  },
  handler: async (ctx, args) => {
    const studentId = ctx.db.normalizeId("students", args.studentId);
    const quizId = ctx.db.normalizeId("quizzes", args.quizId);
    if (!studentId) {
      throw new ConvexError("the student Id is not valid");
    }
    if (!quizId) {
      throw new ConvexError("the quiz Id is not valid");
    }
    if (args.answer == undefined) {
      throw new ConvexError("answer is required");
    }
    await ctx.db.insert("answers", {
      studentId: studentId,
      quizId: quizId,
      answer: args.answer,
      questionId: args.questionId,
      decision: args.decision,
    });
  },
});

export const teacherDecision = mutation({
  args: {
    answeId: v.id("answers"),
    decision: v.union(v.literal("correct"), v.literal("incorrect")),
  },
  handler: async (ctx, args) => {
    const teacher = ctx.auth.getUserIdentity();
    if (!teacher) throw new ConvexError("not authenticated");
    await ctx.db.patch(args.answeId, { decision: args.decision });
  },
});

export const getScore = query({
  args: { studentId: v.string(), quizId: v.string() },
  handler: async (ctx, args) => {
    const studentId = ctx.db.normalizeId("students", args.studentId);
    if (!studentId) return "the student Id is not valid";
    const quizId = ctx.db.normalizeId("quizzes", args.quizId);
    if (!quizId) return "the quiz Id is not valid";
    const answers = await ctx.db
      .query("answers")
      .withIndex("by_student_and_quiz", (answer) => {
        return answer.eq("studentId", studentId).eq("quizId", quizId);
      })
      .collect();
    const questionsLength = (
      await ctx.db
        .query("questions")
        .withIndex("by_quiz", (answer) => {
          return answer.eq("quizId", quizId);
        })
        .collect()
    ).length;

    let correctAnswers = 0;
    let inCorrectAnswers = 0;
    let waiting = 0;

    answers.forEach((answer) => {
      if (answer.decision === "correct") {
        correctAnswers++;
        return;
      } else if (answer.decision === "incorrect") {
        inCorrectAnswers++;
        return;
      } else {
        waiting++;
      }
    });

    return { correctAnswers, inCorrectAnswers, waiting, questionsLength };
  },
});
