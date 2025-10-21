# Integrating Create Page with Convex

## Overview

To enable the AI chat to access memories from phone calls, you need to save the call data to Convex after each successful Vapi call.

## Integration Steps

### 1. Update Create Page Component

Add the Convex hooks to your create page:

```typescript
// app/create/page.tsx
"use client";

import { useSaveMemory, useUpdateMemory } from "./convex-integration";

export default function CreatePage() {
  const saveMemory = useSaveMemory();
  const updateMemory = useUpdateMemory();

  // Your existing form submission code
  const handleSubmit = async (formData: FormData) => {
    // 1. Make Vapi call
    const response = await makeMemoryCall(formData);

    if (response.success) {
      // 2. Save to Convex immediately
      const result = await saveMemory({
        name: formData.get("name") as string,
        phoneNumber: formData.get("phoneNumber") as string,
        callId: response.callId,
        customQuestions: formData.get("customQuestions") as string,
      });

      if (result.success) {
        console.log("Memory saved with ID:", result.memoryId);
        // Store memoryId for later updates
        // You might want to save this to state or localStorage
      }
    }
  };

  // ... rest of your component
}
```

### 2. Update Memory with Transcript (Optional)

If you have a webhook or callback that receives the call transcript and summary:

```typescript
// When you receive transcript/summary from Vapi
const handleCallComplete = async (callData: {
  callId: string;
  transcript: string;
  summary: string;
}) => {
  // Find the memoryId associated with this callId
  // (you'll need to store this mapping)
  const memoryId = getMemoryIdByCallId(callData.callId);

  if (memoryId) {
    await updateMemory({
      memoryId,
      transcript: callData.transcript,
      summary: callData.summary,
    });
  }
};
```

### 3. Complete Integration Example

Here's a more complete example:

```typescript
"use client";

import { useState } from "react";
import { useSaveMemory } from "./convex-integration";
import { makeMemoryCall } from "./actions";

export default function CreatePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const saveMemory = useSaveMemory();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("Initiating call...");

    try {
      const formData = new FormData(e.currentTarget);

      // 1. Make Vapi call
      const vapiResponse = await makeMemoryCall(formData);

      if (!vapiResponse.success) {
        setStatus(`Error: ${vapiResponse.error}`);
        return;
      }

      setStatus("Call initiated successfully!");

      // 2. Save to Convex
      const convexResponse = await saveMemory({
        name: formData.get("name") as string,
        phoneNumber: formData.get("phoneNumber") as string,
        callId: vapiResponse.callId,
        customQuestions: formData.get("customQuestions") as string,
      });

      if (convexResponse.success) {
        setStatus("Memory recorded! You can now explore it in the chat.");
        // Optionally redirect to explore page
        // router.push("/explore");
      } else {
        setStatus("Call succeeded but failed to save memory for chat access");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" required />
        <input name="phoneNumber" placeholder="Phone Number" required />
        <textarea
          name="customQuestions"
          placeholder="Memory prompts"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Start Call"}
        </button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
}
```

## Alternative: Server-Side Integration

If you prefer to save directly in the server action:

```typescript
// app/create/actions.ts
"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function makeMemoryCall(formData: FormData) {
  // ... existing Vapi call code ...

  if (response.ok) {
    const responseData = await response.json();

    // Save to Convex from server
    try {
      await convex.mutation(api.memories.createMemory, {
        name: data.name,
        phoneNumber: data.phoneNumber,
        callId: responseData.id || responseData.callId,
        customQuestions: data.customQuestions,
      });
    } catch (error) {
      console.error("Failed to save memory to Convex:", error);
      // Continue anyway - don't fail the call
    }

    return {
      success: true,
      callId: responseData.id || responseData.callId,
    };
  }

  // ... rest of error handling ...
}
```

**Note**: Server-side approach requires authentication setup. The client-side approach using hooks is simpler and already has auth context from Clerk.

## Vapi Webhook Integration (Advanced)

To automatically update memories with transcripts and summaries, set up a Vapi webhook:

### 1. Create Webhook Endpoint

```typescript
// app/api/vapi-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Vapi sends different event types
    if (data.type === "call.ended") {
      const { callId, transcript, summary } = data;

      // Find memory by callId and update
      // Note: You'll need to add a query to find memory by callId
      await convex.mutation(api.memories.updateMemoryByCallId, {
        callId,
        transcript,
        summary,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
```

### 2. Add Update Query to Convex

```typescript
// convex/memories.ts
export const updateMemoryByCallId = mutation({
  args: {
    callId: v.string(),
    transcript: v.optional(v.string()),
    summary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const memory = await ctx.db
      .query("memories")
      .withIndex("by_call", (q) => q.eq("callId", args.callId))
      .first();

    if (!memory) {
      throw new Error("Memory not found for callId");
    }

    await ctx.db.patch(memory._id, {
      transcript: args.transcript,
      summary: args.summary,
    });

    return memory._id;
  },
});
```

### 3. Configure Vapi Webhook

In your Vapi dashboard:

1. Go to Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/vapi-webhook`
3. Select events: `call.ended`
4. Save

## Testing

### 1. Make a Test Call

- Go to `/create`
- Fill in the form
- Submit

### 2. Check Convex Dashboard

- Open https://dashboard.convex.dev
- Go to your project
- Check the `memories` table
- You should see a new entry

### 3. Test the Chat

- Go to `/explore`
- Start a new conversation
- Ask: "What memories do I have?"
- The AI should reference your recorded memory

## Troubleshooting

### Memory not appearing in chat

- Check Convex dashboard to verify memory was saved
- Ensure `userId` matches between Clerk and Convex
- Check browser console for errors

### TypeScript errors

- Run `npx convex dev` to generate types
- Restart TypeScript server in VS Code

### Authentication errors

- Verify Clerk is properly configured
- Check that user is signed in
- Review Convex dashboard logs

## Data Flow Diagram

```
┌──────────────┐
│   User fills │
│   form on    │──┐
│   /create    │  │
└──────────────┘  │
                  │ 1. Submit
                  ↓
┌──────────────────────────┐
│  makeMemoryCall()        │
│  (Server Action)         │
│  ├─ Call Vapi API        │
│  └─ Return callId        │
└──────────┬───────────────┘
           │ 2. Success
           ↓
┌──────────────────────────┐
│  useSaveMemory()         │
│  (Client Hook)           │
│  └─ Save to Convex       │
└──────────┬───────────────┘
           │ 3. Stored
           ↓
┌──────────────────────────┐
│  Convex Database         │
│  (memories table)        │
└──────────┬───────────────┘
           │ 4. Available
           ↓
┌──────────────────────────┐
│  AI Chat on /explore     │
│  ├─ Fetches memories     │
│  ├─ Builds context       │
│  └─ Answers questions    │
└──────────────────────────┘
```

## Quick Start Checklist

- [ ] Convex is set up and running (`npx convex dev`)
- [ ] User is authenticated with Clerk
- [ ] Import `useSaveMemory` in create page
- [ ] Call `saveMemory()` after successful Vapi call
- [ ] Test by making a call
- [ ] Verify in Convex dashboard
- [ ] Check chat can access the memory

---

For more details, see:

- `CONVEX_SETUP.md` - Convex setup instructions
- `AI_CHAT_README.md` - Complete chat documentation
- `IMPLEMENTATION_SUMMARY.md` - Overview of all changes
