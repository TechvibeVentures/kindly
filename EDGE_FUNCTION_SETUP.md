# Edge Function Setup Guide

## What to Insert into Supabase

### 1. Create the Edge Function

In your Supabase Dashboard:
1. Go to **Edge Functions** → **Create a new function**
2. Name it: `send-invitation`
3. Copy and paste the following code:

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  name: string;
  email: string;
}

async function sendEmail(to: string[], subject: string, html: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Kindly <hello@impactfuel.ch>",
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }

  return response.json();
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if RESEND_API_KEY is configured
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ 
          error: "Email service not configured. Please contact support.",
          details: "RESEND_API_KEY missing"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email }: InvitationRequest = await req.json();
    
    // Validate input
    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Processing invitation request for: ${name} (${email})`);

    // Send notification email to admin
    const adminEmailResponse = await sendEmail(
      ["info@impactfuel.ch"],
      `New Kindly Invitation Request: ${name}`,
      `
        <h1>New Founding Candidate Request</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Submitted at:</strong> ${new Date().toISOString()}</p>
      `
    );

    console.log("Admin notification sent:", adminEmailResponse);

    // Send confirmation email to the applicant
    const confirmationEmailResponse = await sendEmail(
      [email],
      "Your Kindly Invitation Request Received",
      `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px;">Hi ${name},</h1>
          
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for your interest in becoming a Founding Co-Parent Candidate with Kindly.
          </p>
          
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            We've received your request and our team will carefully review your application. 
            As one of our first 200 founding members, you'll receive exclusive early access and 
            personalized guidance from our founders.
          </p>
          
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            We'll be in touch soon with next steps.
          </p>
          
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
            Warm regards,<br>
            <strong>The Kindly Team</strong>
          </p>
        </div>
      `
    );

    console.log("Confirmation email sent:", confirmationEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmail: adminEmailResponse, 
        confirmationEmail: confirmationEmailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-invitation function:", error);
    const errorMessage = error?.message || "An unexpected error occurred";
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error?.stack || "No additional details available"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
```

### 2. Set Environment Variables (Secrets)

After creating the function, you need to set the `RESEND_API_KEY`:

**Option A: Via Supabase Dashboard**
1. Go to **Project Settings** → **Edge Functions** → **Secrets**
2. Click **Add new secret**
3. Key: `RESEND_API_KEY`
4. Value: Your Resend API key (get it from https://resend.com/api-keys)

**Option B: Via Supabase CLI**
```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
```

### 3. Configure Function Settings

In the function settings, make sure:
- **Verify JWT**: **OFF** (since this is a public form)
- **Timeout**: Default (or increase if needed)

### 4. Deploy the Function

**Via Dashboard:**
- Click **Deploy** button in the function editor

**Via CLI:**
```bash
supabase functions deploy send-invitation
```

### 5. Test the Function

You can test it directly in the Supabase Dashboard:
1. Go to **Edge Functions** → `send-invitation` → **Invoke**
2. Use this test payload:
```json
{
  "name": "Test User",
  "email": "test@example.com"
}
```

## Alternative: Using Supabase CLI (Recommended)

If you have the Supabase CLI set up, you can deploy directly from your local files:

```bash
# Make sure you're in the project root
cd /path/to/Kindly

# Deploy the function
supabase functions deploy send-invitation

# Set the secret
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
```

## Troubleshooting

### Function returns "RESEND_API_KEY missing"
- Make sure you've set the secret in Supabase Dashboard or via CLI
- The secret name must be exactly `RESEND_API_KEY`

### Function times out
- Check Resend API status
- Verify your Resend API key is valid
- Check function logs in Supabase Dashboard

### CORS errors
- The function includes CORS headers, but make sure your frontend is calling it correctly
- Check that the function URL is correct

### Email not sending
- Verify your Resend API key has permission to send emails
- Check that the "from" email (`hello@impactfuel.ch`) is verified in Resend
- Check Resend dashboard for any delivery issues

