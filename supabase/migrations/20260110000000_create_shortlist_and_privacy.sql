-- Create shortlist/favorites table
CREATE TABLE public.shortlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, candidate_id) -- Prevent duplicate entries
);

-- Create index for faster lookups
CREATE INDEX idx_shortlist_user_id ON public.shortlist(user_id);
CREATE INDEX idx_shortlist_candidate_id ON public.shortlist(candidate_id);

-- Enable RLS
ALTER TABLE public.shortlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shortlist
CREATE POLICY "Users can view their own shortlist"
ON public.shortlist FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own shortlist"
ON public.shortlist FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own shortlist"
ON public.shortlist FOR DELETE
USING (auth.uid() = user_id);

-- Add privacy settings columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS show_online_status BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS show_location BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS show_last_active BOOLEAN DEFAULT FALSE;

-- Note: profile_visibility is already handled by is_public column

