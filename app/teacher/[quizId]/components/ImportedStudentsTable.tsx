import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

const ImportedStudentsTable = ({
  rows,
}: {
  rows: Record<string, string>[];
}) => {
  if (!rows || rows.length === 0) return null;
  const columns = Object.keys(rows[0]);
  return (
    <ScrollArea className="h-96">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => {
            return (
              <TableRow key={rowIndex}>
                {columns.map((column, columnIndex) => {
                  return (
                    <TableCell key={columnIndex}>
                      {row[column] || ".........."}
                    </TableCell>
                  );
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
