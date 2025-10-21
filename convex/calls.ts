import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const recordCall = mutation({
  args: {
    phoneNumber: v.string(),
    name: v.string(),
    question: v.string(),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("in_progress"),
        v.literal("completed"),
        v.literal("failed")
      )
    ),
    vapiCallId: v.optional(v.string()),
    userId: v.optional(v.string()),
    familyMemberName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const callId = await ctx.db.insert("calls", {
      phoneNumber: args.phoneNumber,
      name: args.name,
      question: args.question,
      status: args.status ?? "pending",
      vapiCallId: args.vapiCallId,
      userId: args.userId,
      familyMemberName: args.familyMemberName,
    });
    return callId;
  },
});

export const getCallByVapiId = internalQuery({
  args: {
    vapiCallId: v.string(),
  },
  handler: async (ctx, args) => {
    const calls = await ctx.db
      .query("calls")
      .filter((q) => q.eq(q.field("vapiCallId"), args.vapiCallId))
      .collect();
    return calls;
  },
});

export const getAllCalls = query({
  handler: async (ctx) => {
    return await ctx.db.query("calls").collect();
  },
});

export const updateCallStatus = internalMutation({
  args: {
    id: v.id("calls"),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("failed")
    ),
    transcript: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, status, transcript } = args;
    await ctx.db.patch(id, {
      status,
      transcript,
    });
  },
});
