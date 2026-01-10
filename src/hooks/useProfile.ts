import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  getProfileByUserId,
  searchProfiles,
  type Profile,
  type ProfileUpdate,
} from '@/lib/db';

/**
 * Hook to get the current user's profile
 */
export function useCurrentUserProfile() {
  return useQuery({
    queryKey: ['profile', 'current'],
    queryFn: getCurrentUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get a profile by user ID
 */
export function useProfile(userId: string | null) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => userId ? getProfileByUserId(userId) : null,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to update the current user's profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCurrentUserProfile,
    onSuccess: (data) => {
      // Invalidate and refetch profile queries
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.setQueryData(['profile', 'current'], data);
      queryClient.setQueryData(['profile', data.user_id], data);
    },
  });
}

/**
 * Hook to search profiles
 */
export function useSearchProfiles(query: string) {
  return useQuery({
    queryKey: ['profiles', 'search', query],
    queryFn: () => searchProfiles(query),
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}


