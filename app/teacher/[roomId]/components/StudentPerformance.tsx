import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Eye } from 'lucide-react'
import React, { useState } from 'react'



const data=[
  {
    name:"abdinajib",
    score:20,
    answers:{
      questionId:"xzswjcnk",
      usersAnswer:"false",
      isCorrect:"correct||not correct ||pending"//pendding when the question is short answer and need to check the teacher 

    }
  }
]

const Questions=[
  {
    "question": "JavaScript is ________.",
    "options": ["Static type", "Dynamic type", "Markup language"],
    "correctAnswer": ["Dynamic type"],
    "questionType": "MCQ"
  },
  {
    "question": "HTML stands for?",
    "options": ["HyperText Markup Language", "HighText Markdown Language", "Hyper Transfer Machine Language"],
    "correctAnswer": ["HyperText Markup Language"],
    "questionType": "MCQ"
  },
  {
    "question": "React is a ________.",
    "options": ["Database", "Frontend library", "Backend framework"],
    "correctAnswer": ["Frontend library"],
    "questionType": "MCQ"
  },
  {
    "question": "CSS is mainly used for?",
    "options": ["Data storage", "Styling web pages", "Server communication"],
    "correctAnswer": ["Styling web pages"],
    "questionType": "MCQ"
  },
  {
    "question": "TypeScript is a superset of JavaScript. (True/False)",
    "correctAnswer": ["True"],
    "questionType": "TRUE_FALSE"
  },
  {
    "question": "Node.js can run JavaScript outside the browser. (True/False)",
    "correctAnswer": ["True"],
    "questionType": "TRUE_FALSE"
  },
  {
    "question": "CSS Grid is used for layout design. (True/False)",
    "correctAnswer": ["True"],
    "questionType": "TRUE_FALSE"
  },
  {
    "question": "Java is the same as JavaScript. (True/False)",
    "correctAnswer": ["False"],
    "questionType": "TRUE_FALSE"
  },
  {
    "question": "What does API stand for?",
    "correctAnswer": ["Application Programming Interface"],
    "questionType": "SHORT_ANSWER"
  },
  {
    "question": "What is the default port of HTTP?",
    "correctAnswer": ["80"],
    "questionType": "SHORT_ANSWER"
  },
  {
    "question": "What does CSS stand for?",
    "correctAnswer": ["Cascading Style Sheets"],
    "questionType": "SHORT_ANSWER"
  },
  {
    "question": "Which HTML tag is used to define a paragraph?",
    "options": ["<p>", "<para>", "<paragraph>"],
    "correctAnswer": ["<p>"],
    "questionType": "MCQ"
  },
  {
    "question": "Which protocol is more secure: HTTP or HTTPS?",
    "options": ["HTTP", "HTTPS"],
    "correctAnswer": ["HTTPS"],
    "questionType": "MCQ"
  },
  {
    "question": "JSON is used for data exchange. (True/False)",
    "correctAnswer": ["True"],
    "questionType": "TRUE_FALSE"
  },
  {
    "question": "The DOM stands for Document Object Model. (True/False)",
    "correctAnswer": ["True"],
    "questionType": "TRUE_FALSE"
  },
  {
    "question": "What is the extension of a JavaScript file?",
    "correctAnswer": [".js"],
    "questionType": "SHORT_ANSWER"
  },
  {
    "question": "What is React primarily used for?",
    "correctAnswer": ["Building user interfaces"],
    "questionType": "SHORT_ANSWER"
  },
  {
    "question": "SQL is used to manage ________.",
    "options": ["Databases", "Stylesheets", "APIs"],
    "correctAnswer": ["Databases"],
    "questionType": "MCQ"
  },
  {
    "question": "Which of these is NOT a JavaScript framework?",
    "options": ["Angular", "Vue", "Django"],
    "correctAnswer": ["Django"],
    "questionType": "MCQ"
  },
  {
    "question": "HTML is used to structure content on the web. (True/False)",
    "correctAnswer": ["True"],
    "questionType": "TRUE_FALSE"
  }
]


function StudentPerformance() {
  const [questions,setQuestions]=useState([...Questions])
  return (
    <Card>
      <CardHeader>
        <h1 className='font-medium'>Student Performance</h1>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow >  
            <TableHead>
            Name
            </TableHead>
            <TableHead>
            Score
            </TableHead>
            {
              questions.map((question)=>{
                return(

            <TableHead>
              <div className={`${question.questionType=='MCQ'?'bg-blue-100 w-24 max-w-24':(question.questionType=='SHORT_ANSWER'?'bg-orange-100':'bg-red-100 w-24 max-w-24')}   cursor-pointer  min-w-24 min-h-10  flex items-center justify-center rounded-sm flex-col`}>
                <div className='w-full truncate px-2 text-center'>
                 {question.question}
                </div>
              <Eye size={12}/>
              </div>
            </TableHead>
                )
              })
            }

            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                Abdinajib
              </TableCell>
              <TableCell>
                50%
              </TableCell>
              <TableCell>
                A
              </TableCell>
              <TableCell>
                B
              </TableCell>
              <TableCell>
                True
              </TableCell>
            </TableRow>
          </TableBody>

        </Table>

      </CardContent>
    </Card>
  )
}

export default StudentPerformance