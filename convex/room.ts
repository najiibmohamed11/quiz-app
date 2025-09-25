import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const creatRoom = mutation({
  args: {
    name: v.string(),
    duration: v.object({ hour: v.number(), minute: v.number() }),
  },
  handler: async (ctx, args) => {
    const teacher = await ctx.auth.getUserIdentity();
    if (!teacher?.subject) {
      throw new ConvexError("not authanticated");
    }
    const isRoomExsist = await ctx.db
      .query("rooms")
      .filter((room) => room.eq(room.field("name"), args.name))
      .first();

    if (isRoomExsist) {
      throw new ConvexError("This Room Already exsist");
    }

    const roomId = await ctx.db.insert("rooms", {
      teacher: teacher.subject,
      name: args.name,
      duration: args.duration,
    });
    

    return roomId;
  },
});

export const getRooms = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user?.subject) {
     throw  new ConvexError("not authanticated");
    }
    const rooms = await ctx.db
      .query("rooms")
      .filter((room) => room.eq(room.field("teacher"), user.subject)).collect();

    return rooms;
  },
});

export const getRoomDetails=query({
  args:{roomId:v.string()},
  handler:async (ctx,args)=>{
    const roomId=ctx.db.normalizeId("rooms",args.roomId)
    if(!roomId){
      return "this room not valid thing"
    }
    const roomInfo=await ctx.db.get(roomId)
    const questions=await ctx.db.query("questions").withIndex("by_room",(question)=>question.eq("roomId",roomId)).collect()
    const students=await ctx.db.query("students").withIndex("by_room",(student)=>student.eq("roomId",roomId)).collect()
    return {roomInfo,questionLength:questions.length,participants:students.length}
  }
})

export const FindRoom=query({
  args:{roomName:v.string()},
  handler:async (ctx,arg)=>{
    if(!arg.roomName){
      return "please provide room name"
    }

    const isRoomExsist =await ctx.db
    .query('rooms')
    .filter((room)=>room.eq(room.field("name"),arg.roomName))
    .first()
    return isRoomExsist?isRoomExsist:"This room does not exist. Please check the room name and try again."

  }
  
})