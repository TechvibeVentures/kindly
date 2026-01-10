# Deploy Admin Invitation Email Function

## Steps to Deploy

1. **Go to Supabase Dashboard** → **Edge Functions** → **Create a new function**
2. **Name it:** `send-admin-invitation`
3. **Copy and paste the code from:** `supabase/functions/send-admin-invitation/index.ts`

## Code to Copy:

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AdminInvitationRequest {
  name: string | null;
  email: string | null;
  code: string;
  invitationLink: string;
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

    const { name, email, code, invitationLink }: AdminInvitationRequest = await req.json();
    
    // Validate that we have at least email or name
    if (!email && !name) {
      return new Response(
        JSON.stringify({ error: "Email or name is required to send invitation" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // If email is provided, validate format
    if (email) {
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
    }

    console.log(`Sending admin invitation: ${name || 'No name'} (${email || 'No email'}) - Code: ${code}`);

    // Only send email if email is provided
    if (email) {
      const recipientName = name || 'there';
      
      const invitationEmailHtml = `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px;">Hi ${recipientName},</h1>
          
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            You've been invited to join Kindly as a Founding Co-Parent Candidate!
          </p>
          
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            As one of our first 200 founding members, you'll receive exclusive early access and 
            personalized guidance from our founders.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${invitationLink}" 
               style="display: inline-block; background-color: #6366f1; color: white; padding: 16px 32px; 
                      text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Accept Invitation
            </a>
          </div>
          
          <p style="color: #4a4a4a; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            Or copy and paste this link into your browser:<br>
            <a href="${invitationLink}" style="color: #6366f1; word-break: break-all;">${invitationLink}</a>
          </p>
          
          <p style="color: #4a4a4a; font-size: 14px; line-height: 1.6; margin-top: 20px;">
            <strong>Invitation Code:</strong> ${code}
          </p>
          
          <p style="color: #4a4a4a; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            This invitation is valid for 30 days. If you have any questions, feel free to reach out to us.
          </p>
          
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-top: 30px;">
            Warm regards,<br>
            <strong>The Kindly Team</strong>
          </p>
        </div>
      `;

      const emailResponse = await sendEmail(
        [email],
        "Your Kindly Invitation",
        invitationEmailHtml
      );

      console.log("Invitation email sent:", emailResponse);

      return new Response(
        JSON.stringify({ 
          success: true, 
          emailSent: true,
          emailResponse
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else {
      // No email provided, just return success (invitation created but no email sent)
      return new Response(
        JSON.stringify({ 
          success: true, 
          emailSent: false,
          message: "Invitation created but no email sent (no email provided)"
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error: any) {
    console.error("Error in send-admin-invitation function:", error);
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

4. **Set the RESEND_API_KEY secret** (same as used for `send-invitation` function):
   - Go to **Edge Functions** → **Settings** → **Secrets**
   - Add/Update: `RESEND_API_KEY` = `re_MZw6yjSq_RSLPvFcsiGXgozV3hUmLAino`

5. **Deploy the function**

## What This Does

- When an admin creates an invitation with an email address, it automatically sends a beautiful invitation email
- The email includes:
  - Personalized greeting
  - Invitation link (clickable button)
  - Invitation code
  - Expiration information
- If no email is provided, the invitation is still created but no email is sent

