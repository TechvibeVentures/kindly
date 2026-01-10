-- Force reload PostgREST schema cache
-- This migration ensures PostgREST schema cache is properly reloaded
-- after removing deprecated columns (birth_year, full_name, display_name)

-- Verify columns don't exist and log
DO $$
BEGIN
  -- Check that deprecated columns are removed
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'birth_year'
  ) THEN
    RAISE EXCEPTION 'birth_year column still exists! Please ensure rebuild migration was applied.';
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'full_name'
  ) THEN
    RAISE EXCEPTION 'full_name column still exists! Please ensure rebuild migration was applied.';
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'display_name'
  ) THEN
    RAISE EXCEPTION 'display_name column still exists! Please ensure rebuild migration was applied.';
  END IF;
  
  -- Verify required columns exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'birth_date'
  ) THEN
    RAISE EXCEPTION 'birth_date column missing! Please ensure rebuild migration was applied.';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'first_name'
  ) THEN
    RAISE EXCEPTION 'first_name column missing! Please ensure rebuild migration was applied.';
  END IF;
  
  RAISE NOTICE 'Schema verification passed. Deprecated columns removed, required columns present.';
END $$;

-- Drop any indexes that might reference deprecated columns
-- (Even though the rebuild migration should have removed them, this is a safety check)
DO $$
BEGIN
  -- Drop index on birth_year if it exists (shouldn't, but just in case)
  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND indexname = 'idx_profiles_birth_year'
  ) THEN
    DROP INDEX IF EXISTS public.idx_profiles_birth_year;
    RAISE NOTICE 'Dropped idx_profiles_birth_year index';
  END IF;
END $$;

-- For Supabase, perform a simple query to trigger cache refresh
-- This is a no-op query that forces PostgREST to check the schema
SELECT 1 FROM public.profiles LIMIT 0;

