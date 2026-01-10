# Setting Up New Supabase Project

## Step 1: Update Configuration Files

### Update `.env.local` (or `.env`)
Make sure it contains:
```env
VITE_SUPABASE_URL="https://your-new-project-id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-public-key"
VITE_SUPABASE_PROJECT_ID="your-new-project-id"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### Update `supabase/config.toml`
Change the project_id to match your new project:
```toml
project_id = "your-new-project-id"
```

## Step 2: Run Database Migrations

Apply the database schema to your new project:

```bash
# Option 1: Using Supabase CLI (if linked)
supabase db push

# Option 2: Manual via Supabase Dashboard
# Go to SQL Editor and run the migration files:
# 1. supabase/migrations/20260102164153_432b30f4-af7e-4320-829c-32b5fc03ea91.sql
# 2. supabase/migrations/20260102164225_a1527de8-4013-46ca-8b07-b07413916fb2.sql
# 3. supabase/migrations/20260103100000_extend_profiles_for_candidates.sql
```

## Step 3: Migrate Mock Candidates

Transfer the mock candidate data to your database:

```bash
# Set the service role key (required to bypass RLS)
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Run the migration script
npx tsx scripts/migrate-candidates.ts
```

## Step 4: Verify Setup

1. Check Supabase Dashboard → Table Editor → `profiles` table
2. You should see 15 candidate profiles with `is_public = true`
3. Test the app - candidates should load from the database

## Troubleshooting

### Migration script fails
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Verify all migrations have been applied
- Check that the profiles table has all required columns

### No candidates showing in app
- Verify `is_public = TRUE` and `is_active = TRUE` in database
- Check browser console for errors
- Ensure `.env.local` is being loaded (Vite loads it automatically)

### Can't access Supabase project
- Verify project URL and keys are correct
- Check that you have access to the project in Supabase dashboard


