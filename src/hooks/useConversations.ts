import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
 * Hook to get all conversations for the current user.
 * Subscribes to realtime changes on conversations and messages.
 */
export function useConversations() {
  const queryClient = useQueryClient();
  const result = useQuery({
    queryKey: ['conversations'],
    queryFn: getUserConversations,
    staleTime: 30 * 1000, // 30 seconds
  });

  useEffect(() => {
    const channel = supabase
      .channel('conversations-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return result;
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
 * Hook to get messages for a conversation.
 * Subscribes to realtime INSERT on messages table for this conversation.
 */
export function useConversationMessages(conversationId: string | null) {
  const queryClient = useQueryClient();
  const result = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => conversationId ? getConversationMessages(conversationId) : [],
    enabled: !!conversationId,
    staleTime: 10 * 1000, // 10 seconds
  });

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);

  return result;
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
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

