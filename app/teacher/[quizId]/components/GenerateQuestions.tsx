import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUpIcon, Sparkles } from "lucide-react";
import React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
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
import { generateQuestions } from "@/app/server/actions/questions";

function GenerateQuestions() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Questions
        </Button>
      </DialogTrigger>

      <DialogContent className="space-y-5">
        <DialogHeader>
          <DialogTitle>Generate Question</DialogTitle>
        </DialogHeader>

        {/* --- Question Types (Multi-select checkboxes) --- */}
        <form action={generateQuestions}>
          <div className="space-y-2">
            <Label>Question Types</Label>
            <div className="flex flex-col gap-2 pl-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="mcq" name="questionTypes" value="mcq" />
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
                  value="truefalse"
                />
                <label
                  htmlFor="truefalse"
                  className="text-sm leading-none font-medium"
                >
                  True / False
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="short" name="questionTypes" value="short" />
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
            <Select name="questionLength">
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
            />
            <InputGroupAddon align="block-end" className="flex justify-end">
              <InputGroupButton
                variant="default"
                className="rounded-full"
                size="icon-xs"
                type="submit"
              >
                <ArrowUpIcon />
                <span className="sr-only">Send</span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default GenerateQuestions;
