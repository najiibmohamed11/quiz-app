import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  questions: defineTable({
    questionType: v.union(
      v.literal("MCQ"),
      v.literal("True/False"),
      v.literal("Short Answer"),
    ),
    roomId: v.id("rooms"),
    question: v.string(),
    options: v.optional(v.array(v.string())),
    correctAnswerIndex: v.optional(v.number()),
    answer: v.optional(v.string()),
  }).index("by_room", ["roomId"]),
  rooms: defineTable({
    name: v.string(),
    duration: v.number(),
    status: v.union(v.literal("active"), v.literal("pause")),
    remainingTime: v.number(),
    expiresAt: v.optional(v.number()),
    restriction: v.optional(
      v.object({
        uniqueColumn: v.string(),
        otherColumn: v.optional(v.string()),
      }),
    ),
    teacher: v.optional(
      v.union(
        v.string(),
        v.object({
          email: v.string(),
          emailVerified: v.boolean(),
          familyName: v.string(),
          givenName: v.string(),
          issuer: v.string(),
          name: v.string(),
          phoneNumberVerified: v.boolean(),
          pictureUrl: v.string(),
          subject: v.string(),
          tokenIdentifier: v.string(),
          updatedAt: v.string(),
        }),
      ),
    ),
  }),
  students: defineTable({
    name: v.optional(v.string()),
    roomId: v.id("rooms"),
    uniqueId: v.optional(v.string()),
    secondaryIdentifier: v.optional(v.string()),
    completedQuestions: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_uniqueId", ["uniqueId", "roomId"]),
  answers: defineTable({
    studentId: v.id("students"),
    roomId: v.id("rooms"),
    questionId: v.id("questions"),
    answer: v.union(v.string(), v.number()),
  })
    .index("by_room", ["roomId"])
    .index("by_student", ["studentId"])
    .index("by_question", ["questionId"]),
});
