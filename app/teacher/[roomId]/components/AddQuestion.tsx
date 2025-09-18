import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { RadioGroup } from '@radix-ui/react-radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ClosedCaption, X } from 'lucide-react'
import React, { useState } from 'react'
import { PreviousMonthButton } from 'react-day-picker'
import McqQuestions from './McqQuestions'
import TrueFalse from './TrueFalse'
import ShortAnswer from './ShortAnswer'
import { Toaster } from 'sonner'

export type trueFalse = {
  question: string;
  correctAnswerIndex:null|String
};

type questionType="MCQ"|"True/False"|"shortAnswer"

function AddQuestion() {

    const [questionType,setQuestionType]=useState<questionType>("MCQ")



  return (
    <Dialog>
          <Toaster position="top-center" />

        <DialogTrigger asChild>
            <Button>add question</Button>
        </DialogTrigger>

        <DialogContent className=''>
            <DialogHeader >
               <DialogTitle>
                add question
                </DialogTitle> 
                </DialogHeader>
          <Tabs defaultValue={questionType} onValueChange={(value)=>setQuestionType(value as questionType)}>
            <TabsList>
              <TabsTrigger value='MCQ'>
                Multiable Choice
              </TabsTrigger>
              <TabsTrigger value='True/False'>
                True/False
              </TabsTrigger>
              <TabsTrigger value='shortAnswer'>
                Short Answer
              </TabsTrigger>
            </TabsList>
              <TabsContent value='MCQ' className='mt-4'>
                <McqQuestions />
              </TabsContent>
              <TabsContent value='True/False' className='mt-4'>
              <TrueFalse  />
              </TabsContent>
              <TabsContent value='shortAnswer' className='mt-4'>
              <ShortAnswer />
              </TabsContent>
          </Tabs>
        </DialogContent>

        </Dialog>
  )
}

export default AddQuestion