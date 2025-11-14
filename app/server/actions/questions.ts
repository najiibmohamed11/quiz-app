// "use server";

// import { generateObject, generateText, Output, streamObject } from "ai";
// import { google } from "@ai-sdk/google";
// import { ClerkDegraded } from "@clerk/nextjs";
// import z from "zod";
// import { promptSchemaType, questionSchema } from "@/app/schemas/ai";
// import { createStreamableValue } from "@ai-sdk/rsc";

// export const generateQuestions = async (prompt: promptSchemaType) => {

//   const systemPrompt = `
// generat quiz questions about ${prompt.topicAboutTheQuiz}  and make sure the questionsTypes are ${prompt.questionsTypes} which have length of ${prompt.questionsLength}
// `;

//   const streamableStatus = createStreamableValue('thread.init');

//   const {partialObjectStream } = await streamObject({
//     model: google("gemini-2.5-flash"),
//     output:"array",
//     schema:questionSchema,
//     prompt:systemPrompt
//   });
//   for await (const question of partialObjectStream ){
//     console.log(question)
//     streamableStatus.update(JSON.stringify(question))
//   }

//   return {status: streamableStatus.value}
//   // console.log(data)
// };

// function formDataToObject(formData: FormData) {
//   const obj: Record<string, any> = {};
//   for (const [key, value] of formData.entries()) {
//     try {
//       obj[key] = JSON.parse(value as string);
//     } catch {
//       obj[key] = value;
//     }
//   }
//   return obj;
// }
