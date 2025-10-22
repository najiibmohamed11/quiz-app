import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Sheet } from "lucide-react";
import React, { ChangeEvent, useRef, useState } from "react";
import * as XLSX from "xlsx";
import ImportedStudentsTable from "./ImportedStudentsTable";
import { UniqueColumnDropDown } from "./UniqueColumnDropDown";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";

const ImportStudents = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importedData, setImportedData] = useState<
    Record<string, string>[] | null
  >(null);
  const [error, setError] = useState("");
  const [uniqueColumns, setUniqueColumns] = useState<string[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [pickedUniqueColumn, setPickedUniqueColumn] = useState<string | null>(
    null,
  );
  const lockQuiz = useMutation(api.quiz.lockRoom);
  const { quizId } = useParams();

  // const [columns,setColumns]=useState<string[]|null>(null)
  const handleFormChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      cleanUpState();
      const file = e.target.files[0];

      const rowSheetData = await parseTable(file);
      const [columns, ...rows] = rowSheetData;
      const validateTableResult = validateTable(columns, rows);

      if (validateTableResult) {
        setError(validateTableResult);
        return;
      }

      //holds every column and all his value as array of object and allows us to check uniqueness of column
      const allColumnsData: Record<string, string[]> = {};
      const arrangedRows = rows.map((row) => {
        const obj: Record<string, string> = {};
        columns.forEach((column, index) => {
          obj[column] = row[index].toLowerCase().trim();
          if (!allColumnsData[column]) {
            allColumnsData[column] = [];
          }
          //  console.log(uniqueNess)
          allColumnsData[column].push(row[index].toLowerCase().trim());
        });
        return obj;
      });

      const extractedUniqueColumns = getUniqueColumns(columns, allColumnsData);

      setUniqueColumns(extractedUniqueColumns);
      if (extractedUniqueColumns.length === 0) {
        setError(
          "there is no unique column in this table please make sure double id or some thing like that in same column",
        );
        setImportedData(arrangedRows);
        return;
      }
      setImportedData(arrangedRows);
      setColumns(columns);
      setPickedUniqueColumn(extractedUniqueColumns[0]);

      setError("");
    }
  };

  const getUniqueColumns = (
    columns: string[],
    allColumnsData: Record<string, string[]>,
  ) => {
    const uniqueColumns: string[] = [];
    columns.forEach((column) => {
      const uniqueData = [...new Set(allColumnsData[column])];
      if (uniqueData.length === allColumnsData[column].length) {
        uniqueColumns.push(column);
      }
    });

    return uniqueColumns;
  };

  const validateTable = (columns: string[], rows: string[][]) => {
    if ([...new Set(columns)].length !== columns.length) {
      return "you have duplicate column names ";
    }
    if (columns.length > 2) {
      return `Table:maximum 2 columns allowd you provided ${columns.length} (${columns.join(",")}) please provide 2 or less columns. e.g StudentId,StudentName`;
    }
    if (rows.length > 100) {
      return `we can't handle student more than 100.  you table contains ${rows.length}!`;
    }
    if (!rows || rows.length == 0 || !columns || columns.length === 0) {
      return `invalid Table. Please provide a properly structrued Table `;
    }

    if (columns.some((column) => column.trim() === "")) {
      return `column name can't be blank `;
    }

    return null;
  };

  const cleanUpState = () => {
    setImportedData(null);
    setPickedUniqueColumn(null);
    setUniqueColumns([]);
    setError("");
    setColumns([]);
  };

  const parseTable = async (file: globalThis.File) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
      blankrows: false,
    }) as unknown[][];
    return rows.map((row) => row.map((cell) => String(cell ?? "")));
  };
  const handleFileImport = () => {
    if (!fileInputRef.current) {
      return;
    }
    fileInputRef.current.click();
  };

  const handleLock = async () => {
    if (
      !importedData ||
      importedData?.length === 0 ||
      !pickedUniqueColumn ||
      columns.length === 0
    ) {
      console.log("some thing went wrong");
      return;
    }
    try {
      await lockQuiz({
        students: importedData,
        columns: columns,
        quizId: quizId as string,
        uniqueColumnForSearch: pickedUniqueColumn,
      });
    } catch (e) {
      setError("some thing went wrong during locking..");
      console.log(e);
    }
  };

  return (
    <>
      <div
        className={`flex ${!importedData ? "justify-center" : "justify-between"} mt-3`}
      >
        <Input
          ref={fileInputRef}
          id="restrict"
          onChange={handleFormChange}
          type="file"
          placeholder="najiib"
          accept=".xlsx,.xls"
          className="hidden w-90"
        />
        <Button className="" onClick={handleFileImport}>
          <Sheet /> import students list
        </Button>
        {uniqueColumns.length > 1 && importedData && pickedUniqueColumn && (
          <UniqueColumnDropDown
            defaultUniqueColumn={pickedUniqueColumn}
            setPickedUniqueColumn={setPickedUniqueColumn}
            unique={uniqueColumns}
          />
        )}
      </div>
      {error && <p className="text-red-700">{error}</p>}
      {importedData &&
        !error &&
        importedData.length > 0 &&
        uniqueColumns.length > 0 &&
        pickedUniqueColumn && (
          <>
            <p>
              students would use{" "}
              <span className="bg-primary text-background mx-1 rounded-md px-2 text-center font-bold">
                {pickedUniqueColumn}{" "}
              </span>
              to enter the quiz
            </p>
            <ImportedStudentsTable rows={importedData} />
            <Button onClick={handleLock}>
              <Lock />
              Lock
            </Button>
          </>
        )}
    </>
  );
};

export default ImportStudents;
