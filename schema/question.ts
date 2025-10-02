import * as z from "zod";
const baseSchema = z.object({
  question: z.string().min(1, "question is missing"),
  questionType: z.literal(["MCQ", "True/False", "Short Answer"]),
});
//same us the union as enum in true false

export const mcqSchema = baseSchema
  .extend({
    options: z
      .array(z.string().min(1, "fill in or remove empty options"))
      .min(2)
      .max(5),
    correctAnswerIndex: z.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.correctAnswerIndex === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "choose the correct answer",
        path: ["correctAnswerIndex"],
      });
    }
  });
// CodeRabbit
// Fix incorrect z.literal usage for correctAnswerIndex.

// Line 27 uses z.literal([0, 1]), which validates that the value must be the exact array [0, 1], not the number 0 or 1. For True/False questions, correctAnswerIndex should be either 0 or 1.

// Apply this diff to fix the issue:

//  export const TrueFalseSchema = baseSchema
//    .extend({
// -    correctAnswerIndex: z.literal([0, 1]).optional(),
// +    correctAnswerIndex: z.union([z.literal(0), z.literal(1)]).optional(),
//    })
//    .superRefine((data, ctx) => {
export const TrueFalseSchema = baseSchema
  .extend({
    correctAnswerIndex: z.literal([0, 1]).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.correctAnswerIndex === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "choose the correct answer",
        path: ["correctAnswerIndex"],
      });
    }
  });

export const shortAnswerSchema = baseSchema.extend({
  answer: z.string(),
});

export const questionSchema = z.union([
  mcqSchema,
  TrueFalseSchema,
  shortAnswerSchema,
]);
