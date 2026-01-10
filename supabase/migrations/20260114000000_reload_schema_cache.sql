-- Reload PostgREST schema cache
-- This forces PostgREST to reload its schema cache after schema changes
NOTIFY pgrst, 'reload schema';

-- Verify deprecated columns don't exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name IN ('birth_year', 'full_name', 'display_name')
  ) THEN
    RAISE EXCEPTION 'Deprecated columns still exist! Please run the rebuild migration first.';
  ELSE
    RAISE NOTICE 'Deprecated columns successfully removed.';
  END IF;
END $$;

