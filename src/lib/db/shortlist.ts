import { supabase } from '@/integrations/supabase/client';

export interface ShortlistItem {
  id: string;
  user_id: string;
  candidate_id: string;
  created_at: string;
}

/**
 * Get all shortlisted candidate IDs for the current user
 */
export async function getShortlist(): Promise<string[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];

  const { data, error } = await supabase
    .from('shortlist')
    .select('candidate_id')
    .eq('user_id', session.user.id);

  if (error) {
    console.error('Error fetching shortlist:', error);
    return [];
  }

  return data?.map(item => item.candidate_id) || [];
}

/**
 * Add a candidate to shortlist
 */
export async function addToShortlist(candidateId: string): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('shortlist')
    .insert({
      user_id: session.user.id,
      candidate_id: candidateId
    });

  if (error) {
    // Ignore duplicate key errors (already in shortlist)
    if (error.code !== '23505') {
      throw error;
    }
  }
}

/**
 * Remove a candidate from shortlist
 */
export async function removeFromShortlist(candidateId: string): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('shortlist')
    .delete()
    .eq('user_id', session.user.id)
    .eq('candidate_id', candidateId);

  if (error) throw error;
}

/**
 * Check if a candidate is in shortlist
 */
export async function isInShortlist(candidateId: string): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return false;

  const { data, error } = await supabase
    .from('shortlist')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('candidate_id', candidateId)
    .maybeSingle();

  if (error) {
    console.error('Error checking shortlist:', error);
    return false;
  }

  return !!data;
}

