-- Add all fields needed for ProfileEdit component
-- This migration extends the profiles table with all fields used in the ProfileEdit form

ALTER TABLE public.profiles
  -- Contact & Verification
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE,
  
  -- Personal Details
  ADD COLUMN IF NOT EXISTS birth_year INTEGER,
  ADD COLUMN IF NOT EXISTS hometown TEXT,
  ADD COLUMN IF NOT EXISTS hometown_country TEXT,
  ADD COLUMN IF NOT EXISTS sexuality TEXT CHECK (sexuality IN ('heterosexual', 'homosexual', 'bisexual', 'pansexual', 'asexual', 'other')),
  
  -- Education & Work
  ADD COLUMN IF NOT EXISTS studies TEXT,
  ADD COLUMN IF NOT EXISTS school TEXT,
  ADD COLUMN IF NOT EXISTS profession TEXT,
  ADD COLUMN IF NOT EXISTS company TEXT,
  
  -- Physical Attributes
  ADD COLUMN IF NOT EXISTS eye_colour TEXT,
  ADD COLUMN IF NOT EXISTS hair_colour TEXT,
  ADD COLUMN IF NOT EXISTS blood_type TEXT,
  
  -- Lifestyle & Health (additional fields)
  ADD COLUMN IF NOT EXISTS vaccinated TEXT CHECK (vaccinated IN ('yes', 'no', 'partially', 'prefer_not_to_say')),
  ADD COLUMN IF NOT EXISTS drinking TEXT CHECK (drinking IN ('never', 'sometimes', 'often', 'socially')),
  
  -- Interests & Values (arrays)
  ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS causes TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS qualities TEXT[] DEFAULT '{}',
  
  -- Co-Parenting Details
  ADD COLUMN IF NOT EXISTS involvement_percent INTEGER CHECK (involvement_percent >= 0 AND involvement_percent <= 100),
  ADD COLUMN IF NOT EXISTS looking_for_array TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS household_situation TEXT,
  ADD COLUMN IF NOT EXISTS family_situation TEXT,
  
  -- Custody Arrangements
  ADD COLUMN IF NOT EXISTS custody_school_arrangement TEXT CHECK (custody_school_arrangement IN ('flexible', 'specific', 'alternating')),
  ADD COLUMN IF NOT EXISTS custody_school_days TEXT,
  ADD COLUMN IF NOT EXISTS custody_vacation_arrangement TEXT CHECK (custody_vacation_arrangement IN ('flexible', 'alternating', 'specific')),
  ADD COLUMN IF NOT EXISTS custody_vacation_conditions TEXT,
  ADD COLUMN IF NOT EXISTS custody_further_info TEXT,
  ADD COLUMN IF NOT EXISTS conception_methods TEXT[] DEFAULT '{}';

-- Create a separate table for children (since it's an array of objects)
CREATE TABLE IF NOT EXISTS public.profile_children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  birthdate DATE,
  gender TEXT,
  custody_percent INTEGER CHECK (custody_percent >= 0 AND custody_percent <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on children table
ALTER TABLE public.profile_children ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own profile children" ON public.profile_children;
DROP POLICY IF EXISTS "Admins can view all profile children" ON public.profile_children;

-- Policy: Users can manage their own profile's children
CREATE POLICY "Users can manage their own profile children"
ON public.profile_children FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = profile_children.profile_id
    AND profiles.user_id = auth.uid()
  )
);

-- Policy: Admins can view all children
CREATE POLICY "Admins can view all profile children"
ON public.profile_children FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Create index for profile_children
CREATE INDEX IF NOT EXISTS idx_profile_children_profile_id ON public.profile_children(profile_id);

-- Update the update_updated_at_column function to work with profile_children
DROP TRIGGER IF EXISTS update_profile_children_updated_at ON public.profile_children;
CREATE TRIGGER update_profile_children_updated_at
  BEFORE UPDATE ON public.profile_children
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update existing columns if needed (change involvement from TEXT to support both text and percent)
-- Keep both fields: involvement (text like "50/50 custody") and involvement_percent (number 0-100)

-- Add indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_profiles_sexuality ON public.profiles(sexuality);
CREATE INDEX IF NOT EXISTS idx_profiles_birth_year ON public.profiles(birth_year);
CREATE INDEX IF NOT EXISTS idx_profiles_hometown ON public.profiles(hometown);
CREATE INDEX IF NOT EXISTS idx_profiles_profession ON public.profiles(profession);

