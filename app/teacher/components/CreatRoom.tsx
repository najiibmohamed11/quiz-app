import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { useRouter } from "next/navigation";

import { useState } from "react";
type durstion = {
  hour: number;
  minute: number;
};
export default function CreateRoom() {
  const [name, setName] = useState<string>("");
  const [duration, setDuration] = useState<durstion>({
    hour: 0,
    minute: 0,
  });
  const [isloading, setIsloading] = useState(false);
  const [error, setErorr] = useState("");
  const mutateSomething = useMutation(api.room.creatRoom);
  const router = useRouter();

  async function handleCreat() {
    if (!name) {
      return;
    }
    if (!duration) {
      return;
    }
    try {
      setIsloading(true);
      const id = await mutateSomething({ name: name, duration: duration });
      if (!id) {
        return;
      }
      router.push(`teacher/${id}`);
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
          <Button className="cursor-pointer">Creat Room</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Creare Room</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Room Name</Label>
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
              <div className="flex  gap-2">
                <Input
                  type="number"
                  id="time-picker"
                  defaultValue="00"
                  className="w-16"
                  min="0"
                  max="12"
                  onChange={(e) =>
                    setDuration({
                      minute: duration?.minute ?? 0,
                      hour: Number(e.target.value),
                    })
                  }
                />
                <div className="text-2xl">:</div>
                <Input
                  type="number"
                  id="time-picker"
                  min="0"
                  max="60"
                  defaultValue="00"
                  className="w-16"
                  onChange={(e) =>
                    setDuration({
                      hour: duration?.hour ?? 0,
                      minute: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={isloading}
              type="submit"
              onClick={handleCreat}
              className="cursor-pointer"
            >
              {isloading ? "creating...." : "Create"}
            </Button>
          </DialogFooter>
          <div className="text-red-500 text-center">{error}</div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
