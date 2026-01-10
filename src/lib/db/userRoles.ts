import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type UserRole = Tables<'user_roles'>;
export type UserRoleInsert = TablesInsert<'user_roles'>;
export type UserRoleUpdate = TablesUpdate<'user_roles'>;

/**
 * Check if a user has a specific role
 */
export async function hasRole(userId: string, role: 'admin' | 'user'): Promise<boolean> {
  const { data, error } = await supabase.rpc('has_role', {
    _user_id: userId,
    _role: role,
  });

  if (error) throw error;
  return data ?? false;
}

/**
 * Check if the current user is an admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return false;
  
  return hasRole(session.user.id, 'admin');
}

/**
 * Get all roles for a user
 */
export async function getUserRoles(userId: string): Promise<UserRole[]> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
}

/**
 * Assign a role to a user (admin only)
 */
export async function assignRole(userId: string, role: 'admin' | 'user'): Promise<UserRole> {
  const { data, error } = await supabase
    .from('user_roles')
    .upsert({
      user_id: userId,
      role,
    }, {
      onConflict: 'user_id,role',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Remove a role from a user (admin only)
 */
export async function removeRole(userId: string, role: 'admin' | 'user'): Promise<void> {
  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId)
    .eq('role', role);

  if (error) throw error;
}


