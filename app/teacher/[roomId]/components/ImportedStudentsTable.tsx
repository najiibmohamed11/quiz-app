import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

const ImportedStudentsTable = ({ rows }: { rows: Record<string, any>[] }) => {
  if (!rows) return null;
  const columns = Object.keys(rows[0]);
  return (
    <ScrollArea className="h-96">
      <Table className="h-96 overflow-auto max-h-50">
        
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            return (
              <TableRow>
                {columns.map((column) => {
                  return <TableCell>{row[column] || ".........."}</TableCell>;
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default ImportedStudentsTable;
