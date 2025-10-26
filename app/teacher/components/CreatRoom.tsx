"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DurationPicker } from "@/components/ui/duration-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { useRouter } from "next/navigation";

import { useState } from "react";
export default function CreateQuiz() {
  const [name, setName] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);
  const [isloading, setIsloading] = useState(false);
  const [error, setErorr] = useState("");
  const mutateSomething = useMutation(api.quiz.creatQuiz);
  const navigater = useRouter();

  async function handleCreat() {
    if (!name) {
      setErorr("please enter your name");
      return;
    }
    try {
      console.log(duration);
      setIsloading(true);
      const id = await mutateSomething({
        name: name,
        duration: duration,
      });
      if (!id) {
        return;
      }
      navigater.push(`teacher/${id}`);
    } catch (e) {
      const errorMessage =
        e instanceof ConvexError ? e.data : "some thing went wrong";
      setErorr(errorMessage);
    } finally {
      setIsloading(false);
    }
  }
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="cursor-pointer bg-[#255026] hover:bg-[#255026] dark:bg-[#A5D6A7] dark:text-black">
            Creat Quiz
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="cursor-pointer dark:text-[#A5D6A7]">
              Creare Quiz
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Quiz Name</Label>
              <Input
                id="name-1"
                name="name"
                defaultValue=""
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Duration</Label>
              <DialogDescription>Duration is optional</DialogDescription>
              <DurationPicker value={duration} onChange={setDuration} />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={isloading}
              type="submit"
              onClick={handleCreat}
              className="cursor-pointer bg-[#255026] hover:bg-[#255026] dark:bg-[#A5D6A7] dark:text-black"
            >
              {isloading ? "creating...." : "Create"}
            </Button>
          </DialogFooter>
          <div className="text-center text-red-500">{error}</div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
