-- Remove outdated fields that were accidentally recreated during reorder
-- These fields should not exist in the profiles table

ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS first_name,
  DROP COLUMN IF EXISTS age,
  DROP COLUMN IF EXISTS nationality,
  DROP COLUMN IF EXISTS looking_for_text,
  DROP COLUMN IF EXISTS vision,
  DROP COLUMN IF EXISTS involvement,
  DROP COLUMN IF EXISTS involvement_flexibility,
  DROP COLUMN IF EXISTS parenting_status,
  DROP COLUMN IF EXISTS occupation,
  DROP COLUMN IF EXISTS family_support,
  DROP COLUMN IF EXISTS preferred_method,
  DROP COLUMN IF EXISTS compatibility_score;


