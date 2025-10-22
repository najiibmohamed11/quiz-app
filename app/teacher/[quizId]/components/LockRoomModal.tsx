import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import React from "react";
import ImportStudents from "./ImportStudents";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const LockRoom = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Lock /> lock quiz
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Lock the quiz</DialogTitle>
          <DialogDescription>
            Restrict who can join the quiz by providing a unique column (maximum
            2 columns: name and unique column).
          </DialogDescription>
          <ImportStudents />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default LockRoom;
