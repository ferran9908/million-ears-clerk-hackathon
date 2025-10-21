# AI Chat Implementation - Million Ears

A comprehensive AI-powered chat interface built with Convex Agent for exploring family memories. This implementation follows Convex best practices and includes real-time streaming, authentication, and memory context integration.

## 🎯 Overview

The AI chat allows users to:

- Ask questions about their recorded family memories
- Get AI-powered insights and summaries
- Have contextual conversations with memory-aware responses
- View and manage chat history across multiple threads
- Experience smooth, real-time streaming responses

## 📁 Files Created

### Backend (Convex)

1. **`convex/schema.ts`** - Database schema definition

   - Memories table for storing recorded family stories
   - Indexes for efficient querying by user and call ID

2. **`convex/chat.ts`** - Chat functionality

   - Thread creation and management
   - Message listing with streaming support
   - AI response generation with memory context
   - Thread authorization checks

3. **`convex/memories.ts`** - Memory management

   - CRUD operations for family memories
   - User-specific memory queries
   - Authentication guards

4. **`convex/convex.config.ts`** - Convex configuration

   - Agent component integration
   - Module exports

5. **`convex/auth.config.ts`** - Authentication configuration

   - Clerk JWT integration
   - Security settings

6. **`convex/environment.d.ts`** - TypeScript environment types
   - OpenAI API key typing

### Frontend

1. **`app/explore/page.tsx`** - Main chat page

   - Thread selection and creation
   - Chat history sidebar
   - Authentication gates
   - Mobile-responsive layout

2. **`components/chat-interface.tsx`** - Chat UI container

   - Message list with auto-scroll
   - Loading states
   - Empty states
   - Pagination support

3. **`components/chat-message.tsx`** - Individual message component

   - User/AI message differentiation
   - Smooth text streaming animation
   - Status indicators

4. **`components/chat-input.tsx`** - Message input field

   - Send button
   - Keyboard shortcuts (Enter to send)
   - Disabled states during sending

5. **`providers/convex-provider.tsx`** - Convex client provider
   - Clerk authentication integration
   - Client initialization

### Configuration

1. **`.env.example`** - Environment variable template
2. **`CONVEX_SETUP.md`** - Detailed setup instructions

## 🚀 Setup Instructions

### 1. Install Dependencies

Dependencies are already installed:

- `@convex-dev/agent` - Convex Agent for AI streaming
- `ai` - Vercel AI SDK
- `@ai-sdk/openai` - OpenAI integration
- `convex-helpers` - Clerk integration utilities

### 2. Initialize Convex

```bash
npx convex dev
```

This will:

- Prompt for Convex login
- Create/link your project
- Generate API types
- Start the dev server

### 3. Configure Environment Variables

Create `.env.local` with:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWT_ISSUER_DOMAIN=your-domain.clerk.accounts.dev

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key
```

### 4. Set Convex Environment Variables

```bash
npx convex env set OPENAI_API_KEY sk-your-openai-api-key
```

### 5. Configure Clerk JWT Template

1. Go to Clerk Dashboard → JWT Templates
2. Create template named "convex"
3. Add claim: `{ "sub": "{{user.id}}" }`
4. Save and copy the Issuer Domain

## 🏗️ Architecture

### Data Flow

```
User Input → ChatInput Component
    ↓
sendMessage Mutation → Convex Action
    ↓
Fetch User Memories → Build Context
    ↓
Call OpenAI via Agent.streamText
    ↓
Stream Deltas to Database (chunked)
    ↓
Client Subscribes to Deltas → UI Updates
    ↓
