-- Rebuild profiles table with proper column order and remove deprecated fields
-- Migration: 20260112000000_rebuild_profiles_table.sql
-- This migration removes display_name, full_name, birth_year, and age fields
-- And reorders columns so first_name and birth_date are near the front

-- Step 1: Create new table with correct column order
CREATE TABLE public.profiles_new (
  -- Primary identifiers
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  
  -- Basic/Primary fields (at the front)
  first_name TEXT NOT NULL DEFAULT 'User', -- Primary name field
  gender TEXT CHECK (gender IN ('male', 'female', 'non-binary')),
  birth_date DATE, -- Primary birthdate field
  phone TEXT,
  verified BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Basic Info (Bio section)
  bio TEXT,
  photo_url TEXT,
  
  -- About You section
  -- Work
  profession TEXT,
  company TEXT,
  
  -- Education
  degree TEXT,
  field_of_study TEXT,
  education TEXT,
  studies TEXT,
  school TEXT,
  
  -- Location
  city TEXT,
  country TEXT,
  hometown TEXT,
  hometown_country TEXT,
  
  -- Languages
  languages TEXT[] DEFAULT '{}',
  
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
  
  -- Interests & Values (arrays)
  interests TEXT[] DEFAULT '{}',
  causes TEXT[] DEFAULT '{}',
  qualities TEXT[] DEFAULT '{}', -- Core Values
  
  -- Co-Parenting Preferences
  looking_for TEXT[] DEFAULT '{}',
  involvement_percent INTEGER CHECK (involvement_percent >= 0 AND involvement_percent <= 100),
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
  
  -- Privacy Settings
  show_online_status BOOLEAN DEFAULT TRUE,
  show_location BOOLEAN DEFAULT TRUE,
  show_last_active BOOLEAN DEFAULT FALSE,
  
  -- Backward compatibility fields (deprecated but kept for migration)
  first_name_old TEXT, -- Temporary field for migration
  nationality TEXT,
  looking_for_text TEXT,
  vision TEXT,
  involvement TEXT,
  involvement_flexibility TEXT,
  parenting_status TEXT,
  occupation TEXT,
  family_support TEXT,
  values TEXT[] DEFAULT '{}',
  preferred_method TEXT CHECK (preferred_method IN ('natural', 'assisted', 'open')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Step 2: Migrate data from old table to new table
-- Use dynamic SQL to handle columns that may not exist
DO $$
DECLARE
  sql_text TEXT;
BEGIN
  sql_text := '
    INSERT INTO public.profiles_new (
      id, user_id, email,
      first_name, gender, birth_date, phone, verified, onboarding_completed, is_public, is_active,
      bio, photo_url,
      profession, company,
      degree, field_of_study, education, studies, school,
      city, country, hometown, hometown_country,
      languages,
      height, weight,
      exercise, drinking, smoking, cannabis, drugs, diet, vaccinated, blood_type, eye_colour, hair_colour,
      ethnicity, sexuality, relationship_status, household_situation, family_situation, pets, religion, politics, star_sign,
      interests, causes, qualities,
      looking_for, involvement_percent, custody_school_arrangement, custody_school_days, custody_vacation_arrangement, custody_vacation_conditions, custody_further_info, conception_methods, open_to_relocation,
      parenting_philosophy,
      financial_situation,
      lifestyle_rhythm,
      show_online_status, show_location, show_last_active,
      nationality, looking_for_text, vision, involvement, involvement_flexibility, parenting_status, occupation, family_support, values, preferred_method,
      created_at, updated_at
    )
    SELECT 
      id, user_id, email,
      COALESCE(
        NULLIF(first_name, ''''),
        NULLIF(SPLIT_PART(COALESCE(full_name, display_name, ''''), '' '', 1), ''''),
        full_name,
        display_name,
        ''User''
      ) as first_name,
      gender,
      birth_date,
      phone, verified, onboarding_completed, is_public, is_active,
      bio, photo_url,
      profession, company,
      degree, field_of_study, education, studies, school,
      city, country, hometown, hometown_country,
      languages,
      height, weight,
      exercise, drinking, smoking, cannabis, drugs, diet, vaccinated, blood_type, eye_colour, hair_colour,
      ethnicity, sexuality, relationship_status, household_situation, family_situation, pets, religion, politics, star_sign,
      interests, causes, qualities,
      looking_for, involvement_percent, custody_school_arrangement, custody_school_days, custody_vacation_arrangement, custody_vacation_conditions, custody_further_info, conception_methods, open_to_relocation,
      parenting_philosophy,
      financial_situation,
      lifestyle_rhythm,
      COALESCE(show_online_status, TRUE) as show_online_status,
      COALESCE(show_location, TRUE) as show_location,
      COALESCE(show_last_active, FALSE) as show_last_active,';

  -- Add backward compatibility fields conditionally
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'nationality') THEN
    sql_text := sql_text || ' nationality,';
  ELSE
    sql_text := sql_text || ' NULL::TEXT as nationality,';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'looking_for_text') THEN
    sql_text := sql_text || ' looking_for_text,';
  ELSE
    sql_text := sql_text || ' NULL::TEXT as looking_for_text,';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'vision') THEN
    sql_text := sql_text || ' vision,';
  ELSE
    sql_text := sql_text || ' NULL::TEXT as vision,';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'involvement') THEN
    sql_text := sql_text || ' involvement,';
  ELSE
    sql_text := sql_text || ' NULL::TEXT as involvement,';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'involvement_flexibility') THEN
    sql_text := sql_text || ' involvement_flexibility,';
  ELSE
    sql_text := sql_text || ' NULL::TEXT as involvement_flexibility,';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'parenting_status') THEN
    sql_text := sql_text || ' parenting_status,';
  ELSE
    sql_text := sql_text || ' NULL::TEXT as parenting_status,';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'occupation') THEN
    sql_text := sql_text || ' occupation,';
  ELSE
    sql_text := sql_text || ' NULL::TEXT as occupation,';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'family_support') THEN
    sql_text := sql_text || ' family_support,';
  ELSE
    sql_text := sql_text || ' NULL::TEXT as family_support,';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'values') THEN
    sql_text := sql_text || ' values,';
  ELSE
    sql_text := sql_text || ' ARRAY[]::TEXT[] as values,';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'preferred_method') THEN
    sql_text := sql_text || ' preferred_method,';
  ELSE
    sql_text := sql_text || ' NULL::TEXT as preferred_method,';
  END IF;

  sql_text := sql_text || '
      created_at, updated_at
    FROM public.profiles;';

  EXECUTE sql_text;
END $$;

-- Step 3: Drop old table
DROP TABLE public.profiles CASCADE;

-- Step 4: Rename new table to profiles
ALTER TABLE public.profiles_new RENAME TO profiles;

-- Step 5: Recreate unique constraint on user_id
CREATE UNIQUE INDEX profiles_user_id_unique ON public.profiles(user_id) WHERE user_id IS NOT NULL;

-- Step 6: Recreate indexes
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_country ON public.profiles(country);
CREATE INDEX IF NOT EXISTS idx_profiles_first_name ON public.profiles(first_name);
CREATE INDEX IF NOT EXISTS idx_profiles_birth_date ON public.profiles(birth_date);
CREATE INDEX IF NOT EXISTS idx_profiles_is_public ON public.profiles(is_public);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_gender ON public.profiles(gender);

-- Step 7: Recreate RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can view public profiles
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (is_public = TRUE AND is_active = TRUE);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own profile
CREATE POLICY "Users can delete their own profile"
ON public.profiles FOR DELETE
USING (auth.uid() = user_id);

-- Step 8: Recreate trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Step 9: Update handle_new_user function to use first_name instead of full_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
  user_role app_role;
  user_first_name TEXT;
BEGIN
  user_email := NEW.email;
  
  -- Determine role based on email domain
  IF user_email LIKE '%@impactfuel.ch' THEN
    user_role := 'admin';
  ELSE
    user_role := 'user';
  END IF;
  
  -- Extract first name from user metadata (prefer first_name, fallback to full_name)
  user_first_name := COALESCE(
    NEW.raw_user_meta_data ->> 'first_name',
    SPLIT_PART(COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''), ' ', 1),
    'User'
  );
  
  -- Create profile with first_name (primary field)
  INSERT INTO public.profiles (user_id, email, first_name)
  VALUES (NEW.id, user_email, user_first_name);
  
  -- Assign role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$$;

-- Step 10: Add comments
COMMENT ON COLUMN public.profiles.first_name IS 'Primary name field - user first name (from onboarding)';
COMMENT ON COLUMN public.profiles.birth_date IS 'Primary birthdate field - full date (YYYY-MM-DD format)';

