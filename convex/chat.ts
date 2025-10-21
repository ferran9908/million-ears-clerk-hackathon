import { openai } from "@ai-sdk/openai";
import {
  Agent,
  listUIMessages,
  syncStreams,
  vStreamArgs,
} from "@convex-dev/agent";
import { v } from "convex/values";
import { api, components } from "./_generated/api";
import type { ActionCtx, MutationCtx, QueryCtx } from "./_generated/server";
import { action, mutation, query } from "./_generated/server";

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
    const memories = await ctx.runQuery(api.memories.getUserMemories, {
      userId: identity.subject,
    });

    // Build context from memories
    const memoryContext =
      memories.length > 0
        ? `You are helping the user explore their family memories. Here are the memories they've recorded:\n\n${memories
            .map(
              (m, i) =>
                `Memory ${i + 1}:\nName: ${m.name}\n${
                  m.summary ? `Summary: ${m.summary}` : ""
                }${m.transcript ? `\nTranscript: ${m.transcript}` : ""}\n`
            )
            .join(
              "\n---\n"
            )}\n\nBased on these memories, please answer the following question:`
        : "The user hasn't recorded any family memories yet. Let them know they can record memories by making a phone call from the Create page.";

    // Create an agent instance with OpenAI model
    const agent = new Agent(components.agent, {
      name: "Family Memory Assistant",
      languageModel: openai("gpt-4o-mini"),
    });

    // Stream the response using the agent
    await agent.streamText(
      ctx,
      { threadId },
      {
        prompt: `${memoryContext}\n\nUser question: ${message}`,
        system: `You are a helpful AI assistant for exploring family memories. 
Be warm, empathetic, and help users discover insights about their recorded memories. 
If asked about specific people or events, reference the provided memory transcripts and summaries.
If no memories are available yet, gently guide them to record some first.`,
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
