import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Invitation = Tables<'invitations'>;
export type InvitationInsert = TablesInsert<'invitations'>;
export type InvitationUpdate = TablesUpdate<'invitations'>;

/**
 * Get an invitation by code
 */
export async function getInvitationByCode(code: string): Promise<Invitation | null> {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('code', code)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Create a new invitation
 */
export async function createInvitation(invitation: InvitationInsert): Promise<Invitation> {
  const { data, error } = await supabase
    .from('invitations')
    .insert(invitation)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an invitation
 */
export async function updateInvitation(
  invitationId: string,
  updates: InvitationUpdate
): Promise<Invitation> {
  const { data, error } = await supabase
    .from('invitations')
    .update(updates)
    .eq('id', invitationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all invitations (admin only)
 */
export async function getAllInvitations(): Promise<Invitation[]> {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Check if an invitation code is valid
 */
export async function validateInvitationCode(code: string): Promise<boolean> {
  const invitation = await getInvitationByCode(code);
  if (!invitation) return false;
  
  // Check if expired
  if (new Date(invitation.expires_at) < new Date()) return false;
  
  // Check if already accepted or revoked
  if (invitation.status !== 'pending') return false;
  
  return true;
}

/**
 * Accept an invitation
 */
export async function acceptInvitation(code: string, userId: string): Promise<Invitation> {
  const invitation = await getInvitationByCode(code);
  if (!invitation) throw new Error('Invitation not found');
  
  if (!await validateInvitationCode(code)) {
    throw new Error('Invitation is invalid or expired');
  }

  const { data, error } = await supabase
    .from('invitations')
    .update({
      status: 'accepted',
      accepted_by: userId,
      accepted_at: new Date().toISOString(),
    })
    .eq('code', code)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Generate a unique invitation code
 */
export function generateInvitationCode(): string {
  return `K${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}


