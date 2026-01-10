# Deployment Instructions for send-invitation Edge Function

## Quick Deploy via Supabase Dashboard

### Step 1: Create/Update the Function
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Edge Functions** in the left sidebar
4. Click **Create a new function** (or edit existing `send-invitation` if it exists)
5. Name: `send-invitation`
6. Copy and paste the code from `supabase/functions/send-invitation/index.ts`

### Step 2: Set the Secret
1. Go to **Project Settings** → **Edge Functions** → **Secrets**
2. Click **Add new secret** (or edit if it exists)
3. **Key**: `RESEND_API_KEY`
4. **Value**: `re_MZw6yjSq_RSLPvFcsiGXgozV3hUmLAino`
5. Click **Save**

### Step 3: Deploy
1. In the Edge Function editor, click **Deploy** button
2. Wait for deployment to complete (you'll see a success message)

### Step 4: Test
1. Go to **Edge Functions** → `send-invitation` → **Invoke**
2. Use this test payload:
```json
{
  "name": "Test User",
  "email": "test@example.com"
}
```
3. Check the response - should return `{"success": true, ...}`

## Alternative: Deploy via CLI

If you prefer using the CLI:

```bash
# 1. Login to Supabase
supabase login

# 2. Link your project (if not already linked)
supabase link --project-ref your-project-ref

# 3. Set the secret
supabase secrets set RESEND_API_KEY=re_MZw6yjSq_RSLPvFcsiGXgozV3hUmLAino

# 4. Deploy the function
supabase functions deploy send-invitation
```

## Verify Deployment

After deploying, test the invitation form on your landing page:
1. Go to your app's landing page
2. Fill in the invitation form
3. Submit and check for success message
4. Check Supabase Dashboard → Edge Functions → Logs for any errors

