# Convex Setup Guide

This guide will help you set up Convex for the Million Ears application with AI chat functionality.

## Prerequisites

1. A Convex account (sign up at [convex.dev](https://convex.dev))
2. Clerk authentication already configured
3. OpenAI API key for the AI agent

## Setup Steps

### 1. Initialize Convex

```bash
npx convex dev
```

This will:

- Prompt you to log in to Convex
- Create a new Convex project or link to an existing one
- Generate the `NEXT_PUBLIC_CONVEX_URL` for your `.env.local`

### 2. Configure Environment Variables

Add the following to your `.env.local`:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# OpenAI (required for AI Agent)
OPENAI_API_KEY=sk-your-openai-api-key

# Clerk (if not already set)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWT_ISSUER_DOMAIN=your-clerk-domain.clerk.accounts.dev
```

### 3. Set Convex Environment Variables

Set your OpenAI API key in Convex:

```bash
npx convex env set OPENAI_API_KEY sk-your-openai-api-key
```

### 4. Deploy the Schema and Functions

The schema and functions will automatically deploy when you run:

```bash
npx convex dev
```

This watches for changes and automatically deploys updates.

### 5. Configure Clerk-Convex Integration

In your Clerk Dashboard:

1. Go to **JWT Templates**
2. Create a new template named "convex"
3. Add the following claims:
   ```json
   {
     "sub": "{{user.id}}"
   }
   ```
4. Copy your JWT Issuer Domain and add it to `.env.local` as `CLERK_JWT_ISSUER_DOMAIN`

### 6. Install the Convex Agent Component

The Convex Agent component is already configured in `convex/convex.config.ts`. When you run `npx convex dev`, it will automatically install and configure the agent component for AI chat functionality.

## What Was Built

### Convex Schema (`convex/schema.ts`)

- **memories**: Stores family memories from phone calls
  - Indexed by userId and callId for fast queries

### Convex Functions

#### Chat Functions (`convex/chat.ts`)

- `createThread`: Creates a new chat thread for a user
- `listMessages`: Lists messages with streaming support
- `sendMessage`: Sends a message and generates AI response with memory context
- `getThread`: Retrieves a specific thread
- `listThreads`: Lists all threads for the current user

#### Memory Functions (`convex/memories.ts`)

- `getUserMemories`: Gets memories for a specific user
- `getMyMemories`: Gets memories for the authenticated user
- `createMemory`: Creates a new memory record
- `updateMemory`: Updates an existing memory

### UI Components

1. **ChatInterface**: Main chat interface with message list and input
2. **ChatMessage**: Individual message component with smooth text streaming
3. **ChatInput**: Message input with send button
4. **ConvexClientProvider**: Wraps the app with Convex and Clerk auth

### Features

- ✅ Real-time message streaming using Convex Agent
- ✅ Automatic memory context injection for AI responses
- ✅ Thread-based conversations
- ✅ Clerk authentication integration
- ✅ Smooth text animation during streaming
- ✅ Chat history with thread management
- ✅ Responsive mobile-first UI

## Testing the Chat

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Navigate to `/explore` in your browser

3. Sign in with Clerk

4. Click "Start New Conversation" to create a chat thread

5. Ask questions about family memories (e.g., "What memories have I recorded?")

## Troubleshooting

### "Module not found" errors

Run `npx convex dev` to generate the API types.

### Authentication errors

Ensure your Clerk JWT template is configured correctly with the "convex" applicationID.

### AI not responding

Check that your `OPENAI_API_KEY` is set correctly in Convex environment variables:

```bash
npx convex env get OPENAI_API_KEY
```

### Type errors in IDE

The Convex types will be generated after running `npx convex dev`. Restart your TypeScript server in VS Code if needed.

## Next Steps

- Add more sophisticated memory retrieval (semantic search)
- Implement conversation summaries
- Add voice input/output
- Create memory visualization features
- Add export functionality for conversations
