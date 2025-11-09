"use server";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export const generateQuestions = async (formData: FormData) => {
  console.log(formData);
  const SystemPromt = `
You are an AI quiz question generator.

You will receive a single input object with this format:
FormData {
  questionTypes: [ 'mcq', 'truefalse', 'shortanswer', ... ],
  questionLength: 'number of questions (e.g. 20)',
  prompt: 'topic or subject of the quiz (e.g. "give me js quiz")'
}

Follow these rules to generate the quiz:

1. Do not ask any questions to the user.
2. Use all the data provided in the FormData input.
3. Generate exactly the number of questions specified in "questionLength".
4. The questions should match the topic described in "prompt".
5. Only include question types that appear in the "questionTypes" array.
6. For "mcq" type: include one correct answer and 3 incorrect options.
7. For "truefalse" type: generate simple statements that are either true or false.
8. For "shortanswer" type: generate direct-answer conceptual questions.
9. Make sure all questions are clear, unambiguous, and grammatically correct.
10. Output the results in a structured JSON format:
    {
      topic: "...",
      totalQuestions: ...,
      questions: [
        { type: "...", question: "...", options: [...], answer: "..." },
        ...
      ]
    }
11. Do not include explanations just format of questions 

user request 
${formData}
`;

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: SystemPromt,
  });

  console.log(text);
};
