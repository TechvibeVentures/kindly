-- Make profiles public by default
-- This ensures new profiles are visible in Discover by default
ALTER TABLE public.profiles 
  ALTER COLUMN is_public SET DEFAULT TRUE;

-- Update existing profiles that don't have is_public set to make them public
-- (Only for profiles that are active and have completed onboarding)
UPDATE public.profiles
SET is_public = TRUE
WHERE (is_public IS NULL OR is_public = FALSE)
  AND is_active = TRUE
  AND onboarding_completed = TRUE;

