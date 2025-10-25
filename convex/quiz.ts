import { mutation, MutationCtx, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";

export const creatQuiz = mutation({
  args: {
    name: v.string(),
    duration: v.number(),
  },
  handler: async (ctx, args) => {
    const teacher = await ctx.auth.getUserIdentity();
    if (!teacher?.subject) {
      throw new ConvexError("not authanticated");
    }
    const isQuizExsist = await ctx.db
      .query("quizzes")
      .filter((quiz) => quiz.eq(quiz.field("name"), args.name))
      .first();

    if (isQuizExsist) {
      throw new ConvexError("This Quiz Already exsist");
    }

    const quizId = await ctx.db.insert("quizzes", {
      teacher: teacher.subject,
      name: args.name,
      duration: args.duration,
      status: "pause",
      remainingTime: args.duration,
      expiresAt: undefined,
      settings: { aiPrevention: true, randomizingQuestions: true },
      numberOfQuestions: 0,
    });

    return quizId;
  },
});

export const getQuiz = query({
  args: { quizId: v.string() },
  handler: async (ctx, args) => {
    const quizId = ctx.db.normalizeId("quizzes", args.quizId);
    if (!quizId) {
      return "Invalid quiz ID";
    }
    const quiz = await ctx.db.get(quizId);
    if (!quiz) {
      return "Quiz does not exist";
    }

    return quiz;
  },
});

export const getQuizzes = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user?.subject) {
      throw new ConvexError("not authenticated");
    }
    const quizzes = await ctx.db
      .query("quizzes")
      .filter((quiz) => quiz.eq(quiz.field("teacher"), user.subject))
      .order("desc")
      .collect();
    return quizzes;
  },
});

export const getQuizDetails = query({
  args: { quizId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user?.subject) {
      throw new ConvexError("not authenticated");
    }
    const quizId = ctx.db.normalizeId("quizzes", args.quizId);
    if (!quizId) {
      throw new ConvexError("Invalid quiz ID");
    }
    const quizInfo = await ctx.db.get(quizId);
    if (!quizInfo) {
      throw new ConvexError("Quiz does not exist");
    }
    if (quizInfo.teacher !== user.subject) {
      throw new ConvexError("this quiz is not your's");
    }
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_quiz", (question) => question.eq("quizId", quizId))
      .collect();
    const students = await ctx.db
      .query("students")
      .withIndex("by_quiz", (student) => student.eq("quizId", quizId))
      .collect();
    return {
      quizInfo,
      questions: questions,
      students: students.length,
    };
  },
});

export const FindQuiz = query({
  args: { quizName: v.string() },
  handler: async (ctx, arg) => {
    if (!arg.quizName.trim()) {
      return "please provide quiz name";
    }

    const isQuizExsist = await ctx.db
      .query("quizzes")
      .filter((quiz) => quiz.eq(quiz.field("name"), arg.quizName))
      .first();

    if (!isQuizExsist) {
      throw new ConvexError(
        "this quiz does not exist. Please check the quiz name and try again.",
      );
    }
    return isQuizExsist;
  },
});

export const changeQuizStatus = mutation({
  args: { quizId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user?.subject) {
      throw new ConvexError("not authenticated");
    }
    const quizId = ctx.db.normalizeId("quizzes", args.quizId);
    if (!quizId) {
      throw new ConvexError("quiz is invalid one");
    }
    const quiz = await ctx.db.get(quizId);
    if (!quiz) {
      throw new ConvexError("quiz data not found ");
    }
    //activation the quiz when quiz have remaining time
    if (quiz.status === "pause" && quiz.remainingTime) {
      const now = Date.now();
      const expiresAt = now + quiz.remainingTime;
      await ctx.db.patch(quizId, { expiresAt, status: "active" });
    }
    //pause when the toom is active and have expiaraton Date
    else if (quiz.status === "active" && quiz.expiresAt && quiz.duration) {
      const now = Date.now();
      const remainingTime = Math.max(0, quiz.expiresAt - now);
      await ctx.db.patch(quizId, {
        expiresAt: undefined,
        status: "pause",
        remainingTime: remainingTime,
      });
    }
    //if the quiz doesnt have timing thing
    else if (!quiz.duration && !quiz.remainingTime && !quiz.expiresAt) {
      await ctx.db.patch(quizId, {
        status: quiz.status === "active" ? "pause" : "active",
      });
    } else {
      throw new ConvexError("you can't restart ended quiz");
    }
  },
});

export const lockQuiz = mutation({
  args: {
    students: v.array(v.record(v.string(), v.string())),
    uniqueColumnForSearch: v.string(),
    quizId: v.string(),
    columns: v.array(v.string()),
  },
  handler: async (
    ctx,
    { columns, quizId, students, uniqueColumnForSearch },
  ) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user?.subject) {
      throw new ConvexError("not authenticated");
    }
    const valiQuizId = ctx.db.normalizeId("quizzes", quizId);
    if (!valiQuizId) {
      throw new ConvexError("quiz is invalid one");
    }
    const quiz = await ctx.db.get(valiQuizId);
    if (!quiz) {
      throw new ConvexError("quiz data not found ");
    }

    await deleteAllStudentsInQuiz(valiQuizId, ctx);
    const secondaryIdentifier =
      columns.length > 1
        ? columns[0] !== uniqueColumnForSearch
          ? columns[0]
          : columns[1]
        : undefined;
    const restrictingQuiz = ctx.db.patch(valiQuizId, {
      restriction: {
        uniqueColumn: uniqueColumnForSearch,
        otherColumn: secondaryIdentifier,
      },
    });
    const studentsPromis = students.map((row) => {
      const isRowValid = columns.every((element) => element in row);

      if (!isRowValid) {
        return Promise.reject("columns and rows are not matching");
      }
      return ctx.db.insert("students", {
        quizId: valiQuizId,
        completedQuestions: 0,
        uniqueId: row[uniqueColumnForSearch].toLowerCase(),
        secondaryIdentifier: secondaryIdentifier
          ? row[secondaryIdentifier]
          : undefined,
      });
    });

    await Promise.all([...studentsPromis, restrictingQuiz]);
  },
});

