-- Fix search_path for is_admin_email function
CREATE OR REPLACE FUNCTION public.is_admin_email(email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email LIKE '%@impactfuel.ch'
$$;