import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "convex/react";
import { AlertCircle } from "lucide-react";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { shortAnswerSchema } from "@/schema/question";
import { ConvexError } from "convex/values";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";

function ShortAnswer() {
  const [form, setForm] = useState<z.infer<typeof shortAnswerSchema>>({
    question: "",
    answer: "",
    questionType: "Short Answer",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { roomId } = useParams();

  const createShortAnswerQuestion = useMutation(api.question.createQuestion);

  const questionOnchange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, question: e.target.value }));
  };
  const answerOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, answer: e.target.value }));
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = shortAnswerSchema.safeParse(form);
    if (!result.success) {
      console.log(result);
      setError(result.error.issues[0].message);
      return;
    }

    setError("");

    const creatingPromise = createShortAnswerQuestion({
      ...form,
      roomId: roomId as Id<"rooms">,
    });

    toast.promise(creatingPromise, {
      loading: "Loading....",
      success: () => {
        setForm({ question: "", questionType: "Short Answer", answer: "" });
        setIsLoading(false);
        return "created successfuly";
      },
      error: (e) => {
        setIsLoading(false);
        const errorMessage =
          e instanceof ConvexError ? e.data : "something went wrong";
        setError(errorMessage);
        return "Error";
      },
    });
  };
  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Textarea
        value={form.question}
        placeholder="enter her question that you want "
        onChange={questionOnchange}
      />
      <div className="flex justify-center items-center gap-4">
        <Label htmlFor="answer">Answer</Label>
        <Input
          value={form.answer}
          onChange={answerOnchange}
          id="answer"
          placeholder="answer(optional)"
        />
      </div>

      <Alert className="border-yellow-500 text-yellow-700 bg-yellow-50">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Short answer questions can be tricky to grade automatically. 👉
          Teachers will be able to review and correct these answers
          manually.{" "}
        </AlertDescription>
      </Alert>
      <em className="text-red-500">{error && error}</em>
      <Button disabled={isLoading} type="submit">
        {isLoading ? "Adding....." : "Add Question"}
      </Button>
    </form>
  );
}

export default ShortAnswer;