export const unlockQuiz = mutation({
  args: { quizId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user?.subject) {
      throw new ConvexError("not authenticated");
    }
    const quizId = ctx.db.normalizeId("quizzes", args.quizId);
    if (!quizId) {
      throw new ConvexError("quiz is invalid one");
    }
    const quiz = await ctx.db.get(quizId);
    if (!quiz) {
      throw new ConvexError("quiz data not found ");
    }

    await deleteAllStudentsInQuiz(quizId, ctx);

    await ctx.db.patch(quizId, { restriction: undefined });
  },
});

const deleteAllStudentsInQuiz = async (
  quizId: Id<"quizzes">,
  ctx: MutationCtx,
) => {
  const studentsInQuiz = await ctx.db
    .query("students")
    .withIndex("by_quiz", (student) => student.eq("quizId", quizId))
    .collect();
  if (studentsInQuiz.length > 0) {
    for (const student of studentsInQuiz) {
      await ctx.db.delete(student._id);
    }
  }
};

export const SwitchRandomizingQuestions = mutation({
  args: { quizId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user?.subject) {
      throw new ConvexError("not authenticated");
    }
    const quizId = ctx.db.normalizeId("quizzes", args.quizId);
    if (!quizId) {
      throw new ConvexError("quiz is invalid one");
    }
    const quiz = await ctx.db.get(quizId);
    if (!quiz) {
      throw new ConvexError("quiz data not found ");
    }

    await ctx.db.patch(quizId, {
      settings: {
        aiPrevention: quiz.settings.aiPrevention,
        randomizingQuestions: !quiz.settings.randomizingQuestions,
      },
    });
  },
});
export const SwitchAiPrevention = mutation({
  args: { quizId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user?.subject) {
      throw new ConvexError("not authenticated");
    }
    const quizId = ctx.db.normalizeId("quizzes", args.quizId);
    if (!quizId) {
      throw new ConvexError("quiz is invalid one");
    }
    const quiz = await ctx.db.get(quizId);
    if (!quiz) {
      throw new ConvexError("quiz data not found ");
    }

    await ctx.db.patch(quizId, {
      settings: {
        aiPrevention: !quiz.settings.aiPrevention,
        randomizingQuestions: quiz.settings.randomizingQuestions,
      },
    });
  },
});

export const deleteQuiz = mutation({
  args: { quizId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user?.subject) {
      throw new ConvexError("not authenticated");
    }
    const quizId = ctx.db.normalizeId("quizzes", args.quizId);
    if (!quizId) {
      throw new ConvexError("quiz is invalid one");
    }
    const quiz = await ctx.db.get(quizId);
    if (!quiz) {
      throw new ConvexError("quiz data not found ");
    }

    const studentsInQuiz = await ctx.db
      .query("students")
      .withIndex("by_quiz", (student) => student.eq("quizId", quizId))
      .collect();
    if (studentsInQuiz.length > 0) {
      for (const student of studentsInQuiz) {
        await ctx.db.delete(student._id);
      }
    }
    const questionsInQuiz = await ctx.db
      .query("questions")
      .withIndex("by_quiz", (student) => student.eq("quizId", quizId))
      .collect();
    if (questionsInQuiz.length > 0) {
      for (const question of questionsInQuiz) {
        await ctx.db.delete(question._id);
      }
    }
    const answersInQuiz = await ctx.db
      .query("answers")
      .withIndex("by_quiz", (student) => student.eq("quizId", quizId))
      .collect();
    if (answersInQuiz.length > 0) {
      for (const question of answersInQuiz) {
        await ctx.db.delete(question._id);
      }
    }
    await ctx.db.delete(quizId);
  },
});

export const restartEndedQuiz = mutation({
  args: { quizId: v.id("quizzes"), duration: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user?.subject) {
      throw new ConvexError("not authenticated");
    }
    const quizId = ctx.db.normalizeId("quizzes", args.quizId);
    if (!quizId) {
      throw new ConvexError("quiz is invalid one");
    }
    const quiz = await ctx.db.get(quizId);
    if (!quiz) {
      throw new ConvexError("quiz data not found ");
    }
    if (args.duration === 0) {
      await ctx.db.patch(args.quizId, {
        status: "active",
        duration: 0,
        remainingTime: 0,
        expiresAt: undefined,
      });
      return;
    }
    const expiresAt = Date.now() + args.duration;
    await ctx.db.patch(args.quizId, {
      status: "active",
      duration: args.duration,
      remainingTime: args.duration,
      expiresAt: expiresAt,
    });
  },
});
