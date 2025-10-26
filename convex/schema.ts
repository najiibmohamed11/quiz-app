import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  questions: defineTable({
    questionType: v.union(
      v.literal("MCQ"),
      v.literal("True/False"),
      v.literal("Short Answer"),
    ),
    quizId: v.id("quizzes"),
    question: v.string(),
    options: v.optional(v.array(v.string())),
    correctAnswerIndex: v.optional(v.number()),
    answer: v.optional(v.string()),
  }).index("by_quiz", ["quizId"]),
  quizzes: defineTable({
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
    settings: v.object({
      aiPrevention: v.boolean(),
      randomizingQuestions: v.boolean(),
    }),
    numberOfQuestions: v.number(),
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
    quizId: v.id("quizzes"),
    uniqueId: v.optional(v.string()),
    secondaryIdentifier: v.optional(v.string()),
    completedQuestions: v.number(),
  })
    .index("by_quiz", ["quizId"])
    .index("by_uniqueId", ["uniqueId", "quizId"]),
  answers: defineTable({
    studentId: v.id("students"),
    quizId: v.id("quizzes"),
    questionId: v.id("questions"),
    answer: v.union(v.string(), v.number()),
  })
    .index("by_quiz", ["quizId"])
    .index("by_student_and_quiz", ["studentId", "quizId"])
    .index("by_question", ["questionId"]),
});
