import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { TrueFalseSchema } from "@/schema/question";
import { ConvexError } from "convex/values";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

function TrueFalse() {
  const [form, setForm] = useState<z.infer<typeof TrueFalseSchema>>({
    question: "",
    correctAnswerIndex: undefined,
    questionType: "True/False",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const createTrueFalseQuestion = useMutation(api.question.createQuestion);
  const { roomId } = useParams();

  const questionOnchange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prev) => {
      return {
        ...prev,
        question: e.target.value,
      };
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = TrueFalseSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    const creatingPromise = createTrueFalseQuestion({
      ...form,
      roomId: roomId as Id<"rooms">,
    });

    toast.promise(creatingPromise, {
      loading: "Loading....",
      success: () => {
        setForm({
          question: "",
          correctAnswerIndex: undefined,
          questionType: "True/False",
        });
        setIsLoading(false);
        return "created successfuly";
      },
      error: () => {
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
      <div className="grid gap-3">
        <RadioGroup
          value={form.correctAnswerIndex?.toString() ?? ""}
          onValueChange={(value) =>
            setForm((prev) => {
              return {
                ...prev,
                correctAnswerIndex: value == "0" ? 0 : 1,
              };
            })
          }
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value="0" className="border-black" />
            <Button type="button" variant="outline">
              True
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <RadioGroupItem value="1" className="border-black" />
            <Button type="button" variant="outline">
              False
            </Button>
          </div>
        </RadioGroup>
      </div>
      <em className="text-center text-red-500">{error && error}</em>

      <Button disabled={isLoading} type="submit">
        {isLoading ? "Adding....." : "Add Question"}
      </Button>
    </form>
  );
}

export default TrueFalse;
