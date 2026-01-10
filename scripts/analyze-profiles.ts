/**
 * Script to analyze all profiles in the database
 * Shows breakdown by gender, user_id status, and visibility flags
 * Run with: npx tsx scripts/analyze-profiles.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
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

// Use service role key to bypass RLS for analysis
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function analyzeProfiles() {
  console.log('Analyzing all profiles in database...\n');

  // Fetch all profiles
  const { data: allProfiles, error: fetchError } = await supabase
    .from('profiles')
    .select('id, display_name, email, gender, is_public, is_active, user_id')
    .order('created_at', { ascending: false });

  if (fetchError) {
    console.error('Error fetching profiles:', fetchError);
    process.exit(1);
  }

  const total = allProfiles?.length || 0;
  console.log(`Total profiles in database: ${total}\n`);

  // Breakdown by user_id status
  const candidateProfiles = allProfiles?.filter(p => p.user_id === null) || [];
  const userProfiles = allProfiles?.filter(p => p.user_id !== null) || [];
  
  console.log('=== Breakdown by Profile Type ===');
  console.log(`Candidate profiles (user_id IS NULL): ${candidateProfiles.length}`);
  console.log(`User profiles (user_id IS NOT NULL): ${userProfiles.length}\n`);

  // Breakdown by gender
  console.log('=== Breakdown by Gender ===');
  const maleProfiles = allProfiles?.filter(p => p.gender === 'male') || [];
  const femaleProfiles = allProfiles?.filter(p => p.gender === 'female') || [];
  const nonBinaryProfiles = allProfiles?.filter(p => p.gender === 'non-binary') || [];
  const noGenderProfiles = allProfiles?.filter(p => !p.gender) || [];
  
  console.log(`Male: ${maleProfiles.length}`);
  console.log(`Female: ${femaleProfiles.length}`);
  console.log(`Non-binary: ${nonBinaryProfiles.length}`);
  console.log(`No gender set: ${noGenderProfiles.length}\n`);

  // Male candidate profiles breakdown
  console.log('=== Male Candidate Profiles (user_id IS NULL) ===');
  const maleCandidates = candidateProfiles.filter(p => p.gender === 'male');
  console.log(`Total male candidates: ${maleCandidates.length}`);
  
  const publicMaleCandidates = maleCandidates.filter(p => p.is_public === true);
  const activeMaleCandidates = publicMaleCandidates.filter(p => p.is_active === true);
  
  console.log(`Public (is_public = true): ${publicMaleCandidates.length}`);
  console.log(`Active (is_active = true): ${activeMaleCandidates.length}`);
  console.log(`Visible in Discover: ${activeMaleCandidates.length}\n`);

  // Show profiles that are NOT visible
  const notVisible = maleCandidates.filter(p => p.is_public !== true || p.is_active !== true);
  if (notVisible.length > 0) {
    console.log('=== Male Candidates NOT Visible in Discover ===');
    notVisible.forEach(p => {
      console.log(`  - ${p.display_name || p.email || p.id}:`);
      console.log(`    is_public: ${p.is_public}, is_active: ${p.is_active}`);
    });
    console.log('');
  }

  // Show male user profiles (for reference)
  const maleUserProfiles = userProfiles.filter(p => p.gender === 'male');
  if (maleUserProfiles.length > 0) {
    console.log(`=== Male User Profiles (user_id IS NOT NULL) ===`);
    console.log(`Total: ${maleUserProfiles.length}`);
    console.log('(These are logged-in user profiles, not shown in Discover)\n');
  }

  // Summary
  console.log('=== Summary ===');
  console.log(`Total profiles: ${total}`);
  console.log(`Total male profiles: ${maleProfiles.length}`);
  console.log(`Male candidate profiles (user_id IS NULL): ${maleCandidates.length}`);
  console.log(`Male candidates visible in Discover: ${activeMaleCandidates.length}`);
  
  if (maleCandidates.length !== activeMaleCandidates.length) {
    console.log(`\n⚠️  ${maleCandidates.length - activeMaleCandidates.length} male candidate(s) are not visible due to is_public or is_active flags`);
  }
}

// Run script
analyzeProfiles()
  .then(() => {
    console.log('\nAnalysis complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

