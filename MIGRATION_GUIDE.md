# Migration Guide: Mock Data to Database

This guide explains how to migrate mock candidate data to the database.

## Overview

All mock candidate profiles have been moved from hardcoded data files to the Supabase database. The application now fetches candidate profiles from the database instead of using static mock data.

## Steps to Migrate Mock Candidates

### 1. Run Database Migration

First, apply the database migration to extend the profiles table:

```bash
# If using Supabase CLI locally
supabase db push

# Or apply the migration manually via Supabase dashboard
# File: supabase/migrations/20260103100000_extend_profiles_for_candidates.sql
```

### 2. Run Migration Script

Transfer the mock candidates to the database:

```bash
# Install dependencies if needed
npm install tsx dotenv

# Set environment variable for service role key (required to bypass RLS)
export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Run migration script
npx tsx scripts/migrate-candidates.ts
```

**Note:** You need the Supabase Service Role Key (not the anon key) to run the migration script. This key can be found in your Supabase project settings under API.

### 3. Verify Migration

After running the migration, verify that candidates are in the database:

```sql
-- Check count
SELECT COUNT(*) FROM profiles WHERE is_public = TRUE;

-- View sample candidates
SELECT display_name, city, country, is_public FROM profiles WHERE is_public = TRUE LIMIT 5;
```

## What Changed

### Database Schema

The `profiles` table has been extended with:
- All candidate-specific fields (age, gender, city, country, etc.)
- Lifestyle fields (smoking, alcohol, exercise, diet, etc.)
- Co-parenting preferences (involvement, preferred_method, etc.)
- Profile visibility flags (`is_public`, `is_active`)

### Code Changes

1. **AppContext** - Now fetches candidates from database using `useCandidates()` hook
2. **Components** - Updated to use database candidates instead of mock data
3. **Candidate Mapper** - Utility to convert database profiles to Candidate interface format
4. **Label Constants** - Moved to `src/lib/utils/candidateLabels.ts` for reuse

### Files Modified

- `src/contexts/AppContext.tsx` - Fetches from database
- `src/components/CandidateCard.tsx` - Uses database candidates
- `src/pages/CandidateDetail.tsx` - Uses database candidates
- `src/pages/Shortlist.tsx` - Uses database candidates
- `src/pages/Conversations.tsx` - Uses database candidates
- `src/pages/ConversationDetail.tsx` - Uses database candidates
- `src/pages/ProfileEdit.tsx` - Updated imports
- `src/components/FilterModal.tsx` - Updated imports

### Files Created

- `supabase/migrations/20260103100000_extend_profiles_for_candidates.sql` - Database migration
- `scripts/migrate-candidates.ts` - Migration script
- `src/lib/db/candidates.ts` - Database functions for candidates
- `src/hooks/useCandidates.ts` - React Query hooks for candidates
- `src/lib/utils/candidateMapper.ts` - Profile to Candidate mapper
- `src/lib/utils/candidateLabels.ts` - Label constants

## Mock Data Files

The following files still exist but are no longer used for candidate data:
- `src/data/candidates.ts` - Contains mock candidates (kept for reference, can be removed)
- `src/data/conversations.ts` - Still used for mock conversations (not migrated yet)

## Next Steps

1. **Run the migration** to populate the database with mock candidates
2. **Test the application** to ensure candidates load from the database
3. **Remove hardcoded profile images** - Update Profile.tsx to use database photo_url
4. **Migrate conversations** - Consider moving conversations to database as well

## Troubleshooting

### No candidates showing

- Check that `is_public = TRUE` and `is_active = TRUE` in database
- Verify RLS policies allow viewing public profiles
- Check browser console for errors

### Migration script fails

- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Verify database migration has been applied
- Check that profiles table has all required columns

### Build errors

- Ensure all imports are updated to use new paths
- Check that `useCandidates` hook is properly set up
- Verify TypeScript types are correct


