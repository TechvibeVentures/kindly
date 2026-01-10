# Troubleshooting Edge Function Email Issues

## Issue: 401 Unauthorized Error

If you're seeing a 401 error when calling the `send-admin-invitation` function, check the following:

### 1. Verify RESEND_API_KEY Secret is Set

1. Go to Supabase Dashboard → **Edge Functions** → **Secrets**
2. Make sure `RESEND_API_KEY` is set with your Resend API key: `re_MZw6yjSq_RSLPvFcsiGXgozV3hUmLAino`
3. If it's not set, add it:
   - Click "Add new secret"
   - Name: `RESEND_API_KEY`
   - Value: `re_MZw6yjSq_RSLPvFcsiGXgozV3hUmLAino`
   - Click "Add secret"

### 2. Verify Function Code

Make sure the function code in Supabase matches the code in `supabase/functions/send-admin-invitation/index.ts`.

### 3. Check Function Logs

1. Go to Supabase Dashboard → **Edge Functions** → **send-admin-invitation** → **Logs**
2. Look for error messages that might indicate:
   - Missing RESEND_API_KEY
   - Invalid API key format
   - Authentication issues

### 4. Verify User is Admin

The function requires admin access. Make sure:
- The user calling the function has an admin role in the `user_roles` table
- The user is properly authenticated

### 5. Test the Function

You can test the function directly in Supabase:
1. Go to **Edge Functions** → **send-admin-invitation** → **Test**
2. Use this test payload:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "code": "TEST123",
  "invitationLink": "https://getkindly.ch/auth?invite=TEST123"
}
```

### Common Issues

1. **401 Unauthorized**: Usually means the RESEND_API_KEY secret is not set or the user is not authenticated
2. **500 Internal Server Error**: Check the function logs for details
3. **Email not sending**: Verify the Resend API key is valid and has proper permissions

### Environment Variables Needed

The function requires these environment variables (set as secrets in Supabase):
- `RESEND_API_KEY`: Your Resend API key
- `SUPABASE_URL`: Automatically available in Supabase Edge Functions
- `SUPABASE_SERVICE_ROLE_KEY`: Automatically available in Supabase Edge Functions

