/**
 * Migration script to transfer mock candidates to database
 * Run with: npx tsx scripts/migrate-candidates.ts
 */

import { createClient } from '@supabase/supabase-js';
import { candidates } from '../src/data/candidates';
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

async function migrateCandidates() {
  console.log(`Starting migration of ${candidates.length} candidates...`);

  let successCount = 0;
  let errorCount = 0;

  for (const candidate of candidates) {
    try {
      // Check if profile already exists (by checking if there's a profile with matching display_name and city)
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('display_name', candidate.displayName)
        .eq('city', candidate.city)
        .maybeSingle();

      if (existing) {
        console.log(`Skipping ${candidate.displayName} - already exists`);
        continue;
      }

      // Insert profile without user_id (for public candidate profiles)
      // In production, these would be linked to real user accounts
      
      // Calculate involvement_percent from involvement text
      const involvementPercent = candidate.involvement.includes('50/50') ? 50 :
        candidate.involvement.includes('60/40') ? 60 :
        candidate.involvement.includes('40/60') ? 40 : 50;
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: null, // NULL for public candidate profiles
          email: `candidate-${candidate.id}@kindly.example.com`,
          display_name: candidate.displayName,
          full_name: candidate.firstName,
          photo_url: candidate.photo,
          bio: candidate.bio,
          first_name: candidate.firstName,
          gender: candidate.gender,
          age: candidate.age,
          city: candidate.city,
          country: candidate.country,
          nationality: candidate.nationality,
          languages: candidate.languages,
          looking_for_text: candidate.lookingFor, // Text version for backward compatibility
          looking_for: [], // Array version (empty for candidates)
          vision: candidate.vision,
          qualities: candidate.values || [], // Core values (mapped from values)
          parenting_philosophy: candidate.parentingPhilosophy,
          involvement: candidate.involvement, // Text version like "50/50 custody"
          involvement_percent: involvementPercent, // Numeric version
          involvement_flexibility: candidate.involvementFlexibility,
          preferred_method: candidate.preferredMethod,
          open_to_relocation: candidate.openToRelocation,
          relationship_status: candidate.relationshipStatus,
          parenting_status: candidate.parentingStatus,
          occupation: candidate.occupation,
          profession: candidate.occupation, // Map occupation to profession
          education: candidate.education,
          financial_situation: candidate.financialSituation,
          lifestyle_rhythm: candidate.lifestyleRhythm,
          family_support: candidate.familySupport,
          smoking: candidate.smoking,
          drinking: candidate.alcohol, // Map alcohol to drinking field
          exercise: candidate.exercise,
          diet: candidate.diet,
          cannabis: candidate.cannabis || null,
          drugs: candidate.drugs || null,
          height: candidate.height || null,
          weight: candidate.weight || null,
          religion: candidate.religion || null,
          politics: candidate.politics || null,
          ethnicity: candidate.ethnicity || null,
          star_sign: candidate.starSign || null,
          pets: candidate.pets || null,
          compatibility_score: candidate.compatibilityScore,
          is_public: true, // Make mock candidates publicly visible
          is_active: true,
          onboarding_completed: true,
        })
        .select()
        .single();

      if (error) {
        console.error(`Error migrating ${candidate.displayName}:`, error.message);
        errorCount++;
      } else {
        console.log(`✓ Migrated ${candidate.displayName} (${candidate.city})`);
        successCount++;
      }
    } catch (error: any) {
      console.error(`Error migrating ${candidate.displayName}:`, error.message);
      errorCount++;
    }
  }

  console.log('\nMigration complete!');
  console.log(`✓ Success: ${successCount}`);
  console.log(`✗ Errors: ${errorCount}`);
}

// Run migration
migrateCandidates()
  .then(() => {
    console.log('Migration script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });

