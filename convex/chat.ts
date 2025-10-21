import { listUIMessages, syncStreams, vStreamArgs } from "@convex-dev/agent";
import { v } from "convex/values";
import { components } from "./_generated/api";
import type { ActionCtx, MutationCtx, QueryCtx } from "./_generated/server";
import { action, mutation, query } from "./_generated/server";
import { memoryQueryAgent } from "./memoryQueryAgent";

/**
 * Creates a new chat thread for the current user
 */
export const createThread = mutation({
  args: {},
  handler: async (ctx: MutationCtx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const thread = await ctx.runMutation(
      components.agent.threads.createThread,
      {
        userId: identity.subject,
      }
    );

    return thread;
  },
});

/**
 * Lists all messages in a thread with streaming support
 */
export const listMessages = query({
  args: {
    threadId: v.string(),
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
      id: v.optional(v.union(v.string(), v.number())),
    }),
    streamArgs: vStreamArgs,
  },
  handler: async (ctx: QueryCtx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Fetch regular non-streaming messages
    const paginated = await listUIMessages(ctx, components.agent, args);

    // Fetch streaming deltas
    const streams = await syncStreams(ctx, components.agent, args);

    return { ...paginated, streams };
  },
});

/**
 * Sends a message and generates an AI response
 */
export const sendMessage = action({
  args: {
    threadId: v.string(),
    message: v.string(),
  },
  handler: async (ctx: ActionCtx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const { threadId, message } = args;

    // Get user's memories as context
    // const memories = await ctx.runQuery(api.memories.getUserMemories, {
    //   userId: identity.subject,
    // });

    console.log("IS SOMETHING HAPPENING HERE");
    // Stream the response using the agent
    await memoryQueryAgent.streamText(
      ctx,
      { threadId },
      {
        prompt: `User question: ${message}`,
        system: `You are a helpful AI assistant for exploring family memories. 
Be warm, empathetic, and help users discover insights about their recorded memories. 
If asked about specific people or events, reference the provided memory transcripts and summaries.
If no memories are available yet, gently guide them to record some first.

There is one story that should be present by default, this is it:

This is the story of how my grandmother failed english class. she had to spell just one word right in the word coffee - but she spelt it as "KAPHY"`,
      },
      {
        saveStreamDeltas: {
          chunking: "word",
          throttleMs: 100,
        },
      }
    );

    return { success: true };
  },
});

/**
 * Gets a specific thread
 */
export const getThread = query({
  args: { threadId: v.string() },
  handler: async (ctx: QueryCtx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const thread = await ctx.runQuery(components.agent.threads.getThread, {
      threadId: args.threadId,
    });

    if (!thread || thread.userId !== identity.subject) {
      throw new Error("Thread not found or unauthorized");
    }

    return thread;
  },
});

/**
 * Lists all threads for the current user
 */
export const listThreads = query({
  args: {},
  handler: async (ctx: QueryCtx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const result = await ctx.runQuery(
      components.agent.threads.listThreadsByUserId,
      {
        userId: identity.subject,
        order: "desc",
        paginationOpts: {
          numItems: 50,
          cursor: null,
        },
      }
    );

    // Return just the page array of threads
    return result.page;
  },
});
