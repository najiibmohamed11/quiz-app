import * as z from "zod";
 const baseSchema=z.object({
    question:z.string().min(1,'question is missing'),
    questionType:z.literal(['MCQ','True/False','Short Answer'])
})


export const mcqSchema=baseSchema.extend({
    options:z.array(z.string().min(1,'fill in or remove empty options')).min(2).max(5),
    correctAnswerIndex:z.number().int().nonnegative().optional(),
}).superRefine((data,ctx)=>{
  if(data.correctAnswerIndex===undefined){
    ctx.addIssue({
      code:"custom",
      message:"choose the correct answer",
      path:["correctAnswerIndex"]
    })
  }
})


export const TrueFalseSchema=baseSchema.extend({
    correctAnswerIndex:z.literal([0,1]).optional(),
}).superRefine((data,ctx)=>{
  if(data.correctAnswerIndex===undefined){
    ctx.addIssue({
       code:z.ZodIssueCode.custom,
       message:"choose the correct answer",
       path:["correctAnswerIndex"]
    })
  }
})

export const shortAnswerSchema = baseSchema.extend({
  answer: z.string()
});


export const questionSchema=typeof z.union([
    mcqSchema,
    TrueFalseSchema,
    shortAnswerSchema
])