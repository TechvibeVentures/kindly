-- Immediate workaround: Force PostgREST to validate against actual schema
-- This creates a dummy function that PostgREST will cache, forcing it to check the real schema

-- Step 1: Create a function that references only the correct columns
CREATE OR REPLACE FUNCTION public._force_pgrst_schema_check()
RETURNS TABLE(birth_date DATE, first_name TEXT)
LANGUAGE sql
STABLE
AS $$
  SELECT birth_date, first_name 
  FROM public.profiles 
  LIMIT 0;
$$;

-- Step 2: Call it to force PostgREST to process it
SELECT * FROM public._force_pgrst_schema_check();

-- Step 3: Drop it (cleanup)
DROP FUNCTION IF EXISTS public._force_pgrst_schema_check();

-- This should force PostgREST to reload its cache
-- If it still doesn't work, you'll need to restart the project or contact support

