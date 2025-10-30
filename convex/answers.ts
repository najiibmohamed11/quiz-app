import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
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
