# 🚀 Quick Start Guide - AI Chat Feature

Get your AI chat up and running in 5 minutes!

## Prerequisites

✅ You have:

- Node.js and pnpm installed
- Clerk authentication set up
- Vapi API configured for phone calls

## 🎬 Setup in 5 Steps

### Step 1: Initialize Convex (2 min)

```bash
npx convex dev
```

- Log in to Convex when prompted
- Create a new project or select existing
- Copy the `NEXT_PUBLIC_CONVEX_URL` shown

### Step 2: Add Environment Variables (1 min)

Create/update `.env.local`:

```bash
# Copy from Convex CLI output
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Get from OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Already set up
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWT_ISSUER_DOMAIN=your-domain.clerk.accounts.dev
```

### Step 3: Set Convex Environment Variables (30 sec)

```bash
npx convex env set OPENAI_API_KEY sk-your-openai-api-key
```

### Step 4: Configure Clerk JWT (1 min)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **JWT Templates**
3. Click **+ New template**
4. Name it: `convex`
5. Add this claim:
   ```json
   {
     "sub": "{{user.id}}"
   }
   ```
6. Click **Save**

### Step 5: Start the App (30 sec)

In a new terminal (keep `npx convex dev` running):

```bash
npm run dev
```

Visit: `http://localhost:3000/explore`

## 🎉 You're Done!

Try it out:

1. Sign in with Clerk
2. Click "Start New Conversation"
3. Ask: "What memories do I have?"

## 📝 Optional: Connect Create Page

To make recorded memories available in chat, add this to your create page:

```typescript
// app/create/page.tsx
import { useSaveMemory } from "./convex-integration";

// In your component:
const saveMemory = useSaveMemory();

// After successful Vapi call:
await saveMemory({
  name: formData.get("name") as string,
  phoneNumber: formData.get("phoneNumber") as string,
  callId: response.callId,
  customQuestions: formData.get("customQuestions") as string,
});
```

See `CREATE_PAGE_INTEGRATION.md` for complete details.

## 📚 Need More Info?

- **Full Setup**: `CONVEX_SETUP.md`
- **Features & Architecture**: `AI_CHAT_README.md`
- **All Changes**: `IMPLEMENTATION_SUMMARY.md`
- **Create Integration**: `CREATE_PAGE_INTEGRATION.md`

## 🐛 Common Issues

### "Module not found" errors

→ Wait for `npx convex dev` to finish deploying (watch the terminal)

### "Not authenticated" errors

→ Check Clerk JWT template is named exactly "convex"

### AI not responding

→ Verify `OPENAI_API_KEY` is set: `npx convex env get OPENAI_API_KEY`

### TypeScript warnings about 'any'

→ Normal! They'll disappear after `npx convex dev` generates types. Restart VS Code's TypeScript server if needed.

## ✅ Checklist

- [ ] `npx convex dev` is running
- [ ] `.env.local` has `NEXT_PUBLIC_CONVEX_URL`
- [ ] `.env.local` has `OPENAI_API_KEY`
- [ ] Convex env has `OPENAI_API_KEY` set
- [ ] Clerk JWT template "convex" exists
- [ ] `npm run dev` is running
- [ ] Can access `/explore` page
- [ ] Can create a conversation
- [ ] AI responds to messages

## 🎯 What You Built

✨ **Features**:

- Real-time AI chat with streaming responses
- Memory-aware conversations
- Chat history with threads
- Smooth text animations
- Mobile-responsive UI
- Dark mode support

🏗️ **Tech Stack**:

- Convex (backend + real-time)
- Convex Agent (AI streaming)
- OpenAI (AI responses)
- Clerk (authentication)
- Next.js 16 (frontend)
- Tailwind + Shadcn UI (styling)

## 🚀 Next Steps

1. **Test the chat** - Ask questions about your app
2. **Record a memory** - Use the `/create` page
3. **Connect create page** - Follow `CREATE_PAGE_INTEGRATION.md`
4. **Customize** - Edit system prompts in `convex/chat.ts`
5. **Deploy** - Push to Vercel + deploy Convex production

---

**Questions?** Check the detailed docs or the Convex Discord community!

Happy chatting! 💬✨
