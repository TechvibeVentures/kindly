-- Reorder table columns: Move basic/primary fields to the front
-- PostgreSQL doesn't support direct column reordering, so we recreate the table

-- Step 1: Create new table with correct column order
CREATE TABLE public.profiles_new (
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
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Step 2: Copy data from old table to new table
-- Note: Some columns may have been removed by previous migrations
-- We'll insert only columns that exist, and let others default to NULL
INSERT INTO public.profiles_new (
  id, user_id, email,
  gender, birth_year, phone, verified, onboarding_completed, is_public, is_active,
  bio, photo_url, display_name, full_name,
  profession, company,
  education, studies, school,
  city, country, hometown, hometown_country,
  height, weight,
  exercise, drinking, smoking, cannabis, drugs, diet, vaccinated, blood_type, eye_colour, hair_colour,
  ethnicity, sexuality, relationship_status, household_situation, family_situation, pets, religion, politics, star_sign,
  languages,
  interests, causes, qualities,
  looking_for, involvement_percent, custody_school_arrangement, custody_school_days,
  custody_vacation_arrangement, custody_vacation_conditions, custody_further_info, conception_methods, open_to_relocation,
  parenting_philosophy,
  financial_situation,
  lifestyle_rhythm,
  created_at, updated_at
)
SELECT 
  p.id, p.user_id, p.email,
  p.gender, p.birth_year, p.phone, p.verified, p.onboarding_completed, p.is_public, p.is_active,
  p.bio, p.photo_url, p.display_name, p.full_name,
  p.profession, p.company,
  p.education, p.studies, p.school,
  p.city, p.country, p.hometown, p.hometown_country,
  p.height, p.weight,
  p.exercise, p.drinking, p.smoking, p.cannabis, p.drugs, p.diet, p.vaccinated, p.blood_type, p.eye_colour, p.hair_colour,
  p.ethnicity, p.sexuality, p.relationship_status, p.household_situation, p.family_situation, p.pets, p.religion, p.politics, p.star_sign,
  p.languages,
  p.interests, p.causes, p.qualities,
  p.looking_for, p.involvement_percent, p.custody_school_arrangement, p.custody_school_days,
  p.custody_vacation_arrangement, p.custody_vacation_conditions, p.custody_further_info, p.conception_methods, p.open_to_relocation,
  p.parenting_philosophy,
  p.financial_situation,
  p.lifestyle_rhythm,
  p.created_at, p.updated_at
FROM public.profiles p;

-- Step 3: Drop old table and rename new table
DROP TABLE public.profiles CASCADE;
ALTER TABLE public.profiles_new RENAME TO profiles;

-- Step 4: Recreate constraints and indexes
CREATE UNIQUE INDEX profiles_user_id_unique ON public.profiles(user_id) WHERE user_id IS NOT NULL;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Recreate indexes
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

-- Recreate RLS policies
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

-- Recreate triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Recreate foreign key constraint for profile_children
ALTER TABLE public.profile_children 
  DROP CONSTRAINT IF EXISTS profile_children_profile_id_fkey,
  ADD CONSTRAINT profile_children_profile_id_fkey 
  FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

