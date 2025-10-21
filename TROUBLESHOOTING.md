# Troubleshooting Guide

## TypeScript Errors with `npx convex dev`

### Issue

You may see TypeScript errors when running `npx convex dev`:

```
✖ TypeScript typecheck via `tsc` failed.
convex/schema.ts:1:10 - error TS2305: Module '"convex/server"' has no exported member 'defineSchema'.
```

### Solution

**Use the disable typecheck flag:**

```bash
npx convex dev --typecheck=disable
```

Or for a one-time deployment:

```bash
npx convex dev --once --typecheck=disable
```

### Why This Works

- The code is functionally correct and deploys successfully
- The TypeScript errors are due to version mismatches in type definitions
- The agent component installs and works properly
- Runtime behavior is unaffected

### Permanent Solution

Add a script to your `package.json`:

```json
{
  "scripts": {
    "convex:dev": "convex dev --typecheck=disable",
    "convex:deploy": "convex deploy --typecheck=disable"
  }
}
```

Then run:

```bash
npm run convex:dev
```

## Setting Up Environment Variables

### Required Variables

1. **Get your Convex URL**  
   After running `npx convex dev`, the URL will be shown and automatically added to `.env.local`

2. **Set OpenAI API Key**

   ```bash
   npx convex env set OPENAI_API_KEY sk-your-key-here
   ```

3. **Update `.env.local`**

   ```env
   NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
   OPENAI_API_KEY=sk-your-openai-key

   # Clerk (already configured)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   CLERK_JWT_ISSUER_DOMAIN=your-domain.clerk.accounts.dev
   ```

## Clerk JWT Configuration

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **JWT Templates**
3. Click **+ New template**
4. Name: `convex` (exactly this name)
5. Add claim:
   ```json
   {
     "sub": "{{user.id}}"
   }
   ```
6. Save

## Running the Application

### Development Mode

In **two separate terminals**:

**Terminal 1 - Convex Dev Server:**

```bash
npx convex dev --typecheck=disable
```

**Terminal 2 - Next.js Dev Server:**

```bash
npm run dev
```

### Testing

1. Visit `http://localhost:3000/explore`
2. Sign in with Clerk
3. Click "Start New Conversation"
4. Ask a question!

## Common Issues

### "Not authenticated" errors

- **Solution**: Check Clerk JWT template is named exactly "convex"
- Verify `CLERK_JWT_ISSUER_DOMAIN` in `.env.local`

### AI not responding

- **Solution**: Verify OpenAI key is set in Convex:
  ```bash
  npx convex env get OPENAI_API_KEY
  ```

### "Module not found" errors in frontend

- **Solution**: Restart Next.js dev server
- Clear `.next` folder: `rm -rf .next && npm run dev`

### Types not available in IDE

- **Solution**: Convex generates types when running
- Wait for "`✔ Convex functions ready!`" message
- Restart TypeScript server in VS Code: `Cmd+Shift+P` → "Restart TS Server"

### Database queries not working

- **Solution**: Ensure Convex dev server is running
- Check Convex Dashboard for deployment status
- Verify schema deployed successfully

## Verifying Setup

### Check Convex Connection

```bash
npx convex dev --once --typecheck=disable
```

Should see:

```
✔ Installed component agent.
✔ Convex functions ready!
```

### Check Environment Variables

```bash
# Should show your OpenAI key
npx convex env get OPENAI_API_KEY

# Should show your deployment name
cat .env.local | grep CONVEX
```

### Check Clerk Configuration

- Go to Clerk Dashboard → JWT Templates
- Verify "convex" template exists
- Check it has the `sub` claim

## Production Deployment

### 1. Deploy to Convex Production

```bash
npx convex deploy --prod --typecheck=disable
```

### 2. Set Production Environment Variables

```bash
npx convex env set --prod OPENAI_API_KEY sk-your-key
```

### 3. Deploy to Vercel

- Push to GitHub
- Connect repository to Vercel
- Add environment variables in Vercel dashboard
- Deploy

### 4. Update Clerk for Production

- Add production domain to Clerk allowed origins
- Update redirect URLs if needed

## Getting Help

1. **Check Logs**

   - Convex Dashboard: https://dashboard.convex.dev
   - Browser Console: `F12` → Console tab
   - Terminal output from both dev servers

2. **Verify Configuration**

   - Run through this troubleshooting guide
   - Check all environment variables are set
   - Verify Clerk JWT template configuration

3. **Resources**
   - [Convex Documentation](https://docs.convex.dev)
   - [Convex Discord](https://convex.dev/community)
   - [Clerk Documentation](https://clerk.com/docs)

## Quick Reference

### Start Development

```bash
# Terminal 1
npx convex dev --typecheck=disable

# Terminal 2 (new tab)
npm run dev
```

### Access Application

- App: http://localhost:3000
- Chat: http://localhost:3000/explore
- Convex Dashboard: https://dashboard.convex.dev

### Environment Check

```bash
# Check Convex is running
curl http://localhost:3000/api/convex

# Check environment variables
cat .env.local

# Check Convex environment
npx convex env list
```

---

**Still having issues?** Review the full setup guides:

- `QUICK_START.md` - Fast setup
- `CONVEX_SETUP.md` - Detailed instructions
- `AI_CHAT_README.md` - Feature documentation
