
'use client'

import * as SignIn from "@clerk/elements/sign-in";
import * as Clerk from "@clerk/elements/common"
import { Button } from "@/components/ui/button";
import Image from "next/image";
export default function SignInPagw(){
    return (
      <SignIn.Root>
        <SignIn.Step name="start">
            <Clerk.Connection name="google">
                <div className="flex  min-w-screen justify-center  items-center min-h-screen">
                   <Clerk.Loading scope="provider:google">{(isLoading)=>{
                    return isLoading?                    <Button  variant='outline' disabled={isLoading} className="w-2xs cursor-pointer"><Image alt="Google Logo" src='./googl-logo.svg' width={20} height={20}/>Signing in.....</Button>:
                           <Button  variant='outline' className="w-2xs cursor-pointer"><Image alt="Google Logo" src='./googl-logo.svg' width={20} height={20}/>Continue with Google</Button> }}</Clerk.Loading>
                    
                </div>
            </Clerk.Connection>
        </SignIn.Step>
    </SignIn.Root>
    )
}

