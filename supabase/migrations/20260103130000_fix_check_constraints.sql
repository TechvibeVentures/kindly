-- Fix CHECK constraints to match actual candidate data values

-- Update exercise constraint to include all values used in candidates
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_exercise_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_exercise_check 
  CHECK (exercise IN ('daily', 'several_weekly', 'weekly', 'occasionally', 'rarely', 'active', 'sometimes') OR exercise IS NULL);

-- Update drinking constraint to include all values used in candidates
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_drinking_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_drinking_check 
  CHECK (drinking IN ('never', 'rarely', 'socially', 'regularly', 'sometimes', 'often') OR drinking IS NULL);


