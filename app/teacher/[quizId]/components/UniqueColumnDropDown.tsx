import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown } from "lucide-react";
import React from "react";

export const UniqueColumnDropDown = ({
  unique,
  defaultUniqueColumn,
  setPickedUniqueColumn,
}: {
  unique: string[];
  defaultUniqueColumn: string;
  setPickedUniqueColumn: (uniqueColumn: string) => void;
}) => {
  if (unique.length === 0) {
    return <p>no unique column is in your table</p>;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {defaultUniqueColumn} <ArrowDown />
        </Button>
      </DropdownMenuTrigger>
      {unique.length > 1 && (
        <DropdownMenuContent align="end" className="">
          {unique.map((column, index) => (
            <DropdownMenuItem
              key={index}
              className=""
              onClick={() => setPickedUniqueColumn(column)}
            >
              {column}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};
