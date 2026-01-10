-- Reorder fields: Move basic/primary fields to the front of the table
-- This is a cosmetic change for better organization - fields after lifestyle_rhythm
-- should be moved to the front as they are primary/basic fields

-- Note: PostgreSQL doesn't support reordering columns directly.
-- This migration documents the desired order. The actual column order in PostgreSQL
-- doesn't affect functionality, but we can recreate the table if needed.

-- For now, we'll just ensure the structure is correct.
-- The fields that should be at the front (after id, user_id, email) are:
-- - gender
-- - birth_year
-- - phone
-- - verified
-- - onboarding_completed
-- - is_public
-- - is_active

-- These are already in the table, just documenting the desired order.
-- In practice, column order doesn't matter for functionality.

-- If you want to physically reorder columns, you would need to:
-- 1. Create a new table with columns in desired order
-- 2. Copy data from old table
-- 3. Drop old table
-- 4. Rename new table
-- But this is not necessary for functionality.


