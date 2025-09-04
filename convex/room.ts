import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const creatRoom = mutation({
  args: {
    name: v.string(),
    duration: v.object({ hour: v.number(), minute: v.number() }),
  },
  handler: async (ctx, args) => {
    const roomId = await ctx.db.insert("rooms", {
      name: args.name,
      duration: args.duration,
    });
    console.log(roomId);
    return roomId;
  },
});
