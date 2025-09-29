import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const submitAnswer = mutation({
  args: {
    questionId: v.string(),
    studentId: v.string(),
    answer: v.optional(v.union(v.string(), v.number())),
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const studentId = ctx.db.normalizeId("students", args.studentId);
    const roomId = ctx.db.normalizeId("rooms", args.roomId);
    if (!studentId) {
      throw new ConvexError("the student Id is not valid");
    }
    if (!roomId) {
      throw new ConvexError("the room Id is not valid");
    }
    if (args.answer == undefined) {
      throw new ConvexError("answer is required");
    }
    await ctx.db.insert("answers", {
      studentId: studentId,
      roomId: roomId,
      answer: args.answer,
      questionId: args.questionId as Id<"questions">,
    });
  },
});
