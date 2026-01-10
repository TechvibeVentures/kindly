-- Add degree and field_of_study columns for education section
-- These columns are used in ProfileEdit but were missing from the schema

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS degree TEXT,
  ADD COLUMN IF NOT EXISTS field_of_study TEXT;

