-- Fix sexuality CHECK constraint to ensure it allows NULL values
-- The constraint should allow NULL or one of the valid values

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_sexuality_check;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_new_sexuality_check;

ALTER TABLE public.profiles ADD CONSTRAINT profiles_sexuality_check 
  CHECK (sexuality IN ('heterosexual', 'homosexual', 'bisexual', 'pansexual', 'asexual', 'other') OR sexuality IS NULL);


