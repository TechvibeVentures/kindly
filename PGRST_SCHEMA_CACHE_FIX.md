# PostgREST Schema Cache Issue - Fix Instructions

## Problem
PostgREST's schema cache still references the removed `birth_year` column, causing PGRST204 errors during onboarding.

## Root Cause
PostgREST caches the database schema for performance. When we removed `birth_year` from the `profiles` table, PostgREST's cache didn't automatically refresh, so it still expects the column to exist.

## What We've Done

### ✅ Code Fixes
1. **Replaced `select('*')` with explicit column lists** in `src/lib/db/profiles.ts`
   - This bypasses schema cache issues when expanding `*`
   - Uses `PROFILE_COLUMNS` constant for maintainability

2. **Verified onboarding code** uses `birth_date` correctly (not `birth_year`)

### ✅ Database Migrations
1. **20260115000000_force_reload_schema_cache.sql** - Validates schema state
2. **20260115000001_setup_auto_schema_reload.sql** - Sets up event trigger for future schema changes
3. **20260115000002_force_schema_refresh.sql** - Attempts to force cache refresh via view creation

## Solution Steps (In Order)

### Step 1: Apply All Migrations
Run these migrations in your Supabase SQL Editor (in order):
1. `20260115000000_force_reload_schema_cache.sql`
2. `20260115000001_setup_auto_schema_reload.sql`
3. `20260115000002_force_schema_refresh.sql`
4. `20260115000003_immediate_cache_workaround.sql` (new - try this first!)

### Step 2: Try the Immediate Workaround
Run `20260115000003_immediate_cache_workaround.sql` - this creates a function that forces PostgREST to validate against the actual schema.

### Step 3: Restart Supabase Project (RECOMMENDED - Fastest Solution)
If you have access to restart your Supabase project:
- Go to your Supabase dashboard
- Settings → General
- Restart the project (this will force PostgREST to reload its schema cache)

### Step 4: Contact Supabase Support (If Still Not Working)
If the issue persists after waiting and/or restarting:
1. Open a support ticket with Supabase
2. Mention: "PGRST204 error - PostgREST schema cache needs manual refresh after removing `birth_year` column"
3. Provide your project ID/reference

## Why This Happens
In Supabase cloud, PostgREST's schema cache refresh mechanism (`NOTIFY pgrst`) may not work the same way as in self-hosted instances. The cache refresh is handled by Supabase's infrastructure and may require:
- Time to propagate (automatic)
- Project restart (manual)
- Support intervention (if persistent)

## Prevention
The event trigger we created (`pgrst_watch`) will automatically reload the schema cache whenever future DDL changes occur, preventing this issue from happening again.

## Verification
To verify the fix worked, check:
- ✅ Onboarding completes without PGRST204 errors
- ✅ No references to `birth_year` in console logs
- ✅ Profile data uses `birth_date` correctly