SmoothText Animation → Display
```

### Key Features

#### 1. **Real-time Streaming**

- Uses Convex Agent's `streamText` with delta streaming
- Saves chunks to database as they're generated
- Multiple clients can subscribe to the same stream
- Survives network interruptions

#### 2. **Memory Context Integration**

- Automatically fetches user's memories before generating responses
- Builds context from transcripts and summaries
- AI references specific memories in responses

#### 3. **Smooth Text Animation**

- `useSmoothText` hook for natural typing effect
- Adapts speed based on incoming text rate
- Prevents jarring jumps in text display

#### 4. **Thread Management**

- Each conversation is a separate thread
- Threads are user-scoped and authorized
- Chat history with timestamps
- Easy navigation between conversations

#### 5. **Authentication**

- Clerk integration throughout
- JWT-based authorization
- Protected queries and mutations
- User-specific data isolation

## 🎨 UI Components

### ChatInterface

Main container managing the chat state:

- Handles message fetching with pagination
- Auto-scrolls to latest messages
- Manages send state and error handling
- Empty states for new threads

### ChatMessage

Renders individual messages:

- Avatar differentiation (User vs AI)
- Streaming status indicators
- Smooth text animation
- Responsive layout

### ChatInput

Message input with:

- Auto-focus on mount
- Enter to send
- Disabled during sending
- Character input validation

## 📊 Database Schema

### memories

```typescript
{
  userId: string,           // Clerk user ID
  name: string,             // Name of person called
  phoneNumber: string,      // Contact number
  callId?: string,          // Vapi call identifier
  transcript?: string,      // Full conversation transcript
  summary?: string,         // AI-generated summary
  customQuestions?: string, // Memory prompts used
  createdAt: number,        // Timestamp
}
```

Indexes:

- `by_user`: Fast lookup of user's memories
- `by_call`: Find memory by call ID

### Agent Tables (auto-generated)

- `threads`: Chat conversation threads
- `messages`: Individual chat messages
- `deltas`: Streaming message chunks

## 🔧 Customization

### Changing AI Model

Edit `convex/chat.ts`:

```typescript
// In sendMessage action, modify the streamText call
await components.agent.streamText(
  ctx,
  { threadId },
  {
    // Change model here
    model: "gpt-4-turbo", // or "gpt-3.5-turbo", etc.
    prompt: fullPrompt,
    system: `Your custom system prompt...`,
  },
  {
    /* streaming options */
  }
);
```

### Adjusting Streaming Speed

Modify chunking and throttle settings:

```typescript
{
  saveStreamDeltas: {
    chunking: "word",     // "word", "line", or custom regex
    throttleMs: 100,      // Milliseconds between saves
  },
}
```

### Custom Memory Context

Edit the memory context building in `convex/chat.ts`:

```typescript
const memoryContext =
  memories.length > 0
    ? `Your custom context template with ${memories.length} memories...`
    : "Fallback message...";
```

## 🐛 Troubleshooting

### API Types Not Found

Run Convex dev to generate types:

```bash
npx convex dev
```

Restart TypeScript server in VS Code: `Cmd+Shift+P` → "Restart TS Server"

### Streaming Not Working

1. Check OpenAI API key is set:

   ```bash
   npx convex env get OPENAI_API_KEY
   ```

2. Verify Agent component is installed:

   ```bash
   npx convex deploy
   ```

3. Check browser console for errors

### Authentication Errors

1. Verify Clerk JWT template exists with name "convex"
2. Check `CLERK_JWT_ISSUER_DOMAIN` matches Clerk dashboard
3. Ensure user is signed in before accessing `/explore`

### Messages Not Appearing

1. Check thread ID is being passed correctly
2. Verify user has permission to access thread
3. Look for authorization errors in Convex dashboard logs

## 📈 Performance Considerations

### Streaming Optimization

- **Throttling**: Balances real-time feel with write performance
- **Chunking**: Groups tokens to reduce database writes
- **Debouncing**: Prevents excessive updates during fast generation

### Query Optimization

- **Pagination**: Load messages in batches for large threads
- **Indexes**: Fast lookups by user and thread
- **Selective Fetching**: Only fetch needed data

### Caching

- Convex automatically caches query results
- Real-time invalidation on updates
- Optimistic UI updates during mutations

## 🔐 Security

### Authentication

- All queries/mutations require authentication
- User-scoped data access
- Thread ownership verification

### Data Isolation

- Users can only access their own memories
- Thread authorization checks prevent unauthorized access
- Clerk handles session management

### API Keys

- OpenAI key stored securely in Convex
- Never exposed to client
- Rotatable via Convex environment variables

## 🎯 Next Steps

Potential enhancements:

1. **Semantic Search**: Vector search over memories
2. **Memory Summarization**: Auto-generate memory summaries
3. **Voice Interface**: Add voice input/output
4. **Memory Graphs**: Visualize relationships in memories
5. **Export**: Download conversations as PDF/text
6. **Sharing**: Share specific conversations with family
7. **Reminders**: AI-suggested follow-up questions
8. **Tags**: Categorize and filter memories

## 📚 Resources

- [Convex Agent Docs](https://docs.convex.dev/agents/streaming)
- [Convex Authentication](https://docs.convex.dev/authentication)
- [AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Clerk + Convex Guide](https://docs.convex.dev/auth/clerk)

## 🤝 Support

For issues or questions:

1. Check the troubleshooting section
2. Review Convex dashboard logs
3. Consult the Convex Discord community
4. Review the setup documentation

---

Built with ❤️ using Convex, Next.js, and OpenAI
