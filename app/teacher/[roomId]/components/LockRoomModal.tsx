import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'
import React from 'react'
import ImportStudents from './ImportStudents'
import { Dialog, DialogContent,  DialogHeader,  DialogTrigger } from '@/components/ui/dialog'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'

const LockRoom = () => {
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button><Lock/> lock room</Button>
        </DialogTrigger >
        <DialogContent >
            <DialogHeader>
                <DialogTitle className='font-bold text-xl '>Lock the room</DialogTitle>
                <DialogDescription>restrict who can join quiz by providing unique column(not more then 2 columns name and unique column) </DialogDescription>
            <ImportStudents/>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}

export default LockRoom