import { promptSchemaType, questionSchema } from "@/schema/ai";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
const maxduration = 30;
export async function POST(req: Request) {
  const prompt = (await req.json()) as promptSchemaType;
  const systemPrompt = `generat quiz questions about ${prompt.topicAboutTheQuiz}  and make sure the questionsTypes are ${prompt.questionsTypes} which have length of ${prompt.questionsLength}`;
  const result = streamObject({
    model: google("gemini-2.5-pro"),
    output: "array",
    schema: questionSchema,
    prompt: systemPrompt,
  });
  // This triggers the actual AI call (and can throw)
  return result.toTextStreamResponse();
}
