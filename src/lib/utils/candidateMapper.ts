/**
 * Utility to map database CandidateProfile to Candidate interface format
 * This provides backward compatibility with existing components
 */

import type { CandidateProfile } from '@/lib/db/candidates';
import { calculateCompatibility } from './matchAlgorithm';

export interface Candidate {
  id: string;
  firstName: string;
  displayName: string;
  gender: 'male' | 'female' | 'non-binary';
  age: number;
  city: string;
  country: string;
  nationality: string;
  languages: string[];
  photo: string;
  bio: string;
  lookingFor: string;
  vision: string;
  values: string[];
  parentingPhilosophy: string;
  involvement: string;
  involvementFlexibility: string;
  preferredMethod: 'natural' | 'assisted' | 'open'; // Deprecated - use conception_methods array instead
  openToRelocation: boolean;
  relationshipStatus: string;
  parentingStatus: string;
  occupation: string;
  education: string;
  financialSituation: string;
  lifestyleRhythm: string;
  familySupport: string;
  smoking: 'never' | 'occasionally' | 'regularly' | 'former';
  alcohol: 'never' | 'rarely' | 'socially' | 'regularly';
  exercise: 'daily' | 'several_weekly' | 'weekly' | 'occasionally' | 'rarely';
  diet: string;
  cannabis?: 'never' | 'sometimes' | 'often';
  drugs?: 'never' | 'sometimes' | 'often';
  height?: number;
  weight?: number;
  religion?: string;
  politics?: string;
  ethnicity?: string;
  starSign?: string;
  pets?: string;
  compatibilityScore: number;
}

/**
 * Convert CandidateProfile from database to Candidate interface
 */
export function mapProfileToCandidate(profile: CandidateProfile): Candidate {
  // Use first_name as primary, fallback to extracting from full_name/display_name
  const getFirstName = (name: string | null | undefined): string => {
    if (!name) return '';
    return name.split(' ')[0] || name;
  };
  
  const firstName = profile.first_name || 
                    getFirstName(profile.full_name) || 
                    getFirstName(profile.display_name) || 
                    '';
  const displayName = firstName || profile.display_name || profile.full_name || '';
  
  return {
    id: profile.id,
    firstName: firstName,
    displayName: displayName,
    gender: (profile.gender as 'male' | 'female' | 'non-binary') || 'non-binary',
    age: profile.age || 0,
    city: profile.city || '',
    country: profile.country || '',
    nationality: profile.nationality || '',
    languages: profile.languages || [],
    photo: profile.photo_url || '',
    bio: profile.bio || '',
    lookingFor: profile.looking_for || '',
    vision: profile.vision || '',
    values: profile.values || [],
    parentingPhilosophy: profile.parenting_philosophy || '',
    involvement: profile.involvement || '',
    involvementFlexibility: profile.involvement_flexibility || '',
    preferredMethod: 'open', // Deprecated - use conception_methods array instead (defaulting to 'open' for backward compatibility)
    openToRelocation: profile.open_to_relocation || false,
    relationshipStatus: profile.relationship_status || '',
    parentingStatus: profile.parenting_status || '',
    occupation: profile.occupation || '',
    education: profile.education || '',
    financialSituation: profile.financial_situation || '',
    lifestyleRhythm: profile.lifestyle_rhythm || '',
    familySupport: profile.family_support || '',
    smoking: (profile.smoking as any) || 'never',
    alcohol: (profile.alcohol as any) || 'never',
    exercise: (profile.exercise as any) || 'rarely',
    diet: profile.diet || '',
    cannabis: profile.cannabis as any,
    drugs: profile.drugs as any,
    height: profile.height || undefined,
    weight: profile.weight || undefined,
    religion: profile.religion || undefined,
    politics: profile.politics || undefined,
    ethnicity: profile.ethnicity || undefined,
    starSign: profile.star_sign || undefined,
    pets: profile.pets || undefined,
    compatibilityScore: 0, // Will be calculated dynamically by matching algorithm (not stored in DB)
  };
}

/**
 * Convert array of CandidateProfile to Candidate array
 * Optionally calculates compatibility scores if userProfile is provided
 */
export function mapProfilesToCandidates(
  profiles: CandidateProfile[],
  userProfile?: any | null
): Candidate[] {
  const candidates = profiles.map(mapProfileToCandidate);
  
  // Calculate compatibility scores if user profile is provided
  if (userProfile) {
    return candidates.map(candidate => ({
      ...candidate,
      compatibilityScore: calculateCompatibility(userProfile, profiles.find(p => p.id === candidate.id)!)
    }));
  }
  
  return candidates;
}

