import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { error } from "console";

export const creatStudent=mutation({
    args:{name:v.string(),roomId:v.string()},
    handler:async(ctx,args)=>{
        const roomId=ctx.db.normalizeId('rooms',args.roomId)
        if(!roomId)throw new ConvexError('this room is not valid')
        const studentId=await ctx.db.insert('students',{
            name:args.name,
            roomId:roomId,
            completedQuestions:0,
        })
        return studentId

    }
})


export const getStudent=query({
    args:{studentId:v.string(),roomId:v.string()},
    handler:async(ctx,args)=>{
        const id =ctx.db.normalizeId("students",args.studentId)
        if(!id)return null
        const studentInfo=await ctx.db.get(id)
        if(studentInfo?.roomId!=args.roomId)return null
        return studentInfo
    }
})


