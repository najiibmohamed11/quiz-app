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
  const [uniqueColumns, setUniqueColumns] = useState<string[]>([]);
  const [pickedUniqueColumn, setPickedUniqueColumn] = useState<string|null>(null);

  // const [columns,setColumns]=useState<string[]|null>(null)
  const handleFormChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      cleanUpState()
      const file = e.target.files[0];

 
      const rowSheetData=await parseTable(file)
      const [columns, ...rows] = rowSheetData;
      const validateTableResult=validateTable(columns,rows);

      if(validateTableResult){
        setError(validateTableResult)
        return;
      }
  
      //holds every column and all his value as array of object and allows us to check uniqueness of column
      const allColumnsData: Record<string, any[]> = {};
      const arrangedRows = rows.map((row) => {
        const obj: Record<string, any> = {};
        columns.forEach((column, index) => {
          obj[column] = row[index];
          if (!allColumnsData[column]) {
            allColumnsData[column] = [];
          }
          //  console.log(uniqueNess)
          allColumnsData[column].push(row[index]);
        });
        return obj;
      });

      const extractedUniqueColumns=getUniqueColumns(columns,allColumnsData)
 
      setUniqueColumns(extractedUniqueColumns);
      if (extractedUniqueColumns.length===0) {
        setError("there is no unique column in this table please make sure double id or some thing like that in same column",);
        setImportedData(arrangedRows);
        return;
      }
      setPickedUniqueColumn(extractedUniqueColumns[0])

      setImportedData(arrangedRows);
      setError("");
    }
  };

  const getUniqueColumns=(columns:string[],allColumnsData:Record<string,any[]>)=>{
         let uniqueColumns:string[]=[];
      columns.forEach((column) => {
        const uniqueData = [...new Set(allColumnsData[column])];
        if (uniqueData.length === allColumnsData[column].length) {
          uniqueColumns.push(column)
        }
      });

      return uniqueColumns;
  }

  const validateTable=(columns:string[],rows:any[])=>{
        if (columns.length > 2) {     
        return `Table:maximum 2 column allowd you provided ${columns.length} (${columns.join(",")}) please profide 2 or less columns. e.g StudentId,StudentName`;      
      }
      if (rows.length > 100) {
        return  `we can't handle student more then 100.  you table contains ${rows.length}!`   
      }
      if (!rows || rows.length == 0 || !columns || columns.length === 0) {
        return`invalid table please profide structure table `
      }

      return null

  }

  const cleanUpState=()=>{
    setImportedData(null)
    setPickedUniqueColumn(null)
    setUniqueColumns([])
    setError("")
  }

  const parseTable=async(file:globalThis.File)=>{
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      return XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
        blankrows: false,
      }) as any[][];
  }
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
        {uniqueColumns.length > 1 && importedData && pickedUniqueColumn &&(
          <UniqueColumnDropDown defaultUniqueColumn={pickedUniqueColumn} setPickedUniqueColumn={setPickedUniqueColumn} unique={uniqueColumns} />
        )}
      </div>
      {error && <p className="text-red-700">{error}</p>}
      {(!error&&pickedUniqueColumn) && <p >students would use <span className="font-bold  bg-gray-200 px-2 mx-1 text-center rounded-md">{pickedUniqueColumn} </span>to enter the quiz</p>}
      {(importedData &&!error&&importedData.length>0) && <ImportedStudentsTable rows={importedData} />}
      {(importedData&&!error&&uniqueColumns.length>0)&&<Button><Lock/>Lock</Button>}
    </>
  );
};

export default ImportStudents;
