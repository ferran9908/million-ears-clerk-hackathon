import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { z } from "zod";
import { Webhook } from "svix";

export const vapiWebhook = httpAction(async (ctx, req) => {
  try {
    console.log("VAPI Webhook called");
    const contentType = req.headers.get("content-type");

    let body;

    if (contentType?.includes("application/json")) {
      body = await req.json();
    } else if (contentType?.includes("text/")) {
      body = await req.text();
    } else {
      const rawBody = await req.text();
      body = rawBody;
    }

    const message = body?.message;

    // Handle end-of-call-report
    if (message?.type === "end-of-call-report") {
      const callId = message.call?.id;
      const endedReason = message.endedReason;

      if (callId) {
        // Find the call by VAPI call ID
        const calls = await ctx.runQuery(
          internal.calls.getCallByVapiId,
          {
            vapiCallId: callId,
          },
        );

        if (calls && calls.length > 0) {
          const call = calls[0];

          // Determine call status based on ended reason
          const callStatus =
            endedReason === "customer-ended-call" ||
            endedReason === "assistant-ended-call"
              ? "completed"
              : "failed";

          // Extract transcript
          const transcript =
            message.transcript || message.artifact?.transcript || "";

          // Update the call with status and transcript
          await ctx.runMutation(internal.calls.updateCallStatus, {
            id: call._id,
            status: callStatus,
            transcript,
          });

          // If we have a transcript and the call was successful, extract memories
          if (transcript && callStatus === "completed") {
            // TODO: Implement memory extraction
            // The memoryCapturer agent exists in memoryCapturer.ts
            // Create an action/mutation to:
            // 1. Use memoryCapturer agent to extract memories from transcript
            // 2. Store extracted memories in a memories table
            // Example:
            // await ctx.scheduler.runAfter(
            //   0,
            //   internal.extractMemories.extractMemoriesFromTranscript,
            //   {
            //     callId: call._id,
            //     transcript,
            //   },
            // );

            // Add the call to RAG for future querying
            const userId = call.userId;
            const familyMemberName = call.familyMemberName;

            await ctx.scheduler.runAfter(0, internal.ragActions.addCallToRAG, {
              userId,
              familyMemberName,
              transcript,
              callId: call._id,
              timestamp: Date.now(),
            });
          }
        }
      }
    }

    // Handle status-update (for real-time status changes)
    else if (message?.type === "status-update") {
      const callId = message.call?.id;
      const status = message.status;
      const endedReason = message.endedReason;

      // Only update if the call has ended and we haven't received the full report yet
      if (callId && status === "ended") {
        const calls = await ctx.runQuery(
          internal.calls.getCallByVapiId,
          {
            vapiCallId: callId,
          },
        );

        if (calls && calls.length > 0) {
          const call = calls[0];

          // Only update status if we don't have a transcript yet (end-of-call-report hasn't arrived)
          if (!call.transcript) {
            const callStatus =
              endedReason === "customer-ended-call" ||
              endedReason === "assistant-ended-call"
                ? "completed"
                : "failed";

            await ctx.runMutation(internal.calls.updateCallStatus, {
              id: call._id,
              status: callStatus,
            });
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ message: "Webhook processed successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error processing Vapi webhook:", error);
    return new Response(JSON.stringify({ error: "Failed to log request" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
});
