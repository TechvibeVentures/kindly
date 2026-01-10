-- Fix handle_new_user function to use first_name instead of full_name
-- Migration: 20260113000000_fix_handle_new_user_function.sql

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
  
  -- Create profile with first_name (primary field) - only if profile doesn't exist
  INSERT INTO public.profiles (user_id, email, first_name)
  VALUES (NEW.id, user_email, user_first_name)
  ON CONFLICT (user_id) DO NOTHING; -- Don't overwrite if profile already exists
  
  -- Assign role - only if role doesn't exist
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role)
  ON CONFLICT (user_id, role) DO NOTHING; -- Don't overwrite if role already exists
  
  RETURN NEW;
END;
$$;

