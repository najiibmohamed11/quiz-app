import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {  useQuery } from "convex/react";
import { Eye } from "lucide-react";
import { useParams } from "next/navigation";




function StudentPerformance() {
  const {roomId}=useParams()
  const questions=useQuery(api.question.getRoomeQuestions,{roomId:roomId as Id<"rooms">})

  if(!questions){
    return <h1 className="flex justify-center items-center">loading....</h1>
  }

  if(questions.length==0){
    return <h1 className="flex justify-center items-center">{"room doesn/'t have any question please add questions first"}</h1>
  }


  return (
    <Card>
      <CardHeader>
        <h1 className="font-medium">Student Performance</h1>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="p-20">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Score</TableHead>
              {questions.map((question) => {
                return (
                  <TableHead key={question._id}>
                    <div
                      className={`${question.questionType == "MCQ" ? "bg-blue-100 w-24 max-w-24" : question.questionType === "Short Answer" ? "bg-orange-100" : "bg-red-100 w-24 max-w-24"}   cursor-pointer  min-w-24 min-h-10  flex items-center justify-center rounded-sm flex-col mb-2`}
                    >
                      <div className="w-full truncate px-2 text-center">
                        {question.question}
                      </div>
                      <Eye size={12} />
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Abdinajib</TableCell>
              <TableCell>50%</TableCell>
              <TableCell>A</TableCell>
              <TableCell>B</TableCell>
              <TableCell>True</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default StudentPerformance;
