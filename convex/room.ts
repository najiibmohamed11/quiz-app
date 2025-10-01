import { mutation, MutationCtx, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";

export const creatRoom = mutation({
  args: {
    name: v.string(),
    duration: v.number(),
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
      status: "pause",
      remainingTime: args.duration,
      expiresAt: undefined,
    });

    return roomId;
  },
});

export const getRooms = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user?.subject) {
      return "not authenticated";
    }
    const rooms = await ctx.db
      .query("rooms")
      .filter((room) => room.eq(room.field("teacher"), user.subject))
      .collect();

    return rooms;
  },
});

export const getRoom = query({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    const roomId = ctx.db.normalizeId("rooms", args.roomId);
    if (!roomId) {
      return "invalid room go back";
    }
    const roomInfo = await ctx.db.get(roomId);
    if (!roomInfo) {
      return "room doesn't exsist";
    }

    return roomInfo;
  },
});

export const getRoomDetails = query({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    const roomId = ctx.db.normalizeId("rooms", args.roomId);
    if (!roomId) {
      return "this room not valid thing";
    }
    const roomInfo = await ctx.db.get(roomId);
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_room", (question) => question.eq("roomId", roomId))
      .collect();
    const students = await ctx.db
      .query("students")
      .withIndex("by_room", (student) => student.eq("roomId", roomId))
      .collect();
    return {
      roomInfo,
      questionLength: questions.length,
      participants: students.length,
    };
  },
});

export const FindRoom = query({
  args: { roomName: v.string() },
  handler: async (ctx, arg) => {
    if (!arg.roomName) {
      return "please provide room name";
    }

    const isRoomExsist = await ctx.db
      .query("rooms")
      .filter((room) => room.eq(room.field("name"), arg.roomName))
      .first();
    return isRoomExsist
      ? isRoomExsist
      : "This room does not exist. Please check the room name and try again.";
  },
});

export const changeRoomStatus = mutation({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    const roomId = ctx.db.normalizeId("rooms", args.roomId);
    if (!roomId) {
      throw new ConvexError("room is invalid one");
    }
    const room = await ctx.db.get(roomId);
    if (!room) {
      throw new ConvexError("room is invalid one");
    }
    //activation the room when room have remaing time
    if (room.status === "pause" && room.remainingTime) {
      const now = Date.now();
      const expiresAt = now + room.remainingTime;
      await ctx.db.patch(roomId, { expiresAt, status: "active" });
    }
    //pause when the toom is active and have expiaraton Date
    else if (room.status === "active" && room.expiresAt && room.duration) {
      const now = Date.now();
      const remainingTime = Math.max(0, room.expiresAt - now);
      await ctx.db.patch(roomId, {
        expiresAt: undefined,
        status: "pause",
        remainingTime: remainingTime,
      });
    }
    //if the room doesnt have timing thing
    else if (!room.duration && !room.remainingTime && !room.expiresAt) {
      await ctx.db.patch(roomId, {
        status: room.status === "active" ? "pause" : "active",
      });
    } else {
      throw new ConvexError("you can't restart ended room");
    }
  },
});

export const lockRoom = mutation({
  args: {
    students: v.array(v.record(v.string(), v.string())),
    uniqueColumnForSearch: v.string(),
    roomId: v.string(),
    columns: v.array(v.string()),
  },
  handler: async (
    ctx,
    { columns, roomId, students, uniqueColumnForSearch },
  ) => {
    const valiRoomId = ctx.db.normalizeId("rooms", roomId);
    if (!valiRoomId) {
      return `invalid room id`;
    }

    await deleteAllStudentsInRoom(valiRoomId, ctx);
    const restrictingRoom = ctx.db.patch(valiRoomId, {
      restriction: {
        uniqueColumn: uniqueColumnForSearch,
        otherColumn:
          columns.length > 1
            ? columns[0] !== uniqueColumnForSearch
              ? columns[0]
              : columns[1]
            : undefined,
      },
    });
    const studentsPromis = students.map((row) => {
      const isRowValid = columns.every((element) => element in row);
      const secondaryIdentifier =
        columns[0] != uniqueColumnForSearch ? columns[0] : columns[1];
      if (!isRowValid) {
        return Promise.reject("columns and rows are not matching");
      }
      return ctx.db.insert("students", {
        roomId: valiRoomId,
        completedQuestions: 0,
        uniqueId: row[uniqueColumnForSearch].toLowerCase(),
        secondaryIdentifier: row[secondaryIdentifier],
      });
    });

    await Promise.all([...studentsPromis, restrictingRoom]);
  },
});

export const unlockRoom = mutation({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    const roomId = ctx.db.normalizeId("rooms", args.roomId);
    if (!roomId) {
      return "this room is not valid room";
    }

    await deleteAllStudentsInRoom(roomId, ctx);

    await ctx.db.patch(roomId, { restriction: undefined });
  },
});

const deleteAllStudentsInRoom = async (
  roomId: Id<"rooms">,
  ctx: MutationCtx,
) => {
  const studentsInRoom = await ctx.db
    .query("students")
    .withIndex("by_room", (student) => student.eq("roomId", roomId))
    .collect();
  if (studentsInRoom.length > 0) {
    for (const student of studentsInRoom) {
      await ctx.db.delete(student._id);
    }
  }
};
