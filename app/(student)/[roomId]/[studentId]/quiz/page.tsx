'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
function page() {
    const {roomId,studentId}=useParams<{ roomId: string; studentId: string }>()
    const [currentQuestionIndex,setCurrentQuestionIndex]=useState(0)

    const studentInfo=useQuery(api.student.getStudent,{studentId,roomId })
    const questions=useQuery(api.question.getStudentsQuestions,{roomId})

    if(studentInfo===undefined||!questions){
        return <div className='flex justify-center items-center min-h-screen'>
           loading for student info....
        </div>
    }
    if(studentInfo===null||questions===null){
        return <div className='flex flex-col justify-center items-center min-h-screen gap-5'>
            <h1>opps something went wrong in url please </h1>
            <Link href={`/findroom`}>
            <Button>go back</Button>
            </Link>
        </div>
    }


    if(questions.length==0){
        return <div className='flex justify-center items-center'>there is no question in this room</div>
    }
    console.log(questions)

    const handleNext=()=>{
        if(questions.length-1==currentQuestionIndex){
            return;
        }
        setCurrentQuestionIndex((prev)=>prev+1);
    }

  return (
    <div className='flex justify-center items-center min-h-screen'>
        <Card className='w-2xl '>
            <CardHeader>
                <Badge>question {currentQuestionIndex+1}/{questions.length}</Badge>
            </CardHeader>
            <CardContent className=''>
                <h1 className='text-xl font-bold'>{questions[currentQuestionIndex].question}</h1>
               {questions[currentQuestionIndex].questionType!="Short Answer"?
                               <div className='flex justify-center flex-col items-center gap-4 mt-6'>
                                {
                                questions[currentQuestionIndex].options?
                                questions[currentQuestionIndex].options.map((option)=> <Button variant="outline" className={`w-full h-14  flex justify-start `}>{option}</Button>

                                ): <>
                                 <Button variant="outline" className={`w-full h-14  flex justify-start `}>True</Button>
                                 <Button variant="outline" className={`w-full h-14  flex justify-start `}>False</Button>
                                </>

                                }
                               </div>: <div>
                                <Textarea placeholder='write the answer her'/>
                               </div>
            
            }
            </CardContent>
            <CardFooter className='flex justify-end'>
                <Button onClick={handleNext}>Submit</Button>
            </CardFooter>
        </Card>
    </div>
  )
}

export default page