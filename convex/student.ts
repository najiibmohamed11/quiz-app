import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createStudent = mutation({
  args: { name: v.string(), roomId: v.string() },
  handler: async (ctx, args) => {
    const roomId = ctx.db.normalizeId("rooms", args.roomId);
    if (!roomId) throw new ConvexError("this room is not valid");
    const studentId = await ctx.db.insert("students", {
      name: args.name,
      roomId: roomId,
      completedQuestions: 0,
    });
    return studentId;
  },
});

export const getStudent = query({
  args: { studentId: v.string(), roomId: v.string() },
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId("students", args.studentId);
    if (!id) return null;
    const studentInfo = await ctx.db.get(id);
    if (studentInfo?.roomId !== args.roomId) return null;
    return studentInfo;
  },
});

export const getAllStudentsInRoom = query({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    const roomId = ctx.db.normalizeId("rooms", args.roomId);
    if (!roomId) {
      return "this room  is not valid room";
    }
    const students = await ctx.db
      .query("students")
      .withIndex("by_room", (student) => {
        return student.eq("roomId", roomId);
      })
      .collect();
    const studentAnswers = await ctx.db
      .query("answers")
      .withIndex("by_room", (answer) => answer.eq("roomId", roomId))
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
  args: { studentId: v.string(), roomId: v.string() },
  handler: async (ctx, args) => {
    const studentId = ctx.db.normalizeId("students", args.studentId);
    const roomId = ctx.db.normalizeId("rooms", args.roomId);
    if (!roomId || !studentId) return null;
    const studentInfo = await ctx.db.get(studentId);
    if (!studentInfo) return null;
    if (studentInfo.roomId !== roomId) return null;
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_room", (question) => {
        return question.eq("roomId", roomId);
      })
      .collect();

    const roomInfo = await ctx.db.get(roomId);
    if (!roomInfo) return null;
    if (questions.length === 0) return "no questions";
    if (roomInfo.status === "pause") return "paused";
    if (roomInfo.duration && roomInfo.expiresAt) {
      const remainingTime = Math.max(0, roomInfo.expiresAt - Date.now());
      if (remainingTime === 0) return "expired";
    }
    return { questions, roomInfo, studentInfo };
  },
});

export const findStudentInLockedQuiz = query({
  args: { uniqueId: v.string(), roomId: v.string() },
  handler: async (ctx, args) => {
    const roomId = ctx.db.normalizeId("rooms", args.roomId);
    if (!roomId) {
      throw new ConvexError("invalid room id");
    }
    const student = await ctx.db
      .query("students")
      .withIndex("by_uniqueId", (student) =>
        student.eq("uniqueId", args.uniqueId).eq("roomId", roomId),
      )
      .unique();
    if (!student) {
      return "student not found";
    }
    return student._id;
  },
});
