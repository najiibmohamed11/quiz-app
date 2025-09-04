import { error } from "node:console";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const creatRoom = mutation({
  args: {
    name: v.string(),
    duration: v.object({ hour: v.number(), minute: v.number() }),
  },
  handler: async (ctx, args) => {
    const teacher = await ctx.auth.getUserIdentity();
    if (!teacher?.subject) {
      throw new Error("not authanticated");
    }
    const roomId = await ctx.db.insert("rooms", {
      teacher: teacher.subject,
      name: args.name,
      duration: args.duration,
    });

    return roomId;
  },
});
