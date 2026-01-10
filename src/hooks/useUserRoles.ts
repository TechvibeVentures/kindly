import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  hasRole,
  isCurrentUserAdmin,
  getUserRoles,
  assignRole,
  removeRole,
} from '@/lib/db';

/**
 * Hook to check if current user is admin
 */
export function useIsAdmin() {
  return useQuery({
    queryKey: ['user', 'roles', 'admin'],
    queryFn: isCurrentUserAdmin,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to check if a user has a specific role
 */
export function useHasRole(userId: string | null, role: 'admin' | 'user') {
  return useQuery({
    queryKey: ['user', 'roles', userId, role],
    queryFn: () => userId ? hasRole(userId, role) : false,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get all roles for a user
 */
export function useUserRoles(userId: string | null) {
  return useQuery({
    queryKey: ['user', 'roles', userId],
    queryFn: () => userId ? getUserRoles(userId) : [],
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to assign a role to a user (admin only)
 */
export function useAssignRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'admin' | 'user' }) =>
      assignRole(userId, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', 'roles', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['user', 'roles'] });
    },
  });
}

/**
 * Hook to remove a role from a user (admin only)
 */
export function useRemoveRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'admin' | 'user' }) =>
      removeRole(userId, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', 'roles', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['user', 'roles'] });
    },
  });
}


