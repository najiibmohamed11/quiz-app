import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'

type TimerProp={
  expiresAt:number|undefined
  roomStatus:"active"|"pause"
  remainingTime:number|undefined
}


function Timer({expiresAt,roomStatus,remainingTime}:TimerProp) {
  const [timer, setTimer] = useState(0);

  useEffect(()=>{
    if(!expiresAt||roomStatus==="pause"){
      setTimer(remainingTime??0)
      return
    }
    if(!timer){
      const now=Date.now()
      const remainingTime=Math.max(0,expiresAt-now)
      setTimer(remainingTime)
    }

   const id= setInterval(() => {
     setTimer((prev)=>{
        if(prev===0){
          clearInterval(id)
        }
        return Math.max(0,prev-1000)
      })
    }, 1000);
    return ()=> clearInterval(id)
  },[roomStatus])

  const formatTime=(remainingTimeInMilliseconds:number)=>{
    const remainingTimeInSeconds=Math.round(remainingTimeInMilliseconds/1000);
    const hours=Math.floor(remainingTimeInSeconds/3600);
    const minutes=Math.floor((remainingTimeInSeconds%3600)/60);
    const second =Math.floor(remainingTimeInSeconds%60)  
    return `${hours.toString().padStart(2,'0')} : ${minutes.toString().padStart(2,'0')} : ${second.toString().padStart(2,'0')}`
  }

  return (
      <Button variant="outline" className="w-60 mr-9">{formatTime(timer)}</Button>
  )
}

export default Timer