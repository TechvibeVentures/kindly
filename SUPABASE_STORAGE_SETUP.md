# Supabase Storage Setup for Avatars

This guide explains how to set up the `avatars` storage bucket in Supabase for profile photo uploads.

## Option 1: Using Supabase Dashboard (Easiest)

### Step 1: Create the Bucket

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"** button
4. Enter bucket name: `avatars`
5. **Important**: Check the **"Public bucket"** checkbox to make it publicly accessible
6. Click **"Create bucket"**

### Step 2: Set Up RLS Policies

1. After creating the bucket, click on the `avatars` bucket name
2. Go to the **"Policies"** tab
3. Click **"New Policy"**

#### Policy 1: Allow authenticated users to upload

1. Click **"Create policy"** or **"New policy"**
2. Choose **"For full customization"**
3. Policy name: `Users can upload their own avatars`
4. Allowed operation: **INSERT**
5. Target roles: **authenticated**
6. Policy definition (SQL):
   ```sql
   (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
   ```
7. Click **"Review"** then **"Save policy"**

#### Policy 2: Allow public read access

1. Click **"New policy"** again
2. Choose **"For full customization"**
3. Policy name: `Public avatar access`
4. Allowed operation: **SELECT**
5. Target roles: **public**
6. Policy definition (SQL):
   ```sql
   (bucket_id = 'avatars')
   ```
7. Click **"Review"** then **"Save policy"**

#### Policy 3: Allow users to update/delete their own avatars

1. Click **"New policy"** again
2. Choose **"For full customization"**
3. Policy name: `Users can update their own avatars`
4. Allowed operation: **UPDATE**
5. Target roles: **authenticated**
6. Policy definition (SQL):
   ```sql
   (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
   ```
7. Click **"Review"** then **"Save policy"**

8. Repeat for **DELETE** operation:
   - Policy name: `Users can delete their own avatars`
   - Allowed operation: **DELETE**
   - Target roles: **authenticated**
   - Policy definition (SQL):
     ```sql
     (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
     ```

## Option 2: Using SQL Editor (Faster)

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **"New query"**
3. Paste the following SQL and run it:

```sql
-- Create the avatars bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy 1: Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Allow public read access to avatars
CREATE POLICY "Public avatar access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Policy 3: Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

## Verify Setup

After setting up, you can verify by:

1. Going to **Storage** → **avatars** bucket
2. Checking that the bucket shows as **Public**
3. Going to **Storage** → **avatars** → **Policies** tab
4. Verifying you see 4 policies:
   - Users can upload their own avatars (INSERT)
   - Public avatar access (SELECT)
   - Users can update their own avatars (UPDATE)
   - Users can delete their own avatars (DELETE)

## How It Works

- **Folder structure**: Files are stored as `avatars/{userId}/{timestamp}.{ext}`
- **Security**: Users can only upload/update/delete files in their own folder (identified by their user ID)
- **Public access**: Anyone can view/download avatar images (needed for displaying profiles)
- **Authentication**: Only authenticated users can upload/modify files

## Troubleshooting

If uploads fail:

1. Check that the bucket exists and is public
2. Verify RLS policies are active (should show green checkmarks)
3. Check browser console for specific error messages
4. Ensure the user is authenticated (logged in)
5. Verify the file path matches the pattern: `avatars/{userId}/...`


