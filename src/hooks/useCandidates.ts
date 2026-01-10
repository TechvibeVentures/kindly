import { useQuery } from '@tanstack/react-query';
import {
  getAllCandidates,
  getCandidateById,
  searchCandidates,
  type CandidateProfile,
  type CandidateFilters,
} from '@/lib/db/candidates';

/**
 * Hook to get all candidates
 */
export function useCandidates() {
  return useQuery({
    queryKey: ['candidates'],
    queryFn: getAllCandidates,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get a candidate by ID
 */
export function useCandidate(id: string | null) {
  return useQuery({
    queryKey: ['candidate', id],
    queryFn: () => id ? getCandidateById(id) : null,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to search candidates with filters
 */
export function useSearchCandidates(filters: CandidateFilters) {
  return useQuery({
    queryKey: ['candidates', 'search', filters],
    queryFn: () => searchCandidates(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}


