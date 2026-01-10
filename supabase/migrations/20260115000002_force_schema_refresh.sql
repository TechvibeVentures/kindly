-- Force PostgREST schema cache refresh by creating and dropping a dummy object
-- This is a workaround for Supabase cloud where NOTIFY might not work

-- Step 1: Create a temporary view that PostgREST will cache
-- This forces PostgREST to reload its schema cache
CREATE OR REPLACE VIEW public._pgrst_schema_refresh AS
SELECT 
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND column_name IN ('birth_date', 'first_name');

-- Step 2: Query the view to force PostgREST to process it
SELECT * FROM public._pgrst_schema_refresh LIMIT 1;

-- Step 3: Drop the view (we don't need it anymore)
DROP VIEW IF EXISTS public._pgrst_schema_refresh;

-- Step 4: Verify birth_year doesn't exist and birth_date does
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'birth_year'
  ) THEN
    RAISE EXCEPTION 'ERROR: birth_year column still exists in the actual database schema!';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'birth_date'
  ) THEN
    RAISE EXCEPTION 'ERROR: birth_date column is missing from the database schema!';
  END IF;
  
  RAISE NOTICE 'SUCCESS: Database schema is correct (birth_date exists, birth_year does not)';
  RAISE NOTICE 'If PostgREST cache still shows errors, you may need to:';
  RAISE NOTICE '1. Wait 5-10 minutes for automatic cache refresh';
  RAISE NOTICE '2. Restart your Supabase project (if you have access)';
  RAISE NOTICE '3. Contact Supabase support to manually refresh PostgREST schema cache';
END $$;

