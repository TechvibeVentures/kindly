-- Cleanup profiles table: Consolidate name fields and birthdate fields
-- Migration: 20260111000000_cleanup_profiles_table.sql

-- Step 1: Add first_name column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'first_name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN first_name TEXT;
    RAISE NOTICE 'first_name column added';
  ELSE
    RAISE NOTICE 'first_name column already exists';
  END IF;
END $$;

-- Step 2: Migrate data from full_name/display_name to first_name (if those columns exist)
-- Skip this step if columns don't exist (they may have already been removed)
DO $$
DECLARE
  has_full_name BOOLEAN;
  has_display_name BOOLEAN;
BEGIN
  -- Check if columns exist
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'full_name'
  ) INTO has_full_name;
  
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'display_name'
  ) INTO has_display_name;
  
  -- Only migrate if at least one of the columns exists
  IF has_full_name OR has_display_name THEN
    IF has_full_name AND has_display_name THEN
      -- Both columns exist
      UPDATE public.profiles
      SET first_name = CASE
        WHEN first_name IS NULL OR first_name = '' THEN
          COALESCE(
            NULLIF(SPLIT_PART(COALESCE(full_name, display_name, ''), ' ', 1), ''),
            full_name,
            display_name,
            ''
          )
        ELSE first_name
      END
      WHERE first_name IS NULL OR first_name = '';
    ELSIF has_full_name THEN
      -- Only full_name exists
      UPDATE public.profiles
      SET first_name = CASE
        WHEN first_name IS NULL OR first_name = '' THEN
          COALESCE(
            NULLIF(SPLIT_PART(full_name, ' ', 1), ''),
            full_name,
            ''
          )
        ELSE first_name
      END
      WHERE first_name IS NULL OR first_name = '';
    ELSIF has_display_name THEN
      -- Only display_name exists
      UPDATE public.profiles
      SET first_name = CASE
        WHEN first_name IS NULL OR first_name = '' THEN
          COALESCE(
            NULLIF(SPLIT_PART(display_name, ' ', 1), ''),
            display_name,
            ''
          )
        ELSE first_name
      END
      WHERE first_name IS NULL OR first_name = '';
    END IF;
  END IF;
END $$;

-- Step 3: Add birth_date column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'birth_date'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN birth_date DATE;
    RAISE NOTICE 'birth_date column added';
  ELSE
    RAISE NOTICE 'birth_date column already exists';
  END IF;
END $$;

-- Step 4: Migrate birth_year to birth_date if birth_date is null (if birth_year column exists)
-- Skip this step if birth_year column doesn't exist (it may have already been removed)
DO $$
DECLARE
  has_birth_year BOOLEAN;
  sql_text TEXT;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'birth_year'
  ) INTO has_birth_year;
  
  IF has_birth_year THEN
    -- Build and execute dynamic SQL to migrate birth_year to birth_date
    sql_text := '
      UPDATE public.profiles
      SET birth_date = CASE
        WHEN birth_date IS NULL AND birth_year IS NOT NULL THEN
          MAKE_DATE(birth_year, 1, 1)
        ELSE birth_date
      END
      WHERE birth_date IS NULL AND birth_year IS NOT NULL
    ';
    EXECUTE sql_text;
  END IF;
END $$;

-- Step 5: Ensure all profiles have a first_name (set default if missing)
UPDATE public.profiles
SET first_name = 'User'
WHERE first_name IS NULL OR first_name = '';

-- Step 6: Drop redundant columns (we'll keep them for now but mark as deprecated)
-- Actually, let's keep display_name and full_name for backward compatibility but make first_name primary
-- And keep birth_year for backward compatibility but make birth_date primary

-- Step 7: Add comments to clarify field usage
COMMENT ON COLUMN public.profiles.first_name IS 'Primary name field - user first name (from onboarding)';
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'display_name') THEN
    EXECUTE 'COMMENT ON COLUMN public.profiles.display_name IS ''Deprecated - use first_name instead. Kept for backward compatibility.''';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'full_name') THEN
    EXECUTE 'COMMENT ON COLUMN public.profiles.full_name IS ''Deprecated - use first_name instead. Kept for backward compatibility.''';
  END IF;
END $$;
COMMENT ON COLUMN public.profiles.birth_date IS 'Primary birthdate field - full date (YYYY-MM-DD format)';
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'birth_year') THEN
    EXECUTE 'COMMENT ON COLUMN public.profiles.birth_year IS ''Deprecated - use birth_date instead. Kept for backward compatibility.''';
  END IF;
END $$;

-- Step 8: Create index on first_name for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_first_name ON public.profiles(first_name);
CREATE INDEX IF NOT EXISTS idx_profiles_birth_date ON public.profiles(birth_date);

