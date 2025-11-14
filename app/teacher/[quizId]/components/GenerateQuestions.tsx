import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUpIcon, RotateCw, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { questionSchema, questionSchemaType } from "@/schema/ai";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import z from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import QuestionItem from "./questionItem";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Spinner } from "@/components/ui/spinner";
import { Toaster } from "sonner";

type questionType = "True/False" | "Multiple Choice" | "Short Answer";

function GenerateQuestions() {
  const {
    object: questions,
    isLoading,
    error,
    clear,
    submit,
  } = useObject({
    api: "/api/generateQuestions",
    schema: z.array(questionSchema),
  });

  const [questionsTypes, setQuestionsTypes] = useState<questionType[]>([
    "Multiple Choice",
  ]);
  const [questionsLength, setQuestionsLength] = useState("10");
  const [topicAboutTheQuiz, setTopicAboutTheQuiz] = useState("");
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!questions || !lastElementRef.current) return;
    lastElementRef.current.scrollIntoView({ behavior: "smooth" });
  }, [questions]);

  const handleCheckChange = (
    state: CheckedState,
    questionType: questionType,
  ) => {
    if (state) {
      setQuestionsTypes((prev) => [...prev, questionType]);
      return;
    }
    const filtredQuestionTypes = questionsTypes.filter(
      (type) => type !== questionType,
    );
    setQuestionsTypes(filtredQuestionTypes);
  };

  const clearQuestions = () => {
    setQuestionsTypes(["Multiple Choice"]);
    setQuestionsLength("10");
    setTopicAboutTheQuiz("");
    clear();
  };

  return (
    <Dialog>
      <Toaster position="top-center" />

      <DialogTrigger asChild>
        <Button>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Questions
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] min-w-2xl space-y-5">
        <DialogHeader>
          <DialogTitle>Generate Question</DialogTitle>
        </DialogHeader>

        {!questions ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!prompt) return;
              await submit({
                questionsLength,
                questionsTypes,
                topicAboutTheQuiz,
              });
            }}
          >
            <div className="space-y-2">
              <Label>Question Types</Label>
              <div className="flex flex-col gap-2 pl-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mcq"
                    name="questionTypes"
                    value="Multiple Choice"
                    onCheckedChange={(e) =>
                      handleCheckChange(e, "Multiple Choice")
                    }
                    checked={questionsTypes.includes("Multiple Choice")}
                  />
                  <label
                    htmlFor="mcq"
                    className="text-sm leading-none font-medium"
                  >
                    Multiple Choice
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="truefalse"
                    name="questionTypes"
                    value="True/False"
                    checked={questionsTypes.includes("True/False")}
                    onCheckedChange={(e) => handleCheckChange(e, "True/False")}
                  />
                  <label
                    htmlFor="truefalse"
                    className="text-sm leading-none font-medium"
                  >
                    True / False
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="short"
                    name="questionTypes"
                    value="short"
                    checked={questionsTypes.includes("Short Answer")}
                    onCheckedChange={(e) =>
                      handleCheckChange(e, "Short Answer")
                    }
                  />
                  <label
                    htmlFor="short"
                    className="text-sm leading-none font-medium"
                  >
                    Short Answer
                  </label>
                </div>
              </div>
            </div>

            {/* --- Question Length --- */}
            <div className="space-y-2">
              <Label>Number of Questions</Label>
              <Select
                name="questionLength"
                onValueChange={(value) => setQuestionsLength(value)}
                defaultValue={questionsLength}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 Questions</SelectItem>
                  <SelectItem value="20">20 Questions</SelectItem>
                  <SelectItem value="30">30 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* --- Input Area --- */}
            <InputGroup>
              <InputGroupTextarea
                placeholder="Ask, Search or Chat..."
                name="prompt"
                onChange={(e) => setTopicAboutTheQuiz(e.target.value)}
              />
              <InputGroupAddon align="block-end" className="flex justify-end">
                <InputGroupButton
                  variant="default"
                  className="rounded-full"
                  size="icon-xs"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner /> : <ArrowUpIcon />}
                  <span className="sr-only">Send</span>
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>
        ) : (
          <>
            <ScrollArea className="max-h-96 border">
              {questions?.map((question, index) => {
                if (!question)
                  return (
                    <p key={index}>
                      {" "}
                      <Button variant="ghost" onClick={clearQuestions}>
                        <RotateCw />{" "}
                      </Button>{" "}
                      something whent wrong
                    </p>
                  );
                if (
                  question.questionType !== "Short Answer" &&
                  (question.correctIndex === undefined ||
                    question.options === undefined)
                ) {
                  if (index >= 1) return null;
                  return (
                    <p key={index} className="text-red-500">
                      {" "}
                      <Button variant="ghost" onClick={clearQuestions}>
                        <RotateCw />{" "}
                      </Button>{" "}
                      opps ai error {!question.correctIndex && "correct index"}{" "}
                      {!question.options && "options"} missing!
                    </p>
                  );
                }
                return (
                  <QuestionItem
                    question={question as questionSchemaType}
                    key={index}
                  />
                );
              })}
              <div ref={lastElementRef}></div>
            </ScrollArea>
            <div className="flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={clearQuestions}>
                <RotateCw />{" "}
              </Button>
              <Button>add all </Button>
            </div>
          </>
        )}
        {error && <div>{error.message}</div>}
      </DialogContent>
    </Dialog>
  );
}

export default GenerateQuestions;
