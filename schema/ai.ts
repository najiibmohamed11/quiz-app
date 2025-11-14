import z from "zod";

export const questionSchema = z.object({
  questionType: z.enum(["Multiple Choice", "True/False", "Short Answer"]),
  question: z.string(),
  options: z
    .array(z.string())
    .optional()
    .describe(
      "if questionType is Short Answer options would be empty, if it is True/False option would be [true,false] and if questionType is Multiple Choice put it different options",
    ),
  correctIndex: z
    .number()
    .describe(
      "it is index of correct anser in options in order to verify correct answe in the @options, Multiple Choice True/False most have correctIndex",
    ),
  answer: z
    .optional(z.string())
    .describe(
      "this would set onlt when questionType is Short Answer it is the correct answer Short Answer question",
    ),
});
export type questionSchemaType = z.infer<typeof questionSchema>;

export const promtpSchema = z.object({
  questionsTypes: z.array(
    z.enum(["Multiple Choice", "True/False", "Short Answer"]),
  ),
  questionsLength: z.enum(["10", "20", "30"]),
  topicAboutTheQuiz: z.string(),
});

export type promptSchemaType = z.infer<typeof promtpSchema>;
