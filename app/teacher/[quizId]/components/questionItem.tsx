import React, { useState } from "react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { questionSchemaType } from "@/schema/ai";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronsUpDown, Plus, RotateCw } from "lucide-react";
import { Indie_Flower } from "next/font/google";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
// replicate PartialObject from AI SDK
function QuestionItem({
  question,
}: {
  question: questionSchemaType | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [error, setError] = useState("");
  const addQuestion = useMutation(api.question.createQuestion);
  const { quizId } = useParams();

  if (!question) return null;

  const handleAddQuestion = (question: questionSchemaType) => {
    setIsLoading(true);
    if (question.questionType === "Short Answer") {
      addShortAnserQuestion(question);
      return;
    }
    if (question.questionType === "True/False") {
      addTrueFalse(question);
      return;
    }
    addMCQ(question);
  };

  const addShortAnserQuestion = (question: questionSchemaType) => {
    const questionId = addQuestion({
      question: question.question,
      questionType: "Short Answer",
      answer: question.answer,
      quizId: quizId as Id<"quizzes">,
    });
    toast.promise(questionId, {
      loading: "Loading....",
      success: () => {
        setIsLoading(false);
        setIsAdded(true);
        return "created successfuly";
      },
      error: (e) => {
        const errorMessage =
          e instanceof ConvexError ? e.data : "something went wrong";
        setError(errorMessage);
        return errorMessage;
      },
    });
  };
  const addTrueFalse = (question: questionSchemaType) => {
    const questionId = addQuestion({
      question: question.question,
      questionType: "True/False",
      quizId: quizId as Id<"quizzes">,
      correctAnswerIndex: question.correctIndex,
    });
    toast.promise(questionId, {
      loading: "Loading....",
      success: () => {
        setIsLoading(false);
        setIsAdded(true);
        return "created successfuly";
      },
      error: (e) => {
        const errorMessage =
          e instanceof ConvexError ? e.data : "something went wrong";
        setError(errorMessage);
        return errorMessage;
      },
    });
  };
  const addMCQ = (question: questionSchemaType) => {
    const questionId = addQuestion({
      question: question.question,
      questionType: "True/False",
      quizId: quizId as Id<"quizzes">,
      options: question.options,
      correctAnswerIndex: question.correctIndex,
    });
    toast.promise(questionId, {
      loading: "Loading....",
      success: () => {
        setIsLoading(false);
        setIsAdded(true);
        return "created successfuly";
      },
      error: (e) => {
        const errorMessage =
          e instanceof ConvexError ? e.data : "something went wrong";
        setError(errorMessage);
        return errorMessage;
      },
    });
  };
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Item variant="muted" className={`m-4 ${isAdded && "line-through"}`}>
        <ItemContent>
          <ItemTitle>{question.questionType}</ItemTitle>
          <ItemDescription>{question.question}</ItemDescription>
          <CollapsibleContent className="flex flex-col gap-2">
            <Answer
              answer={question.answer}
              questionType={question.questionType}
              options={question.options}
              correctAnserIndex={question.correctIndex}
            />
          </CollapsibleContent>
        </ItemContent>
        <div className="">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <ChevronsUpDown />
            </Button>
          </CollapsibleTrigger>
          <Button
            disabled={isLoading || isAdded}
            variant="outline"
            size="sm"
            onClick={() => handleAddQuestion(question)}
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                <Plus />
                ADD
              </>
            )}
          </Button>
        </div>
      </Item>
    </Collapsible>
  );
}

export default QuestionItem;

interface answerProp {
  answer: string | undefined;
  questionType: "Multiple Choice" | "True/False" | "Short Answer";
  options: string[] | undefined;
  correctAnserIndex: number | undefined;
}

const Answer = (prop: answerProp) => {
  if (
    prop.questionType === "Short Answer" &&
    prop.answer &&
    prop.answer.length > 0
  )
    return (
      <div className="ml-8 flex gap-2">
        <span className="text-green-600">answer:</span>
        <p>{prop.answer}</p>
      </div>
    );

  if (prop.correctAnserIndex === undefined || prop.options === undefined) {
    return (
      <p className="text-red-500">
        opps ai error {!prop.correctAnserIndex && "correct index"}{" "}
        {!prop.options && "options"} missing!
      </p>
    );
  }
  return (
    <div className="">
      {prop.options.map((option, index) => (
        <Options
          option={option}
          index={index}
          correctAnserIndex={prop.correctAnserIndex!}
          key={index}
        />
      ))}
    </div>
  );
};

const Options = ({
  option,
  index,
  correctAnserIndex,
}: {
  option: string;
  index: number;
  correctAnserIndex: number;
}) => {
  if (index === correctAnserIndex) {
    return (
      <Item variant="muted">
        <ItemTitle>
          <CheckCircle className="text-primary h-4 w-4" />
          {option}
        </ItemTitle>
      </Item>
    );
  }

  return (
    <Item>
      <ItemTitle>{option}</ItemTitle>
    </Item>
  );
};
