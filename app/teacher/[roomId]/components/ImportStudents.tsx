import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Sheet } from "lucide-react";
import React, { ChangeEvent, useRef, useState } from "react";
import * as XLSX from "xlsx";
import ImportedStudentsTable from "./ImportedStudentsTable";
import { UniqueColumnDropDown } from "./UniqueColumnDropDown";

const ImportStudents = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importedData, setImportedData] = useState<
    Record<string, any>[] | null
  >(null);
  const [error, setError] = useState("");
  const [uniqueColumns, setuniqueColumns] = useState<string[]>([]);
  const [PickedUniqueColumn, setPickedUniqueColumn] = useState<string|null>(null);

  // const [columns,setColumns]=useState<string[]|null>(null)
  const handleFormChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const data = await file.arrayBuffer();
      const studentsTable = XLSX.read(data, { type: "array" });

      // Get first sheet
      const sheetName = studentsTable.SheetNames[0];
      const sheet = studentsTable.Sheets[sheetName];
      const rowsData = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
        blankrows: false,
      }) as [][];

      const [columns, ...rows] = rowsData;
      if (columns.length > 2) {
        setError(
          `Table you provided is more then 2 columns (${columns}) please profide 2 or less columns. e.g StudentId,StudentName`,
        );
        return;
      }
      if (rows.length > 100) {
        setError(
          `we can handle student more then 100  you table contains ${rows.length}`,
        );
        return;
      }
      if (!rows || rows.length == 0 || !columns || columns.length === 0) {
        setError(`invalid table please profide structure table `);
        return;
      }
      const uniqueNess: Record<string, []> = {};
      setuniqueColumns([]);
      const arrangedRows = rows.map((row) => {
        const obj: Record<string, any> = {};

        columns.map((column, index) => {
          obj[column] = row[index];
          if (!uniqueNess[column]) {
            uniqueNess[column] = [];
          }
          //  console.log(uniqueNess)
          uniqueNess[column].push(row[index]);
        });
        return obj;
      });
      let uniqueColumns:string[]=[];
      columns.forEach((column) => {
        const uniquesData = [...new Set(Object.values(uniqueNess[column]))];
        if (uniquesData.length === uniqueNess[column].length) {
          setuniqueColumns((prev) => [...prev, column]);
          uniqueColumns.push(column)
        }
      });
      if (uniqueColumns.length===0) {
        setError("there is no unique column in this table please make sure double id or some thing like that in same column",);
        setImportedData(arrangedRows);
        return;
      }
      setPickedUniqueColumn(uniqueColumns[0])

      setImportedData(arrangedRows);
      setError("");
    }
  };
  const handleFileImport = () => {
    if (!fileInputRef.current) {
      return;
    }
    fileInputRef.current.click();
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
          className="bg-green-600 hover:bg-green-700 w-90 hidden"
        />
        <Button
          className="bg-green-700 hover:bg-green-700"
          onClick={handleFileImport}
        >
          <Sheet /> import students list
        </Button>
        {uniqueColumns.length > 0 && importedData && PickedUniqueColumn &&(
          <UniqueColumnDropDown defaultUniqueColumn={PickedUniqueColumn} setPickedUniqueColumn={setPickedUniqueColumn} unique={uniqueColumns} />
        )}
      </div>
      {error && <p className="text-red-700">{error}</p>}
      {importedData && <ImportedStudentsTable rows={importedData} />}
      {(importedData&&!error&&uniqueColumns.length>0)&&<Button><Lock/>Lock</Button>}
    </>
  );
};

export default ImportStudents;
