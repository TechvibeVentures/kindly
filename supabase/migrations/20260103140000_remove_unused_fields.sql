-- Remove unused backward compatibility fields that are not needed for ProfileEdit
-- These fields were added for candidate data but are not used in the ProfileEdit form

ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS first_name, -- Use full_name and display_name instead
  DROP COLUMN IF EXISTS age, -- Can be calculated from birth_year
  DROP COLUMN IF EXISTS nationality, -- Not used in ProfileEdit
  DROP COLUMN IF EXISTS looking_for_text, -- Not used, we have looking_for array
  DROP COLUMN IF EXISTS vision, -- Not used in ProfileEdit
  DROP COLUMN IF EXISTS involvement, -- Text version not needed, we have involvement_percent
  DROP COLUMN IF EXISTS involvement_flexibility, -- Not used in ProfileEdit
  DROP COLUMN IF EXISTS parenting_status, -- Not used in ProfileEdit
  DROP COLUMN IF EXISTS occupation, -- Duplicate of profession
  DROP COLUMN IF EXISTS family_support, -- Not used in ProfileEdit
  DROP COLUMN IF EXISTS preferred_method, -- Covered by conception_methods array
  DROP COLUMN IF EXISTS compatibility_score; -- Should be calculated dynamically, not stored

-- Note: Keeping these fields as they are used:
-- - gender (used in ProfileEdit)
-- - birth_year (used in ProfileEdit as birthYear)
-- - involvement_percent (used in ProfileEdit as involvement number)

