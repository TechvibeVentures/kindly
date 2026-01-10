import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Conversation, Topic } from '@/data/conversations';
import { useCandidates } from '@/hooks/useCandidates';
import { useCurrentUserProfile } from '@/hooks/useProfile';
import { useConversations, useSendMessage, useUpdateConversationStatus, useUpdateTopicCoverage } from '@/hooks/useConversations';
import { useShortlist, useAddToShortlist, useRemoveFromShortlist } from '@/hooks/useShortlist';
import type { CandidateProfile } from '@/lib/db/candidates';
import { mapProfilesToCandidates } from '@/lib/utils/candidateMapper';
import { mapDbConversationToFrontend } from '@/lib/utils/conversationMapper';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'seeker' | 'candidate';

interface Filters {
  ageRange: [number, number];
  location: string;
  maxDistance: number;
  openToRelocation: boolean;
  ethnicity: string[];
  languages: string[];
  lookingFor: string[];
  custodyRange: [number, number];
}

import type { Candidate } from '@/lib/utils/candidateMapper';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  shortlist: string[];
  addToShortlist: (id: string) => Promise<void>;
  removeFromShortlist: (id: string) => Promise<void>;
  isInShortlist: (id: string) => boolean;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  filteredCandidates: Candidate[];
  candidates: Candidate[];
  isLoadingCandidates: boolean;
  mockConversations: Conversation[];
  updateConversationStatus: (id: string, status: Conversation['status']) => void;
  sendMessage: (conversationId: string, text: string) => void;
  markTopicCovered: (conversationId: string, topicId: string) => void;
  getTopicStatus: (topic: Topic) => 'none' | 'partial' | 'covered';
}

