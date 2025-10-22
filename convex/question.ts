import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const createQuestion = mutation({
  args: {
    questionType: v.union(
      v.literal("MCQ"),
      v.literal("True/False"),
      v.literal("Short Answer"),
    ),
    question: v.string(),
    options: v.optional(v.array(v.string())),
    correctAnswerIndex: v.optional(v.number()),
    answer: v.optional(v.string()),
    quizId: v.id("quizzes"),
  },
  handler: async (ctx, args) => {
    //common checks
    if (
      args.questionType == "MCQ" &&
      (!args.options ||
        typeof args.correctAnswerIndex != "number" ||
        args.correctAnswerIndex >= args.options.length)
    ) {
      throw new ConvexError(
        `${!args.options ? "options are missing" : typeof args.correctAnswerIndex === "number" ? "correct answer is missing" : "invalid option index"}`,
      );
    } else if (
      args.questionType == "True/False" &&
      typeof args.correctAnswerIndex != "number"
    ) {
      throw new ConvexError("correct answer is missing");
    }
    const id = await ctx.db.insert("questions", {
      question: args.question,
      options: args.options,
      correctAnswerIndex: args.correctAnswerIndex,
      answer: args.answer,
      questionType: args.questionType,

      quizId: args.quizId,
    });
    const quiz = await ctx.db.get(args.quizId);
    await ctx.db.patch(args.quizId, {
      numberOfQuestions: quiz?.numberOfQuestions,
    });
    return id;
  },
});

export const getRoomeQuestions = query({
  args: { quizId: v.string() },
  handler: (ctx, arg) => {
    const quizId = ctx.db.normalizeId("quizzes", arg.quizId);
    if (!quizId) {
      return "invalid quiz id";
    }

    const questions = ctx.db
      .query("questions")
      .withIndex("by_quiz", (question) => {
        return question.eq("quizId", quizId);
      })
      .collect();
    return questions;
  },
});
