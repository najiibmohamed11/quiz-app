import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'

type TimerProp={
  expiresAt:number|undefined
  roomStatus:"active"|"pause"
  remainingTime:number|undefined
}


function Timer({expiresAt,roomStatus,remainingTime}:TimerProp) {
  const [timer, setTimer] = useState(()=>expiresAt?Math.max(0,expiresAt-Date.now()):remainingTime??0);

  useEffect(()=>{
    console.log("in db",remainingTime)
    console.log("in actual one drived from expire",timer)
    if(!expiresAt||roomStatus==="pause"){
      setTimer(remainingTime ?? 0)
      return
    }
    

   const id= setInterval(() => {
    const now =Date.now();
    const RemainingTime=Math.max(0,expiresAt-now)
     setTimer(RemainingTime)
     if(RemainingTime===0){
      clearInterval(id);
     }
    }, 1000);
    return ()=> clearInterval(id)
  },[roomStatus,expiresAt,remainingTime])

  const formatTime=(remainingTimeInMilliseconds:number)=>{
    const remainingTimeInSeconds=Math.floor(remainingTimeInMilliseconds/1000);
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