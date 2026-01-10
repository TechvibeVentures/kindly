-- Fix smoking CHECK constraint to match onboarding form values
-- The constraint currently only allows: 'never', 'occasionally', 'regularly', 'former'
-- This matches the onboarding form, so we just need to ensure the constraint is correct

-- Drop existing constraint if it exists (might have different name)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_smoking_check;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_new_smoking_check;

-- Add correct constraint
ALTER TABLE public.profiles ADD CONSTRAINT profiles_smoking_check 
  CHECK (smoking IN ('never', 'occasionally', 'regularly', 'former') OR smoking IS NULL);


