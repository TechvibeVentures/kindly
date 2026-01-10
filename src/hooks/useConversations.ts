import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserConversations,
  getConversationById,
  getOrCreateConversation,
  getConversationMessages,
  sendMessage as sendMessageDb,
  updateConversationStatus,
  getConversationTopics,
  updateTopicCoverage,
  type Conversation,
  type Message,
  type ConversationTopic,
} from '@/lib/db/conversations';

/**
 * Hook to get all conversations for the current user
 */
export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: getUserConversations,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to get a single conversation by ID
 */
export function useConversation(conversationId: string | null) {
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => conversationId ? getConversationById(conversationId) : null,
    enabled: !!conversationId,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to get or create a conversation with a candidate
 */
export function useGetOrCreateConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (candidateId: string) => getOrCreateConversation(candidateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

/**
 * Hook to get messages for a conversation
 */
export function useConversationMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => conversationId ? getConversationMessages(conversationId) : [],
    enabled: !!conversationId,
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });
}

/**
 * Hook to send a message
 */
export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ conversationId, text }: { conversationId: string; text: string }) =>
      sendMessageDb(conversationId, text),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

/**
 * Hook to update conversation status
 */
export function useUpdateConversationStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ conversationId, status }: { conversationId: string; status: 'active' | 'interested' | 'declined' | 'archived' }) =>
      updateConversationStatus(conversationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

/**
 * Hook to get conversation topics
 */
export function useConversationTopics(conversationId: string | null) {
  return useQuery({
    queryKey: ['conversation-topics', conversationId],
    queryFn: () => conversationId ? getConversationTopics(conversationId) : [],
    enabled: !!conversationId,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to update topic coverage
 */
export function useUpdateTopicCoverage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ conversationId, topicId, isSeeker, covered }: { 
      conversationId: string; 
      topicId: string; 
      isSeeker: boolean; 
      covered: boolean;
    }) =>
      updateTopicCoverage(conversationId, topicId, isSeeker, covered),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversation-topics', variables.conversationId] });
    },
  });
}

