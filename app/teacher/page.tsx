
'use client'
import { Button } from "@/components/ui/button";

import Link from "next/link";
import CreateRoom from "./components/CreatRoom";

export default function Teacher() {
  return (
    <div>
      <header className="flex  justify-around mt-4  ">
        <h1>A</h1>
        <CreateRoom />
      </header>
    </div>
  );
}
