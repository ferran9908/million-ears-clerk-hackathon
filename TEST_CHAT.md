# 🧪 Test Your AI Chat

## ✅ Quick Test (2 minutes)

### 1. Make sure both servers are running

**Terminal 1:**

```bash
npx convex dev --typecheck=disable
```

Wait for: `✔ Convex functions ready!`

**Terminal 2:**

```bash
npm run dev
```

### 2. Open the chat page

Visit: **http://localhost:3000/explore**

### 3. Sign in

Use your Clerk account to sign in.

### 4. Create a conversation

Click the **"Start New Conversation"** button.

### 5. Test the chat

Try these test messages:

**Test 1: Basic Response**

```
Hello! Can you hear me?
```

Expected: AI responds with a greeting

**Test 2: Check for Memories**

```
What memories do I have recorded?
```

Expected: AI says you don't have any memories yet (unless you've recorded some)

**Test 3: Streaming Test**

```
Tell me a short story about family memories.
```

Expected: AI responds with text streaming in real-time (word by word)

### 6. Test Chat History

1. Click **"New Chat"** to create another conversation
2. Send a different message
3. Click **"History"** button
4. You should see both conversations listed
5. Click on the first conversation
6. You should see your previous messages

## ✅ Success Checklist

- [ ] Page loads without errors
- [ ] Can sign in with Clerk
- [ ] Can create a new conversation
- [ ] Can send messages
- [ ] AI responds with streaming text
- [ ] Can view chat history
- [ ] Can switch between conversations

## 🐛 If Something Doesn't Work

### Error: "Not authenticated"

- **Fix**: Sign in with Clerk
- Check that Clerk JWT template "convex" exists

### Error: "Server Error" or component not found

- **Fix**: Make sure Convex dev server is running
- Check Terminal 1 for `✔ Convex functions ready!`
- Restart with: `npx convex dev --typecheck=disable`

### AI doesn't respond

- **Fix**: Check OpenAI key is set
  ```bash
  npx convex env get OPENAI_API_KEY
  ```
- If not set:
  ```bash
  npx convex env set OPENAI_API_KEY sk-your-key
  ```

### No chat history shows up

- **Fix**: This is normal if you just created your first conversation
- Create 2-3 conversations and they'll appear

### Text doesn't stream smoothly

- **Fix**: This is expected on first message (cold start)
- Subsequent messages should stream smoothly

## 🎯 Next Steps

Once basic chat works:

1. **Connect Create Page**

   - See `CREATE_PAGE_INTEGRATION.md`
   - Record a memory via phone call
   - Ask the AI about it

2. **Customize AI Responses**

   - Edit `convex/chat.ts`
   - Change the system prompt
   - Adjust streaming settings

3. **Add More Features**
   - Memory search
   - Conversation export
   - Family sharing

## 📊 What's Happening Behind the Scenes

When you send a message:

1. **Frontend** → Sends message to Convex action
2. **Convex Action** → Fetches your memories
3. **Convex Action** → Builds context with memories
4. **Convex Action** → Calls OpenAI with context
5. **OpenAI** → Streams response tokens
6. **Convex** → Saves chunks to database (every 100ms)
7. **Frontend** → Subscribes to new chunks
8. **UI** → Displays streaming text with smooth animation

## 🎨 Visual Test

You should see:

```
┌─────────────────────────────────────────┐
│ Memory Explorer      [New Chat] [History]│
├─────────────────────────────────────────┤
│  👤 You                                  │
│  Hello! Can you hear me?                │
├─────────────────────────────────────────┤
│  🤖 AI Assistant          ● streaming   │
│  Hello! Yes, I can hear you...          │
├─────────────────────────────────────────┤
│  [Ask about your family memories...] [📤]│
└─────────────────────────────────────────┘
```

The **● streaming** indicator appears while AI is responding.

## 🔍 Advanced Testing

### Test Memory Context

1. Add a test memory (manually in Convex dashboard or via create page)
2. Ask: "What memories do I have?"
3. AI should reference your specific memory
4. Ask follow-up questions about it

### Test Concurrent Sessions

1. Open `/explore` in two different browser tabs
2. Create different conversations in each
3. Both should work independently
4. History should show all conversations

### Test Mobile

1. Open on mobile device (or resize browser)
2. UI should be responsive
3. Chat should work the same way

## 📞 Support

If tests fail:

1. Check `TROUBLESHOOTING.md`
2. Review error messages in browser console (F12)
3. Check both terminal outputs
4. Verify all environment variables are set

---

**Happy Testing!** 🎉

If all tests pass, your AI chat is fully functional and ready to use!
