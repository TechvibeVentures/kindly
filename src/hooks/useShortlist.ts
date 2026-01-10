import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getShortlist,
  addToShortlist as addToShortlistDb,
  removeFromShortlist as removeFromShortlistDb,
  isInShortlist as isInShortlistDb,
} from '@/lib/db/shortlist';

/**
 * Hook to get the current user's shortlist
 */
export function useShortlist() {
  return useQuery({
    queryKey: ['shortlist'],
    queryFn: getShortlist,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to add a candidate to shortlist
 */
export function useAddToShortlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToShortlistDb,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shortlist'] });
    },
  });
}

/**
 * Hook to remove a candidate from shortlist
 */
export function useRemoveFromShortlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromShortlistDb,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shortlist'] });
    },
  });
}

/**
 * Hook to check if a candidate is in shortlist
 */
export function useIsInShortlist(candidateId: string | null) {
  return useQuery({
    queryKey: ['shortlist', 'check', candidateId],
    queryFn: () => candidateId ? isInShortlistDb(candidateId) : false,
    enabled: !!candidateId,
    staleTime: 2 * 60 * 1000,
  });
}

