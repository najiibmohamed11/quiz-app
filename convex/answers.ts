import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const submitAnswer = mutation({
  args: {
    questionId: v.string(),
    studentId: v.string(),
    answer: v.union(v.string(), v.number()),
    quizId: v.string(),
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
      questionId: args.questionId as Id<"questions">,
    });
  },
});
