-- Refill mock candidate profiles with complete data
-- Migration: 20260111000001_refill_mock_profiles.sql

-- Step 1: Ensure required columns exist
DO $$
BEGIN
  -- Add degree column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'degree'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN degree TEXT;
    RAISE NOTICE 'degree column added';
  END IF;

  -- Add field_of_study column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'field_of_study'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN field_of_study TEXT;
    RAISE NOTICE 'field_of_study column added';
  END IF;

  -- Add other potentially missing columns
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'interests'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN interests TEXT[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'causes'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN causes TEXT[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'qualities'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN qualities TEXT[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'conception_methods'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN conception_methods TEXT[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'looking_for'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN looking_for TEXT[] DEFAULT '{}';
  END IF;

  -- Add age column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'age'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN age INTEGER;
    RAISE NOTICE 'age column added';
  END IF;
END $$;

-- Step 2: Delete existing mock profiles (profiles without user_id)
DELETE FROM public.profiles WHERE user_id IS NULL;

-- Insert complete mock candidate profiles
INSERT INTO public.profiles (
  -- Primary identifiers
  user_id, -- NULL for mock candidates
  email,
  
  -- Basic/Primary fields (at the front)
  first_name,
  gender,
  birth_date,
  phone,
  verified,
  onboarding_completed,
  is_public,
  is_active,
  
  -- Basic Info
  bio,
  photo_url,
  
  -- About You section
  profession,
  degree,
  field_of_study,
  school,
  city,
  country,
  hometown,
  hometown_country,
  
  -- Languages
  languages,
  
  -- More About You
  height,
  weight,
  exercise,
  drinking,
  smoking,
  cannabis,
  drugs,
  diet,
  vaccinated,
  ethnicity,
  sexuality,
  relationship_status,
  pets,
  religion,
  politics,
  star_sign,
  
  -- Interests & Values
  interests,
  causes,
  qualities,
  
  -- Co-Parenting Preferences
  looking_for,
  involvement_percent,
  conception_methods,
  open_to_relocation,
  
  -- Parenting Philosophy
  parenting_philosophy,
  
  -- Financial Situation
  financial_situation,
  
  -- Lifestyle Rhythm
  lifestyle_rhythm
) VALUES
-- Mock Candidate 1: Oliver
(
  NULL, -- user_id
  'oliver@example.com',
  'Oliver',
  'male',
  '1985-05-15'::DATE,
  NULL,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  'University professor who believes in evidence-based approaches to everything, including parenting. I value open communication, emotional intelligence, and creating a nurturing environment where children can thrive.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  'University Professor',
  'phd',
  'Psychology',
  'University of Edinburgh',
  'Edinburgh',
  'United Kingdom',
  'London',
  'United Kingdom',
  ARRAY['English', 'German'],
  180,
  75,
  'daily',
  'socially',
  'never',
  'never',
  'never',
  'vegetarian',
  'yes',
  'White',
  'heterosexual',
  'single',
  'dog',
  'agnostic',
  'moderate',
  'Taurus',
  ARRAY['Reading', 'Hiking', 'Classical Music', 'Cooking'],
  ARRAY['Education', 'Mental Health', 'Environmental Conservation'],
  ARRAY['Honesty', 'Empathy', 'Intellectual Curiosity', 'Patience'],
  ARRAY['Co-parenting partner', 'Shared custody', 'Emotional support'],
  50,
  ARRAY['natural', 'assisted'],
  TRUE,
  'I believe in attachment parenting with a focus on emotional regulation and open dialogue. Children should feel heard and understood while learning boundaries.',
  'stable',
  'Regular schedule with flexibility for children needs. Morning routines are important, evenings are for family time.'
),
-- Mock Candidate 2: Nico
(
  NULL,
  'nico@example.com',
  'Nico',
  'male',
  '1988-08-22'::DATE,
  NULL,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  'Chef passionate about slow food and slow living. I want to raise grounded children with a connection to nature, food, and community. Family meals and outdoor adventures are central to my vision.',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
  'Chef & Restaurant Owner',
  'bachelor',
  'Culinary Arts',
  'Culinary Institute of Milan',
  'Milan',
  'Italy',
  'Florence',
  'Italy',
  ARRAY['Italian', 'English'],
  175,
  70,
  'several_weekly',
  'socially',
  'never',
  'never',
  'never',
  'mediterranean',
  'yes',
  'White',
  'heterosexual',
  'single',
  NULL,
  'spiritual',
  'liberal',
  'Leo',
  ARRAY['Cooking', 'Gardening', 'Travel', 'Photography'],
  ARRAY['Sustainable Food', 'Local Community', 'Animal Welfare'],
  ARRAY['Authenticity', 'Sustainability', 'Family Values', 'Creativity'],
  ARRAY['Co-parenting partner', 'Shared values', 'Active involvement'],
  50,
  ARRAY['natural'],
  FALSE,
  'Montessori-inspired approach with emphasis on independence, respect, and learning through experience. Food and nature are teachers.',
  'comfortable',
  'Flexible schedule around restaurant hours. Weekends are sacred family time, often spent outdoors or cooking together.'
),
-- Mock Candidate 3: Adrian
(
  NULL,
  'adrian@example.com',
  'Adrian',
  'male',
  '1990-03-10'::DATE,
  NULL,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  'Psychologist focused on mindfulness and emotional wellness. I bring presence and intentionality to parenting. I believe in raising emotionally intelligent children who understand their feelings and can navigate relationships with empathy.',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  'Clinical Psychologist',
  'master',
  'Psychology',
  'Stockholm University',
  'Stockholm',
  'Sweden',
  'Gothenburg',
  'Sweden',
  ARRAY['Swedish', 'English'],
  178,
  72,
  'weekly',
  'rarely',
  'never',
  'never',
  'never',
  'vegan',
  'yes',
  'White',
  'heterosexual',
  'single',
  'cat',
  'agnostic',
  'liberal',
  'Pisces',
  ARRAY['Yoga', 'Meditation', 'Reading', 'Nature Walks'],
  ARRAY['Mental Health', 'LGBTQ+ Rights', 'Environmental Protection'],
  ARRAY['Mindfulness', 'Compassion', 'Growth Mindset', 'Authenticity'],
  ARRAY['Co-parenting partner', 'Emotional support', 'Shared values'],
  50,
  ARRAY['natural', 'assisted'],
  TRUE,
  'Conscious parenting with emphasis on emotional intelligence, validation, and natural consequences. I practice non-violent communication and believe in treating children as whole people.',
  'comfortable',
  'Mindful morning routines, work during day, evenings dedicated to presence and connection. Regular meditation practice.'
),
-- Mock Candidate 4: Raphael
(
  NULL,
  'raphael@example.com',
  'Raphael',
  'male',
  '1987-11-30'::DATE,
  NULL,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  'Software engineer who values work-life balance and quality time. I believe in raising curious, independent children with strong problem-solving skills and a love for learning.',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  'Software Engineer',
  'bachelor',
  'Computer Science',
  'ETH Zurich',
  'Geneva',
  'Switzerland',
  'Lausanne',
  'Switzerland',
  ARRAY['French', 'English', 'German'],
  182,
  78,
  'several_weekly',
  'socially',
  'never',
  'never',
  'never',
  'flexitarian',
  'yes',
  'White',
  'heterosexual',
  'single',
  NULL,
  'agnostic',
  'moderate',
  'Sagittarius',
  ARRAY['Coding', 'Rock Climbing', 'Board Games', 'Travel'],
  ARRAY['Education Technology', 'Open Source', 'Privacy Rights'],
  ARRAY['Curiosity', 'Problem Solving', 'Balance', 'Integrity'],
  ARRAY['Co-parenting partner', 'Shared custody', 'Active involvement'],
  50,
  ARRAY['natural', 'assisted'],
  TRUE,
  'Balanced approach combining structure with flexibility. I value STEM education, critical thinking, and allowing children to explore their interests while maintaining healthy boundaries.',
  'stable',
  'Regular work hours with flexibility for remote work. Evenings and weekends are family-focused, with time for hobbies and learning together.'
),
-- Mock Candidate 5: Sebastian
(
  NULL,
  'sebastian@example.com',
  'Sebastian',
  'male',
  '1989-07-18'::DATE,
  NULL,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  'Architect who believes in creating beautiful, functional spaces for families. I value creativity, sustainability, and raising children who appreciate art, design, and the built environment.',
  'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400',
  'Architect',
  'master',
  'Architecture',
  'Technical University of Munich',
  'Munich',
  'Germany',
  'Berlin',
  'Germany',
  ARRAY['German', 'English'],
  179,
  76,
  'weekly',
  'socially',
  'never',
  'never',
  'never',
  'vegetarian',
  'yes',
  'White',
  'heterosexual',
  'single',
  NULL,
  'agnostic',
  'liberal',
  'Cancer',
  ARRAY['Architecture', 'Drawing', 'Photography', 'Museums'],
  ARRAY['Sustainable Design', 'Urban Planning', 'Arts Education'],
  ARRAY['Creativity', 'Sustainability', 'Aesthetics', 'Innovation'],
  ARRAY['Co-parenting partner', 'Shared values', 'Creative environment'],
  50,
  ARRAY['natural'],
  FALSE,
  'Waldorf-inspired approach emphasizing creativity, imagination, and connection to nature. I believe in providing children with beautiful, inspiring environments and opportunities for artistic expression.',
  'comfortable',
  'Flexible schedule with project-based work. Regular family outings to museums, parks, and cultural events. Evenings are for creative activities and storytelling.'
),
-- Mock Candidate 6: Jonas
(
  NULL,
  'jonas@example.com',
  'Jonas',
  'male',
  '1986-02-14'::DATE,
  NULL,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  'Financial advisor with a passion for education and long-term planning. I believe in raising financially literate children who understand the value of money, hard work, and planning for the future.',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
  'Financial Advisor',
  'bachelor',
  'Business Administration',
  'Copenhagen Business School',
  'Copenhagen',
  'Denmark',
  'Aarhus',
  'Denmark',
  ARRAY['Danish', 'English'],
  181,
  80,
  'several_weekly',
  'socially',
  'never',
  'never',
  'never',
  'flexitarian',
  'yes',
  'White',
  'heterosexual',
  'single',
  'dog',
  'agnostic',
  'moderate',
  'Aquarius',
  ARRAY['Finance', 'Reading', 'Cycling', 'Travel'],
  ARRAY['Financial Literacy', 'Education', 'Economic Equality'],
  ARRAY['Responsibility', 'Planning', 'Education', 'Stability'],
  ARRAY['Co-parenting partner', 'Shared custody', 'Financial planning'],
  50,
  ARRAY['natural', 'assisted'],
  TRUE,
  'Structured approach with emphasis on education, responsibility, and planning. I believe in teaching children about money, goal-setting, and the importance of education while maintaining warmth and support.',
  'stable',
  'Regular office hours with good work-life balance. Weekends are for family activities, education, and quality time. Regular family meetings to discuss goals and plans.'
),
-- Mock Candidate 7: Thomas
(
  NULL,
  'thomas@example.com',
  'Thomas',
  'male',
  '1991-09-05'::DATE,
  NULL,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  'Musician and music teacher who believes in the power of music and arts in child development. I want to raise creative, expressive children who can communicate through various forms of art.',
  'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400',
  'Music Teacher & Musician',
  'bachelor',
  'Music Education',
  'Conservatory of Amsterdam',
  'Amsterdam',
  'Netherlands',
  'Rotterdam',
  'Netherlands',
  ARRAY['Dutch', 'English'],
  177,
  73,
  'weekly',
  'socially',
  'never',
  'never',
  'never',
  'vegetarian',
  'yes',
  'White',
  'heterosexual',
  'single',
  NULL,
  'spiritual',
  'liberal',
  'Virgo',
  ARRAY['Music', 'Composition', 'Concerts', 'Reading'],
  ARRAY['Arts Education', 'Music Therapy', 'Cultural Preservation'],
  ARRAY['Creativity', 'Expression', 'Passion', 'Dedication'],
  ARRAY['Co-parenting partner', 'Shared values', 'Creative environment'],
  50,
  ARRAY['natural'],
  FALSE,
  'Arts-focused parenting with emphasis on creativity, expression, and emotional intelligence through music and arts. I believe in allowing children to explore their creative interests while providing structure and guidance.',
  'moderate',
  'Flexible schedule around teaching and performances. Evenings often include music practice and family music time. Weekends are for concerts, cultural events, and creative projects.'
),
-- Mock Candidate 8: Marcus
(
  NULL,
  'marcus@example.com',
  'Marcus',
  'male',
  '1984-12-20'::DATE,
  NULL,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  'Doctor specializing in pediatrics, passionate about child health and development. I bring medical knowledge and a deep understanding of child development to parenting, with emphasis on health, safety, and evidence-based practices.',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
  'Pediatrician',
  'phd',
  'Medicine',
  'Karolinska Institute',
  'Zurich',
  'Switzerland',
  'Basel',
  'Switzerland',
  ARRAY['German', 'English', 'French'],
  183,
  79,
  'daily',
  'rarely',
  'never',
  'never',
  'never',
  'mediterranean',
  'yes',
  'White',
  'heterosexual',
  'single',
  NULL,
  'agnostic',
  'moderate',
  'Sagittarius',
  ARRAY['Medicine', 'Running', 'Reading', 'Travel'],
  ARRAY['Child Health', 'Public Health', 'Medical Research'],
  ARRAY['Health', 'Knowledge', 'Compassion', 'Evidence-Based'],
  ARRAY['Co-parenting partner', 'Shared custody', 'Health-focused'],
  50,
  ARRAY['natural', 'assisted'],
  TRUE,
  'Evidence-based parenting with focus on child health, development, and safety. I value routine, nutrition, sleep, and following medical guidelines while maintaining warmth and emotional connection.',
  'stable',
  'Regular but sometimes irregular hours due to medical practice. Prioritize family time and health routines. Regular check-ins and health-focused activities.'
),
-- Mock Candidate 9: Lucas
(
  NULL,
  'lucas@example.com',
  'Lucas',
  'male',
  '1992-04-25'::DATE,
  NULL,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  'Environmental scientist committed to raising eco-conscious children. I believe in teaching children about sustainability, nature, and their role in protecting the planet through hands-on experiences and education.',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
  'Environmental Scientist',
  'master',
  'Environmental Science',
  'University of Vienna',
  'Vienna',
  'Austria',
  'Salzburg',
  'Austria',
  ARRAY['German', 'English'],
  176,
  71,
  'several_weekly',
  'rarely',
  'never',
  'never',
  'never',
  'vegan',
  'yes',
  'White',
  'heterosexual',
  'single',
  NULL,
  'spiritual',
  'liberal',
  'Taurus',
  ARRAY['Hiking', 'Gardening', 'Environmental Activism', 'Photography'],
  ARRAY['Climate Action', 'Conservation', 'Sustainable Living'],
  ARRAY['Sustainability', 'Environmental Responsibility', 'Connection to Nature', 'Activism'],
  ARRAY['Co-parenting partner', 'Shared values', 'Eco-conscious'],
  50,
  ARRAY['natural'],
  TRUE,
  'Nature-based parenting with emphasis on environmental consciousness, outdoor activities, and teaching children about their impact on the planet. I believe in hands-on learning and connection to nature.',
  'moderate',
  'Flexible research schedule with emphasis on outdoor activities. Regular family hikes, gardening, and environmental projects. Weekends are for nature exploration and environmental education.'
);

-- Note: Age is no longer stored - it will be calculated from birth_date when needed

