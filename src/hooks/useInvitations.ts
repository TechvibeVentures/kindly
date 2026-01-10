import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllInvitations,
  createInvitation,
  updateInvitation,
  getInvitationByCode,
  validateInvitationCode,
  acceptInvitation,
  generateInvitationCode,
  type Invitation,
  type InvitationInsert,
  type InvitationUpdate,
} from '@/lib/db';

/**
 * Hook to get all invitations (admin only)
 */
export function useInvitations() {
  return useQuery({
    queryKey: ['invitations'],
    queryFn: getAllInvitations,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to get an invitation by code
 */
export function useInvitation(code: string | null) {
  return useQuery({
    queryKey: ['invitation', code],
    queryFn: () => code ? getInvitationByCode(code) : null,
    enabled: !!code,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to validate an invitation code
 */
export function useValidateInvitation(code: string | null) {
  return useQuery({
    queryKey: ['invitation', 'validate', code],
    queryFn: () => code ? validateInvitationCode(code) : false,
    enabled: !!code,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to create an invitation
 */
export function useCreateInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
  });
}

/**
 * Hook to update an invitation
 */
export function useUpdateInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: InvitationUpdate }) =>
      updateInvitation(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      queryClient.setQueryData(['invitation', data.code], data);
    },
  });
}

/**
 * Hook to accept an invitation
 */
export function useAcceptInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ code, userId }: { code: string; userId: string }) =>
      acceptInvitation(code, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      queryClient.setQueryData(['invitation', data.code], data);
    },
  });
}

/**
 * Export the code generator function
 */
export { generateInvitationCode };


