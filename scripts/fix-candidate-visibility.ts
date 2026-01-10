/**
 * Script to fix candidate visibility flags
 * Ensures all male candidate profiles are set to is_public = true and is_active = true
 * Run with: npx tsx scripts/fix-candidate-visibility.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
dotenv.config({ path: join(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing required environment variables');
  console.error('Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Use service role key to bypass RLS for migration
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function fixCandidateVisibility() {
  console.log('Checking candidate profiles...\n');

  // First, check what profiles exist
  const { data: allProfiles, error: fetchError } = await supabase
    .from('profiles')
    .select('id, display_name, gender, is_public, is_active, user_id')
    .is('user_id', null); // Only check public candidate profiles (no user_id)

  if (fetchError) {
    console.error('Error fetching profiles:', fetchError);
    process.exit(1);
  }

  console.log(`Found ${allProfiles?.length || 0} candidate profiles (user_id is null)`);
  
  if (!allProfiles || allProfiles.length === 0) {
    console.log('No candidate profiles found. Make sure you have run the migration script first.');
    console.log('Run: npx tsx scripts/migrate-candidates.ts');
    process.exit(0);
  }

  // Check male profiles
  const maleProfiles = allProfiles.filter(p => p.gender === 'male');
  console.log(`Found ${maleProfiles.length} male profiles\n`);

  // Find profiles that need fixing
  const needsFix = allProfiles.filter(p => 
    p.gender === 'male' && (p.is_public !== true || p.is_active !== true)
  );

  console.log(`Profiles needing fix: ${needsFix.length}`);
  
  if (needsFix.length > 0) {
    needsFix.forEach(p => {
      console.log(`  - ${p.display_name}: is_public=${p.is_public}, is_active=${p.is_active}`);
    });
  }

  // Fix profiles
  if (needsFix.length > 0) {
    console.log('\nFixing profiles...');
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        is_public: true, 
        is_active: true 
      })
      .in('id', needsFix.map(p => p.id));

    if (updateError) {
      console.error('Error updating profiles:', updateError);
      process.exit(1);
    }

    console.log(`✓ Fixed ${needsFix.length} profiles`);
  } else {
    console.log('\n✓ All profiles are correctly configured');
  }

  // Verify final state
  const { data: finalCheck, error: finalError } = await supabase
    .from('profiles')
    .select('id, display_name, gender, is_public, is_active')
    .eq('gender', 'male')
    .eq('is_public', true)
    .eq('is_active', true)
    .is('user_id', null);

  if (finalError) {
    console.error('Error verifying:', finalError);
    process.exit(1);
  }

  console.log(`\n✓ Final count: ${finalCheck?.length || 0} male candidates visible in Discover`);
}

// Run script
fixCandidateVisibility()
  .then(() => {
    console.log('\nScript finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

