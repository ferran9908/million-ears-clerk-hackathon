# 🔑 OpenAI API Key Setup - REQUIRED

## ❌ Current Error

Your chat is returning empty because the **OpenAI API key is missing**:

```
AI_LoadAPIKeyError: OpenAI API key is missing
```

## ✅ How to Fix

### Step 1: Get Your OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-...`)
5. **Save it somewhere safe** - you won't be able to see it again!

### Step 2: Add to Convex Environment Variables

Run this command (replace `YOUR_KEY_HERE` with your actual key):

```bash
npx convex env set OPENAI_API_KEY sk-YOUR_ACTUAL_KEY_HERE
```

**Example:**

```bash
npx convex env set OPENAI_API_KEY sk-proj-abc123xyz789...
```

### Step 3: Verify It's Set

```bash
npx convex env list
```

You should see:

```
OPENAI_API_KEY = sk-proj-abc... (truncated for security)
```

### Step 4: Redeploy (Automatic)

The key will be available immediately. Just refresh your browser!

---

## 🔐 Security Notes

### ✅ Good Practices

- **Never** commit your API key to Git
- **Never** put it in client-side code (e.g., `.env.local` for Next.js)
- Use Convex environment variables (server-side only)
- Rotate keys regularly

### ❌ Don't Do This

```javascript
// ❌ BAD - Exposed in client code
const apiKey = "sk-proj-abc123...";
```

```javascript
// ❌ BAD - Committed to Git
// .env.local
OPENAI_API_KEY=sk-proj-abc123...
```

### ✅ Do This Instead

```bash
# ✅ GOOD - Secure, server-side only
npx convex env set OPENAI_API_KEY sk-proj-abc123...
```

---

## 💰 Cost Estimates

### Current Model: `gpt-4o-mini`

**Pricing** (as of Oct 2024):

- Input: $0.15 per 1M tokens
- Output: $0.60 per 1M tokens

**Typical Chat Message:**

- Input: ~500 tokens (context + query)
- Output: ~300 tokens (response)
- **Cost per message: ~$0.00025** (less than 1 cent!)

**For 100 users with 10 messages each:**

- Total: 1,000 messages
- Cost: ~$0.25

**Very affordable!** 💚

### If You Want to Upgrade

Change in `convex/chat.ts`:

```typescript
languageModel: openai("gpt-4o"),  // More powerful, ~10x cost
```

---

## 🧪 Test After Setup

1. **Set the key** (see Step 2 above)
2. **Refresh** your browser at `/explore`
3. **Type**: "Hello, what can you help me with?"
4. **Expected**: AI responds with a friendly greeting

---

## 🐛 Troubleshooting

### "API key is missing" (still appears)

**Solutions:**

1. Check you used the right command:
   ```bash
   npx convex env set OPENAI_API_KEY sk-proj-...
   ```
2. Verify with: `npx convex env list`
3. Wait 10 seconds for deployment to pick up the change
4. Hard refresh your browser (Cmd+Shift+R or Ctrl+Shift+R)

### "Incorrect API key provided"

- Your key is invalid or revoked
- Create a new key at https://platform.openai.com/api-keys
- Set it again with `npx convex env set`

### "Rate limit exceeded"

- You've hit OpenAI's usage limits
- Check your OpenAI dashboard
- Add payment method or wait for quota reset

### "Insufficient quota"

- Your OpenAI account needs credits
- Add payment method at https://platform.openai.com/account/billing

---

## 📋 Quick Reference

### Set Key (Dev)

```bash
npx convex env set OPENAI_API_KEY sk-proj-...
```

### Set Key (Production)

```bash
npx convex env set OPENAI_API_KEY sk-proj-... --prod
```

### List All Keys

```bash
npx convex env list
```

### Remove Key (if needed)

```bash
npx convex env unset OPENAI_API_KEY
```

---

## 🎯 Next Steps After Setup

Once your key is set:

1. ✅ Chat works immediately
2. ✅ AI can search memories with RAG
3. ✅ Streaming responses work
4. ✅ Tool calling enabled

**Go test it!** 🚀

---

## 📚 Related Docs

- **Main Setup**: `START_HERE.md`
- **RAG Tools**: `RAG_INTEGRATION_COMPLETE.md`
- **All Fixes**: `COMPLETE_FIX_GUIDE.md`
- **OpenAI Pricing**: https://openai.com/api/pricing/

---

## ⚡ TL;DR

```bash
# 1. Get key from https://platform.openai.com/api-keys
# 2. Run this:
npx convex env set OPENAI_API_KEY sk-proj-YOUR_KEY_HERE

# 3. Verify:
npx convex env list

# 4. Refresh browser and chat! 💬
```

**That's it!** Your chat will work instantly. 🎉