const defaultFilters: Filters = {
  ageRange: [25, 50],
  location: '',
  maxDistance: 500,
  openToRelocation: false,
  ethnicity: [],
  languages: [],
  lookingFor: [],
  custodyRange: [0, 100]
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('seeker');
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  
  // Fetch candidates from database
  const { data: candidateProfiles = [], isLoading: isLoadingCandidates } = useCandidates();
  
  // Fetch current user's profile for match calculation
  const { data: currentUserProfile } = useCurrentUserProfile();
  
  // Fetch conversations from database
  const { data: dbConversations = [], isLoading: isLoadingConversations } = useConversations();
  const sendMessageMutation = useSendMessage();
  const updateStatusMutation = useUpdateConversationStatus();
  const updateTopicMutation = useUpdateTopicCoverage();
  
  // Fetch shortlist from database
  const { data: shortlist = [] } = useShortlist();
  const addToShortlistMutation = useAddToShortlist();
  const removeFromShortlistMutation = useRemoveFromShortlist();
  
  // Get current user ID
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUserId(session?.user?.id || null);
    });
  }, []);

  // Map database conversations to frontend format
  const conversations = useMemo(() => {
    if (!currentUserId || !dbConversations.length) return [];
    
    return dbConversations.map((dbConv: any) => 
      mapDbConversationToFrontend(
        dbConv,
        dbConv.messages || [],
        dbConv.topics || [],
        currentUserId
      )
    );
  }, [dbConversations, currentUserId]);
  
  // Convert database profiles to Candidate format and calculate compatibility scores
  const candidates = useMemo(() => 
    mapProfilesToCandidates(candidateProfiles, currentUserProfile),
    [candidateProfiles, currentUserProfile]
  );

  const addToShortlist = async (id: string) => {
    try {
      await addToShortlistMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error adding to shortlist:', error);
    }
  };

  const removeFromShortlist = async (id: string) => {
    try {
      await removeFromShortlistMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error removing from shortlist:', error);
    }
  };

  const isInShortlist = (id: string) => shortlist.includes(id);

  const filteredCandidates = useMemo(() => {
    console.log(`Filtering ${candidates.length} candidates with filters:`, filters);
    
    const filtered = candidates.filter(candidate => {
      // Age match: if age is 0 or missing, skip age filter (show all)
      const ageMatch = !candidate.age || candidate.age === 0 || 
        (candidate.age >= (filters.ageRange?.[0] ?? 25) && candidate.age <= (filters.ageRange?.[1] ?? 50));
      
      // Ethnicity match: only filter if ethnicity filter is set AND candidate has ethnicity
      const ethnicityMatch = !filters.ethnicity?.length || 
        !candidate.ethnicity ||
        filters.ethnicity.includes(candidate.ethnicity);
      
      // Language match: only filter if language filter is set
      const languageMatch = !filters.languages?.length || 
        !candidate.languages?.length ||
        filters.languages.some(l => candidate.languages.includes(l));
      
      // LookingFor match: only filter if lookingFor filter is set AND candidate has lookingFor
      const lookingForMatch = !filters.lookingFor?.length || 
        !candidate.lookingFor ||
        filters.lookingFor.some(term => candidate.lookingFor.toLowerCase().includes(term.toLowerCase()));
      
      // Involvement/Custody match: handle empty involvement gracefully
      const involvementStr = candidate.involvement || '';
      const involvementPercent = involvementStr.includes('50/50') ? 50 :
        involvementStr.includes('60/40') ? 60 :
        involvementStr.includes('40/60') ? 40 : 
        involvementStr.includes('70/30') ? 70 :
        involvementStr.includes('30/70') ? 30 : 50; // Default to 50 if not specified
      const custodyMatch = involvementPercent >= (filters.custodyRange?.[0] ?? 0) && 
        involvementPercent <= (filters.custodyRange?.[1] ?? 100);
      
      const matches = ageMatch && ethnicityMatch && languageMatch && lookingForMatch && custodyMatch;
      
      if (!matches && candidates.length <= 10) {
        console.log(`Candidate ${candidate.id} (${candidate.displayName}) filtered out:`, {
          age: candidate.age,
          ageMatch,
          ethnicity: candidate.ethnicity,
          ethnicityMatch,
          languages: candidate.languages,
          languageMatch,
          lookingFor: candidate.lookingFor,
          lookingForMatch,
          involvement: candidate.involvement,
          involvementPercent,
          custodyMatch
        });
      }
      
      return matches;
    });
    
    console.log(`Filtered to ${filtered.length} candidates`);
    return filtered;
  }, [candidates, filters]);

  const updateConversationStatus = async (id: string, status: Conversation['status']) => {
    try {
      await updateStatusMutation.mutateAsync({ conversationId: id, status });
    } catch (error) {
      console.error('Failed to update conversation status:', error);
    }
  };

  const sendMessage = async (conversationId: string, text: string) => {
    try {
      await sendMessageMutation.mutateAsync({ conversationId, text });
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  const markTopicCovered = async (conversationId: string, topicId: string) => {
    if (!currentUserId) return;
    
    // Find the conversation to determine if user is seeker
    const conv = dbConversations.find((c: any) => c.id === conversationId);
    if (!conv) return;
    
    const isSeeker = conv.user_id === currentUserId;
    
    // Get current topic state
    const topic = conv.topics?.find((t: any) => t.topic_id === topicId);
    const currentCovered = isSeeker ? topic?.seeker_covered : topic?.candidate_covered;
    
    try {
      await updateTopicMutation.mutateAsync({
        conversationId,
        topicId,
        isSeeker,
        covered: !currentCovered
      });
    } catch (error) {
      console.error('Failed to update topic coverage:', error);
    }
  };

  const getTopicStatus = (topic: Topic): 'none' | 'partial' | 'covered' => {
    if (topic.seekerCovered && topic.candidateCovered) {
      return 'covered';
    }
    if (topic.seekerCovered || topic.candidateCovered) {
      return 'partial';
    }
    return 'none';
  };

  return (
    <AppContext.Provider value={{
      userRole,
      setUserRole,
      shortlist,
      addToShortlist,
      removeFromShortlist,
      isInShortlist,
      filters,
      setFilters,
      filteredCandidates,
      candidates,
      isLoadingCandidates,
      mockConversations: conversations,
      updateConversationStatus,
      sendMessage,
      markTopicCovered,
      getTopicStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
