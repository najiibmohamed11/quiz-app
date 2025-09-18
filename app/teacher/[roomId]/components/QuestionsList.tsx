import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import React from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, Delete, DeleteIcon, Edit, Pen, Trash } from 'lucide-react'
import {  useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useParams } from 'next/navigation'
import {Id } from '@/convex/_generated/dataModel'
import { Skeleton } from '@/components/ui/skeleton'
function QuestionsList() {
  const {roomId} =useParams()
  const questions=useQuery(api.question.getRoomeQuestions,{roomId:roomId as Id<"rooms">})

  if(!questions){
     return (
      <div className="grid gap-4">
        {Array.from({ length: 6 }, (_, i) => i + 1).map((numb) => (
          <Skeleton
            key={numb}
            className="h-40 rounded-2xl  bg-gray-200"
          ></Skeleton>
        ))}
      </div>
    ); 
  }
  if(questions.length<=0){
    return <Card>
      <CardContent>
        <h1>no questions in this quiz</h1>
        <Button>add questions</Button>
      </CardContent>
    </Card>
  }
  return (
    <div className='flex flex-col gap-4 mb-4'>
      {
        questions.map((question,index)=>{
          return (
                <Card key={question._id} >
        <CardHeader className='flex justify-center '>
        <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
          {index+1}
        </Badge>
        <h1 className='font-semibold mx-5 flex-1'>{question.question}</h1>
        <div className='flex flex-col justify-center items-center'>
          <Badge variant="secondary">{question.questionType}</Badge>
          <div className='flex '>

        <Button variant="ghost"><Pen/></Button>
        <Button variant="ghost"><Trash/></Button>
          </div>
        </div>
        </CardHeader>
        <CardContent>
            {question.questionType!="Short Answer"?
          <div className='list-none ml-8  text-gray-700 flex flex-col '>
            {
              question.options?(question.options.map((option,optionIndex)=>{
                return(
                  question.correctAnswerIndex===optionIndex?  <span className='text-green-800 flex items-center gap-1 '> <CheckCircle className="h-4 w-4 text-green-600 " />{option}</span>:
                  <span className='ml-4'>{option}</span>
                )
              })):<div className='flex gap-2'>
                {
                    question.correctAnswerIndex===0? <>
                     <Button className='bg-green-600 flex items-center gap-1 hover:bg-green-600'> <CheckCircle className="h-4 w-4  " />True</Button>
                     <Button variant="outline" className=' px-5'> False</Button>
                    </>:
                  <>
                     <Button variant="outline" className=' px-8'> True</Button>
                     <Button className='bg-green-600 flex items-center gap-1 hover:bg-green-600'> <CheckCircle className="h-4 w-4  " />False</Button>
                    </>
                }
              </div>
         
            }
          </div>:<div>
            <div className='ml-8 flex gap-2'>
              <span className='text-green-600'>answer:</span>
              <p>{question.answer}</p>
            </div>
          </div> }
        </CardContent>
    </Card>
          )
        })
      }
    </div>
  )
}

export default QuestionsList




