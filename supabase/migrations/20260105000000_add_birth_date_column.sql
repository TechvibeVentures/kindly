-- Add birth_date column to profiles table
-- This column stores the full birthdate (YYYY-MM-DD format) in addition to birth_year
-- Migration: 20260105000000_add_birth_date_column.sql

-- Check if column exists before adding (safety check)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'birth_date'
  ) THEN
    ALTER TABLE public.profiles
      ADD COLUMN birth_date DATE;
    
    -- Add comment to clarify the relationship
    COMMENT ON COLUMN public.profiles.birth_date IS 'Full birthdate (YYYY-MM-DD format). If provided, birth_year can be derived from this.';
    
    RAISE NOTICE 'birth_date column added successfully';
  ELSE
    RAISE NOTICE 'birth_date column already exists, skipping';
  END IF;
END $$;
