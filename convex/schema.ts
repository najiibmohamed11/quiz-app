import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    questions:defineTable({
        questionType:v.union(
        v.literal("MCQ"),
        v.literal("True/False"),
        v.literal("Short Answer")
    ),
    roomId:v.id("rooms"),
    question:v.string(),
    options:v.optional(v.array(v.string())),
    correctAnswerIndex:v.optional(v.number()),
    answer:v.optional(v.string()),
    }).index("by_room",["roomId"]),
  rooms: defineTable({
    duration: v.object({
      hour: v.float64(),
      minute: v.float64(),
    }),
    name: v.string(),
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
        })
      )
    ),
  }),
},



)






