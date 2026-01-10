# Supabase Email Template Configuration

To customize the email confirmation email sent by Supabase Auth, you need to configure it in the Supabase Dashboard.

## Steps:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** > **Email Templates**
4. Select **Confirm signup** template
5. Update the template with the following:

### Subject:
```
Welcome to Kindly - Confirm your email
```

### Email Body (HTML):
```html
<h2>Welcome to Kindly!</h2>

<p>Hi there,</p>

<p>Thank you for signing up to Kindly! We're excited to have you join our community of Founding Co-Parent Candidates.</p>

<p>To get started, please confirm your email address by clicking the button below:</p>

<p><a href="{{ .ConfirmationURL }}">Confirm Email Address</a></p>

<p>Or copy and paste this link into your browser:</p>
<p>{{ .ConfirmationURL }}</p>

<p>Once confirmed, you'll be able to complete your profile and start exploring potential co-parenting matches.</p>

<p>If you didn't sign up for Kindly, you can safely ignore this email.</p>

<p>Warm regards,<br>
<strong>The Kindly Team</strong></p>
```

### Redirect URL:
Make sure the redirect URL in Supabase Auth settings points to:
```
https://getkindly.ch/auth
```

This will ensure that when users click the confirmation link, they're redirected to the login page with their email prefilled.

## Notes:
- The `{{ .ConfirmationURL }}` variable is automatically replaced by Supabase with the actual confirmation link
- The redirect URL should match your production domain
- You can customize the styling further if needed

