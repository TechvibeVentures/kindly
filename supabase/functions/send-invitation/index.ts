import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
// In Supabase Edge Functions, SUPABASE_URL is automatically available
// For the service role key, we'll use a custom secret name that you can set
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("SUPABASE_PROJECT_URL") ?? "";
// Try custom secret first, then fall back to reserved one (which might be outdated)
const supabaseServiceKey = Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

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
      from: "Kindly <kindly@impactfuel.ch>",
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

    // Store request in database using REST API directly
    // Note: Supabase has a reserved SUPABASE_SERVICE_ROLE_KEY secret, but it might be outdated
    // We'll try the reserved one first, but log if there are issues
    try {
      // Try multiple ways to get the Supabase URL
      const projectRef = Deno.env.get("SUPABASE_PROJECT_REF") ?? "tihsuwdvmwmgzjrelepr";
      const finalSupabaseUrl = supabaseUrl || 
        Deno.env.get("SUPABASE_PROJECT_URL") || 
        `https://${projectRef}.supabase.co`;
      
      // Get service role key - try the reserved secret first
      // If it doesn't work, you'll need to update it manually in Edge Functions > Secrets
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
      
      console.log('=== Database Insert Attempt ===');
      console.log('Supabase URL:', finalSupabaseUrl);
      console.log('Service key available:', !!serviceKey);
      console.log('Service key length:', serviceKey.length);
      console.log('Project ref:', projectRef);
      
      if (!serviceKey) {
        console.error('Service role key is missing!');
        console.error('Please add a custom secret in Supabase Dashboard:');
        console.error('1. Go to Edge Functions > Secrets');
        console.error('2. Click "Add another" or use the "ADD OR REPLACE SECRETS" section');
        console.error('3. Name: SERVICE_ROLE_KEY');
        console.error('4. Value: Copy the "service_role secret" from Settings > API Keys');
        console.error('5. Click Save');
      } else {
        console.log('Inserting into invitation_requests table...');
        const insertResponse = await fetch(`${finalSupabaseUrl}/rest/v1/invitation_requests`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            status: 'pending'
          })
        });

        console.log('Insert response status:', insertResponse.status);
        console.log('Insert response headers:', Object.fromEntries(insertResponse.headers.entries()));
        
        if (!insertResponse.ok) {
          const errorText = await insertResponse.text();
          console.error('Failed to store invitation request');
          console.error('Status:', insertResponse.status);
          console.error('Status text:', insertResponse.statusText);
          console.error('Error response:', errorText);
          
          // If we get a 401 or 403, the service key might be wrong
          if (insertResponse.status === 401 || insertResponse.status === 403) {
            console.error('⚠️ Authentication failed - the service role key might be incorrect');
            console.error('Please add/update SERVICE_ROLE_KEY secret in Edge Functions > Secrets');
            console.error('Use the "service_role secret" from Settings > API Keys');
          }
        } else {
          const insertedData = await insertResponse.json();
          console.log('✓ Successfully stored invitation request');
          console.log('Inserted data:', JSON.stringify(insertedData, null, 2));
        }
      }
    } catch (dbError) {
      console.error('Exception storing invitation request:', dbError);
      console.error('Exception type:', typeof dbError);
      console.error('Exception details:', dbError instanceof Error ? dbError.message : String(dbError));
      if (dbError instanceof Error && dbError.stack) {
        console.error('Stack trace:', dbError.stack);
      }
      // Continue even if database insert fails - still send emails
    }

    // Send notification email to admin (non-blocking - log errors but don't fail)
    let adminEmailResponse = null;
    let adminEmailError = null;
    try {
      adminEmailResponse = await sendEmail(
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
    } catch (emailError: any) {
      adminEmailError = emailError.message || String(emailError);
      console.error("Failed to send admin notification email:", adminEmailError);
      // Don't fail the request - database insert succeeded
    }

    // Send confirmation email to the applicant (non-blocking - log errors but don't fail)
    let confirmationEmailResponse = null;
    let confirmationEmailError = null;
    try {
      confirmationEmailResponse = await sendEmail(
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
    } catch (emailError: any) {
      confirmationEmailError = emailError.message || String(emailError);
      console.error("Failed to send confirmation email:", confirmationEmailError);
      // Don't fail the request - database insert succeeded
    }

    // Return success even if emails failed (database insert succeeded)
    return new Response(
      JSON.stringify({ 
        success: true,
        databaseStored: true,
        adminEmail: adminEmailResponse || null,
        adminEmailError: adminEmailError || null,
        confirmationEmail: confirmationEmailResponse || null,
        confirmationEmailError: confirmationEmailError || null,
        message: adminEmailError || confirmationEmailError 
          ? "Request stored successfully, but some emails could not be sent. Please verify your email domain in Resend."
          : "Request stored and emails sent successfully"
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
