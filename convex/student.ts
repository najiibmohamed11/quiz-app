import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createStudent = mutation({
  args: { name: v.string(), quizId: v.string() },
  handler: async (ctx, args) => {
    const quizId = ctx.db.normalizeId("quizzes", args.quizId);
    if (!quizId) throw new ConvexError("this quiz is not valid");
    const studentId = await ctx.db.insert("students", {
      name: args.name,
      quizId: quizId,
      completedQuestions: 0,
    });
    return studentId;
  },
});

export const getStudent = query({
  args: { studentId: v.string(), quizId: v.string() },
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId("students", args.studentId);
    if (!id) return null;
    const studentInfo = await ctx.db.get(id);
    if (studentInfo?.quizId !== args.quizId) return null;
    return studentInfo;
  },
});

export const getAllStudentsInRoom = query({
  args: { quizId: v.string() },
  handler: async (ctx, args) => {
    const quizId = ctx.db.normalizeId("quizzes", args.quizId);
    if (!quizId) {
      return "this quiz  is not valid quiz";
    }
    const students = await ctx.db
      .query("students")
      .withIndex("by_quiz", (student) => {
        return student.eq("quizId", quizId);
      })
      .collect();
    const studentAnswers = await ctx.db
      .query("answers")
      .withIndex("by_quiz", (answer) => answer.eq("quizId", quizId))
      .collect();
    const studentWithAnswers = students.map((student) => {
      const thisStudentsAnswers = studentAnswers.filter(
        (answer) => answer.studentId === student._id,
      );
      const completeData = { ...student, answers: thisStudentsAnswers };
      return completeData;
    });
    return studentWithAnswers;
  },
});

export const getFullQuizData = query({
  args: { studentId: v.string(), quizId: v.string() },
  handler: async (ctx, args) => {
    const studentId = ctx.db.normalizeId("students", args.studentId);
    const quizId = ctx.db.normalizeId("quizzes", args.quizId);
    if (!quizId || !studentId) return null;
    const studentInfo = await ctx.db.get(studentId);
    if (!studentInfo) return null;
    if (studentInfo.quizId !== quizId) return null;
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_quiz", (question) => {
        return question.eq("quizId", quizId);
      })
      .collect();

    const quizInfo = await ctx.db.get(quizId);
    if (!quizInfo) return null;
    if (questions.length === 0) return "no questions";
    if (quizInfo.status === "pause") return "paused";
    if (quizInfo.duration && quizInfo.expiresAt) {
      const remainingTime = Math.max(0, quizInfo.expiresAt - Date.now());
      if (remainingTime === 0) return "expired";
    }
    return { questions, quizInfo, studentInfo };
  },
});

export const findStudentInLockedQuiz = query({
  args: { uniqueId: v.string(), quizId: v.string() },
  handler: async (ctx, args) => {
    const quizId = ctx.db.normalizeId("quizzes", args.quizId);
    if (!quizId) {
      throw new ConvexError("invalid quiz id");
    }
    const student = await ctx.db
      .query("students")
      .withIndex("by_uniqueId", (student) =>
        student.eq("uniqueId", args.uniqueId).eq("quizId", quizId),
      )
      .unique();
    if (!student) {
      return "student not found";
    }
    return student._id;
  },
});
