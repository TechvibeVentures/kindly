-- Setup automatic PostgREST schema cache reload on DDL changes
-- This ensures PostgREST schema cache is automatically reloaded when schema changes occur

-- Create function to notify PostgREST to reload schema
CREATE OR REPLACE FUNCTION pgrst_watch() RETURNS event_trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $$
BEGIN
  NOTIFY pgrst, 'reload schema';
END;
$$;

-- Create event trigger that fires on DDL command end
-- This will automatically reload PostgREST schema cache whenever a table/view/function changes
DROP EVENT TRIGGER IF EXISTS pgrst_watch;
CREATE EVENT TRIGGER pgrst_watch
  ON ddl_command_end
  EXECUTE FUNCTION pgrst_watch();

-- Immediately trigger a reload of the schema cache
NOTIFY pgrst, 'reload schema';

