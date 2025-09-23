import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const createQuestion=mutation({
    args:{questionType:v.union(
        v.literal("MCQ"),
        v.literal("True/False"),
        v.literal("Short Answer")
    ),
    question:v.string(),
    options:v.optional(v.array(v.string())),
    correctAnswerIndex:v.optional(v.number()),
    answer:v.optional(v.string()),
    roomId:v.id("rooms")
},
    handler:async(ctx,arg)=>{
        //common checks 
        if(arg.questionType=="MCQ"&&(!arg.options||typeof arg.correctAnswerIndex!="number"||arg.correctAnswerIndex>=arg.options.length)){
            throw new ConvexError(`${!arg.options?"options are missing":typeof arg.correctAnswerIndex==='number'?"correct answer is missing":"invalid option index"}`)
        }else if(arg.questionType=="True/False"&&typeof arg.correctAnswerIndex !='number'){
            throw new ConvexError('correct answer is missing')
        }
        const id=await ctx.db.insert('questions',{
            question:arg.question,
            options:arg.options,
            correctAnswerIndex:arg.correctAnswerIndex,
            answer:arg.answer,
            questionType:arg.questionType,
            roomId:arg.roomId
            
        })

        return id

    }
})


export const getRoomeQuestions=query({
    args:{roomId:v.id("rooms")},
    handler:(ctx,arg)=>{
        const questions=ctx.db.query("questions").withIndex("by_room",(question)=>{
            return question.eq("roomId",arg.roomId)

        }).collect()
        return questions;
    },

})

export const getStudentsQuestions=query({
    args:{roomId:v.string()},
    handler:async(ctx,args)=>{
        const id=ctx.db.normalizeId('rooms',args.roomId)
        if(!id){
            return null
        }
        const questions=ctx.db.query("questions").withIndex("by_room",(question)=>{
            return question.eq("roomId",id)
        }).collect()
        console.log("get called")
        return questions;
    }
})