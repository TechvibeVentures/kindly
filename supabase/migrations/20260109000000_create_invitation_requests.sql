-- Create invitation_requests table to store requests from landing page
CREATE TABLE public.invitation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'invited', 'rejected'
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index for faster lookups
CREATE INDEX idx_invitation_requests_email ON public.invitation_requests(email);
CREATE INDEX idx_invitation_requests_status ON public.invitation_requests(status);
CREATE INDEX idx_invitation_requests_created_at ON public.invitation_requests(created_at DESC);

-- Enable RLS
ALTER TABLE public.invitation_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invitation_requests
-- Only admins can view invitation requests
CREATE POLICY "Admins can view invitation requests"
ON public.invitation_requests FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Only admins can update invitation requests
CREATE POLICY "Admins can update invitation requests"
ON public.invitation_requests FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Anyone can insert invitation requests (from landing page)
CREATE POLICY "Anyone can create invitation requests"
ON public.invitation_requests FOR INSERT
WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_invitation_requests_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger to update updated_at
CREATE TRIGGER update_invitation_requests_updated_at_trigger
BEFORE UPDATE ON public.invitation_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_invitation_requests_updated_at();

