-- Drop existing profiles table and recreate it cleanly based on ProfileEdit structure
-- This ensures no duplicate fields and proper field ordering

-- First, drop dependent objects
DROP TABLE IF EXISTS public.profile_children CASCADE;
DROP POLICY IF EXISTS "Anyone can view public profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

-- Drop the profiles table (this will cascade to dependent objects)
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Recreate profiles table with all fields in ProfileEdit order
CREATE TABLE public.profiles (
  -- Primary identifiers
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  
  -- Basic/Primary fields (moved to front)
  gender TEXT CHECK (gender IN ('male', 'female', 'non-binary')),
  birth_year INTEGER,
  phone TEXT,
  verified BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Basic Info (Bio section)
  bio TEXT,
  photo_url TEXT,
  display_name TEXT,
  full_name TEXT,
  
  -- About You section
  -- Work
  profession TEXT,
  company TEXT,
  
  -- Education
  education TEXT,
  studies TEXT,
  school TEXT,
  
  -- Location
  city TEXT,
  country TEXT,
  hometown TEXT,
  hometown_country TEXT,
  
  -- More About You section
  -- Physical
  height INTEGER, -- in cm
  weight INTEGER, -- in kg
  
  -- Lifestyle & Health
  exercise TEXT CHECK (exercise IN ('daily', 'several_weekly', 'weekly', 'occasionally', 'rarely', 'active', 'sometimes')),
  drinking TEXT CHECK (drinking IN ('never', 'rarely', 'socially', 'regularly', 'sometimes', 'often')),
  smoking TEXT CHECK (smoking IN ('never', 'occasionally', 'regularly', 'former')),
  cannabis TEXT CHECK (cannabis IN ('never', 'sometimes', 'often')),
  drugs TEXT CHECK (drugs IN ('never', 'sometimes', 'often')),
  diet TEXT,
  vaccinated TEXT CHECK (vaccinated IN ('yes', 'no', 'partially', 'prefer_not_to_say')),
  blood_type TEXT,
  eye_colour TEXT,
  hair_colour TEXT,
  
  -- Personal Details
  ethnicity TEXT,
  sexuality TEXT CHECK (sexuality IN ('heterosexual', 'homosexual', 'bisexual', 'pansexual', 'asexual', 'other')),
  relationship_status TEXT,
  household_situation TEXT,
  family_situation TEXT,
  pets TEXT,
  religion TEXT,
  politics TEXT,
  star_sign TEXT,
  
  -- Languages (array)
  languages TEXT[] DEFAULT '{}',
  
  -- Interests & Values (arrays)
  interests TEXT[] DEFAULT '{}',
  causes TEXT[] DEFAULT '{}',
  qualities TEXT[] DEFAULT '{}', -- Core Values (called "qualities" in ProfileEdit)
  
  -- Co-Parenting Preferences
  looking_for TEXT[] DEFAULT '{}', -- Array of what they're looking for
  involvement_percent INTEGER CHECK (involvement_percent >= 0 AND involvement_percent <= 100), -- Custody preference as percentage
  custody_school_arrangement TEXT CHECK (custody_school_arrangement IN ('flexible', 'specific', 'alternating')),
  custody_school_days TEXT,
  custody_vacation_arrangement TEXT CHECK (custody_vacation_arrangement IN ('flexible', 'alternating', 'specific')),
  custody_vacation_conditions TEXT,
  custody_further_info TEXT,
  conception_methods TEXT[] DEFAULT '{}',
  open_to_relocation BOOLEAN DEFAULT FALSE,
  
  -- Parenting Philosophy
  parenting_philosophy TEXT,
  
  -- Financial Situation
  financial_situation TEXT,
  
  -- Lifestyle Rhythm
  lifestyle_rhythm TEXT,
  
  -- Additional fields for backward compatibility with candidates (will be removed in next migration)
  first_name TEXT,
  age INTEGER, -- Calculated from birth_year if needed
  nationality TEXT,
  looking_for_text TEXT, -- Text version for candidates (backward compatibility)
  vision TEXT,
  involvement TEXT, -- Text version like "50/50 custody" (backward compatibility)
  involvement_flexibility TEXT,
  parenting_status TEXT,
  occupation TEXT, -- Alias for profession (backward compatibility)
  family_support TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create unique constraint on user_id (allowing NULL for public candidates)
CREATE UNIQUE INDEX profiles_user_id_unique ON public.profiles(user_id) WHERE user_id IS NOT NULL;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create indexes for filtering and queries
CREATE INDEX idx_profiles_city ON public.profiles(city);
CREATE INDEX idx_profiles_country ON public.profiles(country);
CREATE INDEX idx_profiles_gender ON public.profiles(gender);
CREATE INDEX idx_profiles_age ON public.profiles(age);
CREATE INDEX idx_profiles_birth_year ON public.profiles(birth_year);
CREATE INDEX idx_profiles_is_public ON public.profiles(is_public);
CREATE INDEX idx_profiles_is_active ON public.profiles(is_active);
CREATE INDEX idx_profiles_sexuality ON public.profiles(sexuality);
CREATE INDEX idx_profiles_profession ON public.profiles(profession);
CREATE INDEX idx_profiles_hometown ON public.profiles(hometown);

-- Create profile_children table for children array
CREATE TABLE public.profile_children (
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

-- Create index for profile_children
CREATE INDEX idx_profile_children_profile_id ON public.profile_children(profile_id);

-- RLS Policies for profiles
CREATE POLICY "Anyone can view public profiles"
ON public.profiles FOR SELECT
USING (is_public = TRUE AND is_active = TRUE);

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id OR (is_public = TRUE AND is_active = TRUE));

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can delete profiles"
ON public.profiles FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- RLS Policies for profile_children
CREATE POLICY "Users can manage their own profile children"
ON public.profile_children FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = profile_children.profile_id
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all profile children"
ON public.profile_children FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Create trigger for updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on profile_children
CREATE TRIGGER update_profile_children_updated_at
  BEFORE UPDATE ON public.profile_children
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

