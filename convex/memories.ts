import { v } from "convex/values";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";

/**
 * Retrieves all memories for a specific user
 */
export const getUserMemories = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx: QueryCtx, args) => {
    const memories = await ctx.db
      .query("memories")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return memories;
  },
});

/**
 * Retrieves all memories for the current authenticated user
 */
export const getMyMemories = query({
  args: {},
  handler: async (ctx: QueryCtx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const memories = await ctx.db
      .query("memories")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();

    return memories;
  },
});

/**
 * Creates a new memory record
 */
export const createMemory = mutation({
  args: {
    name: v.string(),
    phoneNumber: v.string(),
    callId: v.optional(v.string()),
    customQuestions: v.optional(v.string()),
    transcript: v.optional(v.string()),
    summary: v.optional(v.string()),
  },
  handler: async (ctx: MutationCtx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const memoryId = await ctx.db.insert("memories", {
      userId: identity.subject,
      name: args.name,
      phoneNumber: args.phoneNumber,
      callId: args.callId,
      customQuestions: args.customQuestions,
      transcript: args.transcript,
      summary: args.summary,
      createdAt: Date.now(),
    });

    return memoryId;
  },
});

/**
 * Updates an existing memory record
 */
export const updateMemory = mutation({
  args: {
    memoryId: v.id("memories"),
    transcript: v.optional(v.string()),
    summary: v.optional(v.string()),
  },
  handler: async (ctx: MutationCtx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const memory = await ctx.db.get(args.memoryId);
    if (!memory || memory.userId !== identity.subject) {
      throw new Error("Memory not found or unauthorized");
    }

    await ctx.db.patch(args.memoryId, {
      transcript: args.transcript,
      summary: args.summary,
    });

    return args.memoryId;
  },
});
