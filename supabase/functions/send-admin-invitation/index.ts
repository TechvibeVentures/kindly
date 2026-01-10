import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

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
  console.log("=== Function invoked ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Checking RESEND_API_KEY...");
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
    console.log("RESEND_API_KEY is configured");

    console.log("Getting Supabase environment variables...");
    // Get Supabase environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    console.log("Supabase URL:", supabaseUrl ? "Set" : "Missing");
    console.log("Service Role Key:", supabaseServiceKey ? "Set" : "Missing");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Create admin client (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get auth header from request
    console.log("Checking authorization header...");
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header present:", !!authHeader);
    if (authHeader) {
      console.log("Auth header preview:", authHeader.substring(0, 30) + "...");
    }
    
    if (!authHeader) {
      console.error("No authorization header found");
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Extract token from "Bearer <token>" format
    const tokenMatch = authHeader.match(/Bearer (.+)/);
    if (!tokenMatch || !tokenMatch[1]) {
      console.error("Invalid authorization header format:", authHeader.substring(0, 20));
      return new Response(
        JSON.stringify({ error: "Invalid authorization header format" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const token = tokenMatch[1];
    
    // Verify JWT and get user using service role key
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError) {
      console.error("JWT verification error:", authError.message, authError.status);
      return new Response(
        JSON.stringify({ 
          error: "Unauthorized", 
          details: authError.message,
          status: authError.status 
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!user) {
      console.error("No user found after JWT verification");
      return new Response(
        JSON.stringify({ error: "User not found" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Authenticated user:", user.id, user.email);

    // Check if user is admin using RPC function
    const { data: isAdmin, error: roleError } = await supabaseAdmin.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError) {
      console.error("Role check error:", roleError);
      return new Response(
        JSON.stringify({ error: "Failed to verify admin status", details: roleError.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!isAdmin) {
      console.error("User is not admin:", user.id);
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Admin verified:", user.id);

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

