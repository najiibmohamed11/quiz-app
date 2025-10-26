import React, { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { mcqSchema } from "@/schema/question";
import { ConvexError } from "convex/values";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

function McqQuestions() {
  //where allData Stored
  const [form, setForm] = useState<z.infer<typeof mcqSchema>>({
    question: "",
    options: ["", "", ""],
    correctAnswerIndex: undefined,
    questionType: "MCQ",
  });
  const createMcq = useMutation(api.question.createQuestion);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { quizId } = useParams();

  // Update question
  const handleQuestionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, question: e.target.value }));
  };

  // Update option
  const handleOptionChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) =>
        i === index ? e.target.value : opt,
      ),
    }));
  };

  // Add option
  const handleAddOption = () => {
    setForm((prev) => ({ ...prev, options: [...prev.options, ""] }));
  };

  // Remove option
  const handleRemoveOption = (index: number) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  // Select correct answer
  const handleCorrectAnswer = (index: number) => {
    setForm((prev) => ({ ...prev, correctAnswerIndex: index }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = mcqSchema.safeParse(form);
    if (!result.success) {
      setError(result.error?.issues[0].message);
      return;
    }
    setError("");
    setIsLoading(true);
    const questionId = createMcq({ ...form, quizId: quizId as Id<"quizzes"> });

    toast.promise(questionId, {
      loading: "Loading....",
      success: () => {
        setForm({
          question: "",
          correctAnswerIndex: undefined,
          options: ["", "", ""],
          questionType: "MCQ",
        });
        setIsLoading(false);
        return "created successfuly";
      },
      error: (e) => {
        setIsLoading(false);
        const errorMessage =
          e instanceof ConvexError ? e.data : "something went wrong";
        setError(errorMessage);
        return errorMessage;
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Textarea
        placeholder="Enter your question"
        value={form.question}
        onChange={handleQuestionChange}
      />

      <RadioGroup
        value={form.correctAnswerIndex?.toString() ?? ""}
        onValueChange={(val) => handleCorrectAnswer(Number(val))}
      >
        {form.options.map((option, index) => (
          <div key={index} className="flex items-center gap-3">
            <Label className="px-1">{String.fromCharCode(65 + index)}</Label>
            <RadioGroupItem value={index.toString()} />
            <Input
              placeholder={`Option ${String.fromCharCode(65 + index)}`}
              value={option}
              onChange={(e) => handleOptionChange(e, index)}
            />
            <Button
              disabled={form.options.length < 3}
              type="button"
              variant="ghost"
              onClick={() => handleRemoveOption(index)}
            >
              <X />
            </Button>
          </div>
        ))}
      </RadioGroup>

      <Button
        disabled={form.options.length >= 5}
        type="button"
        className="w-1/3"
        onClick={handleAddOption}
      >
        Add option
      </Button>
      <em className="text-center text-red-500">{error && error}</em>
      <Button disabled={isLoading} type="submit">
        {isLoading ? "Adding....." : "Add Question"}
      </Button>
    </form>
  );
}

export default McqQuestions;
