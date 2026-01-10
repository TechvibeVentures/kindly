-- Extend profiles table to support full candidate profile data
-- Add all fields needed for candidate profiles

-- First, make user_id nullable to allow public candidate profiles
-- Drop the existing UNIQUE constraint first (it creates both constraint and index)
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_user_id_key;

ALTER TABLE public.profiles
  ALTER COLUMN user_id DROP NOT NULL;

-- Add unique constraint that allows NULL (PostgreSQL treats NULLs as distinct)
-- Create a partial unique index that only applies when user_id IS NOT NULL
CREATE UNIQUE INDEX IF NOT EXISTS profiles_user_id_unique ON public.profiles(user_id) WHERE user_id IS NOT NULL;

ALTER TABLE public.profiles
  -- Basic Info
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'non-binary')),
  ADD COLUMN IF NOT EXISTS age INTEGER,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS nationality TEXT,
  ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}',
  
  -- About Me
  ADD COLUMN IF NOT EXISTS looking_for TEXT,
  
  -- Vision & Values
  ADD COLUMN IF NOT EXISTS vision TEXT,
  ADD COLUMN IF NOT EXISTS values TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS parenting_philosophy TEXT,
  
  -- Co-Parenting Preferences
  ADD COLUMN IF NOT EXISTS involvement TEXT,
  ADD COLUMN IF NOT EXISTS involvement_flexibility TEXT,
  ADD COLUMN IF NOT EXISTS preferred_method TEXT CHECK (preferred_method IN ('natural', 'assisted', 'open')),
  ADD COLUMN IF NOT EXISTS open_to_relocation BOOLEAN DEFAULT FALSE,
  
  -- Life Situation
  ADD COLUMN IF NOT EXISTS relationship_status TEXT,
  ADD COLUMN IF NOT EXISTS parenting_status TEXT,
  ADD COLUMN IF NOT EXISTS occupation TEXT,
  ADD COLUMN IF NOT EXISTS education TEXT,
  ADD COLUMN IF NOT EXISTS financial_situation TEXT,
  ADD COLUMN IF NOT EXISTS lifestyle_rhythm TEXT,
  ADD COLUMN IF NOT EXISTS family_support TEXT,
  
  -- Lifestyle & Health
  ADD COLUMN IF NOT EXISTS smoking TEXT CHECK (smoking IN ('never', 'occasionally', 'regularly', 'former')),
  ADD COLUMN IF NOT EXISTS alcohol TEXT CHECK (alcohol IN ('never', 'rarely', 'socially', 'regularly')),
  ADD COLUMN IF NOT EXISTS exercise TEXT CHECK (exercise IN ('daily', 'several_weekly', 'weekly', 'occasionally', 'rarely')),
  ADD COLUMN IF NOT EXISTS diet TEXT,
  ADD COLUMN IF NOT EXISTS cannabis TEXT CHECK (cannabis IN ('never', 'sometimes', 'often')),
  ADD COLUMN IF NOT EXISTS drugs TEXT CHECK (drugs IN ('never', 'sometimes', 'often')),
  
  -- Physical
  ADD COLUMN IF NOT EXISTS height INTEGER, -- in cm
  ADD COLUMN IF NOT EXISTS weight INTEGER, -- in kg
  
  -- Additional Info
  ADD COLUMN IF NOT EXISTS religion TEXT,
  ADD COLUMN IF NOT EXISTS politics TEXT,
  ADD COLUMN IF NOT EXISTS ethnicity TEXT,
  ADD COLUMN IF NOT EXISTS star_sign TEXT,
  ADD COLUMN IF NOT EXISTS pets TEXT,
  
  -- Compatibility
  ADD COLUMN IF NOT EXISTS compatibility_score INTEGER DEFAULT 0,
  
  -- Profile visibility
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Create index for filtering
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_country ON public.profiles(country);
CREATE INDEX IF NOT EXISTS idx_profiles_gender ON public.profiles(gender);
CREATE INDEX IF NOT EXISTS idx_profiles_age ON public.profiles(age);
CREATE INDEX IF NOT EXISTS idx_profiles_is_public ON public.profiles(is_public);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);

-- Update RLS policies to allow viewing public profiles
CREATE POLICY "Anyone can view public profiles"
ON public.profiles FOR SELECT
USING (is_public = TRUE AND is_active = TRUE);

-- Update existing policies to handle NULL user_id
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id OR (is_public = TRUE AND is_active = TRUE));

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

