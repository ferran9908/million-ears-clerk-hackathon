import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { rag } from "./rag";
import { internal } from "./_generated/api";

export const addCallToRAG = internalAction({
  args: {
    userId: v.optional(v.string()),
    familyMemberName: v.optional(v.string()),
    transcript: v.string(),
    callId: v.id("calls"),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const { userId, familyMemberName, transcript, callId, timestamp } = args;

    // Create a namespace based on userId, or use "global" if no userId
    const namespace = userId || "global";

    // Format the text to include context
    const familyContext = familyMemberName
      ? `Conversation with ${familyMemberName}:\n\n`
      : "Conversation:\n\n";
    const formattedText = `${familyContext}${transcript}`;

    // Add the transcript to RAG
    await rag.add(ctx, {
      namespace,
      text: formattedText,
      metadata: {
        callId,
        timestamp,
        familyMemberName: familyMemberName || null,
      },
    });
  },
});
