# 🚀 Quick Run Guide

## Start Your AI Chat in 3 Steps

### Step 1: Start Convex (Terminal 1)

```bash
npx convex dev --typecheck=disable
```

**Wait for**: `✔ Convex functions ready!`

This will:

- Start the Convex backend
- Install the Agent component
- Deploy your schema and functions
- Add `NEXT_PUBLIC_CONVEX_URL` to `.env.local`

###Step 2: Set OpenAI Key (One Time Only)

```bash
npx convex env set OPENAI_API_KEY sk-your-openai-api-key-here
```

### Step 3: Start Next.js (Terminal 2 - New Tab)

```bash
npm run dev
```

### Step 4: Visit the App

Open: **http://localhost:3000/explore**

1. Sign in with Clerk
2. Click "Start New Conversation"
3. Ask: "What memories do I have?"

## ✅ That's It!

Your AI chat is now running.

## 🔧 One-Time Setup (If Not Done)

### Configure Clerk JWT

1. Go to https://dashboard.clerk.com
2. **JWT Templates** → **+ New template**
3. Name: `convex`
4. Add claim:
   ```json
   {
     "sub": "{{user.id}}"
   }
   ```
5. Save

## 📝 Ongoing Development

**Always run both terminals:**

```bash
# Terminal 1 - Keep this running
npx convex dev --typecheck=disable

# Terminal 2 - Keep this running
npm run dev
```

## 🐛 Problems?

See `TROUBLESHOOTING.md` or:

- Check both terminals are running
- Verify `NEXT_PUBLIC_CONVEX_URL` in `.env.local`
- Check OpenAI key: `npx convex env get OPENAI_API_KEY`
- Restart both terminals if needed

## 📚 More Info

- **Quick Setup**: `QUICK_START.md`
- **Full Guide**: `CONVEX_SETUP.md`
- **Features**: `AI_CHAT_README.md`
- **Troubleshooting**: `TROUBLESHOOTING.md`

---

**Questions?** Check `TROUBLESHOOTING.md` first!
