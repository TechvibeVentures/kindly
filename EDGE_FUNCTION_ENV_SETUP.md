# Edge Function Environment Variables Setup

The `send-invitation` edge function needs environment variables to store invitation requests in the database.

## Required Environment Variables

You need to set these in the Supabase Dashboard:

1. Go to **Supabase Dashboard** → **Edge Functions** → **Settings**
2. Add the following secrets:

### For `send-invitation` function:

- `SUPABASE_URL`: Your Supabase project URL (e.g., `https://tihsuwdvmwmgzjrelepr.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (found in Settings → API)

## How to Find These Values

1. **SUPABASE_URL**: 
   - Go to Supabase Dashboard → Settings → API
   - Copy the "Project URL" (e.g., `https://xxxxx.supabase.co`)

2. **SUPABASE_SERVICE_ROLE_KEY**:
   - Go to Supabase Dashboard → Settings → API
   - Copy the "service_role" key (keep this secret!)
   - This key bypasses Row Level Security (RLS)

## Setting Secrets in Supabase

1. Go to **Edge Functions** → **Settings** in your Supabase Dashboard
2. Scroll to **Secrets** section
3. Click **Add Secret**
4. Add each secret:
   - Name: `SUPABASE_URL`
   - Value: Your project URL
5. Repeat for `SUPABASE_SERVICE_ROLE_KEY`

**Note**: These secrets are automatically available to all edge functions via `Deno.env.get()`, but you need to set them explicitly in the dashboard.

## Verification

After setting the secrets, test the invitation request form on the landing page. Check the edge function logs:

1. Go to **Edge Functions** → **send-invitation** → **Logs**
2. Look for log messages like:
   - "SUPABASE_URL: Set" or "SUPABASE_URL: Missing"
   - "Successfully stored invitation request" or error messages

If you see "Missing", the secrets are not set correctly.

