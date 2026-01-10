import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Conversation = Tables<'conversations'> & {
  candidate_profile?: any;
  user_profile?: any;
  last_message?: Tables<'messages'>;
  unread_count?: number;
};

export type Message = Tables<'messages'>;
export type ConversationTopic = Tables<'conversation_topics'>;

export type ConversationInsert = TablesInsert<'conversations'>;
export type MessageInsert = TablesInsert<'messages'>;
export type ConversationTopicUpdate = TablesUpdate<'conversation_topics'>;

/**
 * Get all conversations for the current user with messages and topics
 */
export async function getUserConversations(): Promise<any[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(`
      *,
      candidate_profile:profiles!conversations_candidate_id_fkey(*),
      user_profile:profiles!conversations_user_id_fkey(*)
    `)
    .or(`user_id.eq.${session.user.id},candidate_id.eq.${session.user.id}`)
    .order('last_message_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  // Fetch messages and topics for each conversation
  const conversationsWithData = await Promise.all(
    (conversations || []).map(async (conv) => {
      const [messagesResult, topicsResult] = await Promise.all([
        supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: true }),
        supabase
          .from('conversation_topics')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('topic_id', { ascending: true })
      ]);

      return {
        ...conv,
        messages: messagesResult.data || [],
        topics: topicsResult.data || [],
      };
    })
  );

  return conversationsWithData;
}

/**
 * Get a conversation by ID
 */
export async function getConversationById(conversationId: string): Promise<Conversation | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      candidate_profile:profiles!conversations_candidate_id_fkey(*),
      user_profile:profiles!conversations_user_id_fkey(*)
    `)
    .eq('id', conversationId)
    .or(`user_id.eq.${session.user.id},candidate_id.eq.${session.user.id}`)
    .maybeSingle();

  if (error) throw error;
  return data as Conversation | null;
}

/**
 * Get or create a conversation with a candidate
 */
export async function getOrCreateConversation(candidateId: string): Promise<any> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  // Check if conversation already exists
  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('candidate_id', candidateId)
    .maybeSingle();

  let conversation;
  if (existing) {
    // Fetch with related data
    const { data } = await supabase
      .from('conversations')
      .select(`
        *,
        candidate_profile:profiles!conversations_candidate_id_fkey(*),
        user_profile:profiles!conversations_user_id_fkey(*)
      `)
      .eq('id', existing.id)
      .single();
    conversation = data;
  } else {
    // Create new conversation
    const { data: newConversation, error } = await supabase
      .from('conversations')
      .insert({
        user_id: session.user.id,
        candidate_id: candidateId,
        status: 'active'
      })
      .select(`
        *,
        candidate_profile:profiles!conversations_candidate_id_fkey(*),
        user_profile:profiles!conversations_user_id_fkey(*)
      `)
      .single();

    if (error) throw error;
    conversation = newConversation;
  }

  // Fetch messages and topics
  const [messagesResult, topicsResult] = await Promise.all([
    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true }),
    supabase
      .from('conversation_topics')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('topic_id', { ascending: true })
  ]);

  return {
    ...conversation,
    messages: messagesResult.data || [],
    topics: topicsResult.data || [],
  };
}

/**
 * Get messages for a conversation
 */
export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  // Verify user has access to this conversation
  const { data: conversation } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', conversationId)
    .or(`user_id.eq.${session.user.id},candidate_id.eq.${session.user.id}`)
    .maybeSingle();

  if (!conversation) {
    throw new Error('Conversation not found or access denied');
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as Message[];
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(conversationId: string, text: string): Promise<Message> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  // Verify user has access to this conversation
  const { data: conversation } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', conversationId)
    .or(`user_id.eq.${session.user.id},candidate_id.eq.${session.user.id}`)
    .maybeSingle();

  if (!conversation) {
    throw new Error('Conversation not found or access denied');
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: session.user.id,
      text: text.trim()
    })
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

/**
 * Update conversation status
 */
export async function updateConversationStatus(
  conversationId: string,
  status: 'active' | 'interested' | 'declined' | 'archived'
): Promise<Conversation> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('conversations')
    .update({ status })
    .eq('id', conversationId)
    .or(`user_id.eq.${session.user.id},candidate_id.eq.${session.user.id}`)
    .select(`
      *,
      candidate_profile:profiles!conversations_candidate_id_fkey(*),
      user_profile:profiles!conversations_user_id_fkey(*)
    `)
    .single();

  if (error) throw error;
  return data as Conversation;
}

/**
 * Get conversation topics
 */
export async function getConversationTopics(conversationId: string): Promise<ConversationTopic[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  // Verify access
  const { data: conversation } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', conversationId)
    .or(`user_id.eq.${session.user.id},candidate_id.eq.${session.user.id}`)
    .maybeSingle();

  if (!conversation) {
    throw new Error('Conversation not found or access denied');
  }

  const { data, error } = await supabase
    .from('conversation_topics')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('topic_id', { ascending: true });

  if (error) throw error;
  return (data || []) as ConversationTopic[];
}

/**
 * Update topic coverage status
 */
export async function updateTopicCoverage(
  conversationId: string,
  topicId: string,
  isSeeker: boolean,
  covered: boolean
): Promise<ConversationTopic> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  // Verify access
  const { data: conversation } = await supabase
    .from('conversations')
    .select('id, user_id, candidate_id')
    .eq('id', conversationId)
    .maybeSingle();

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  // Verify user is part of this conversation
  if (conversation.user_id !== session.user.id && conversation.candidate_id !== session.user.id) {
    throw new Error('Access denied');
  }

  // Determine which field to update
  const updateField = isSeeker ? 'seeker_covered' : 'candidate_covered';

  const { data, error } = await supabase
    .from('conversation_topics')
    .update({ [updateField]: covered })
    .eq('conversation_id', conversationId)
    .eq('topic_id', topicId)
    .select()
    .single();

  if (error) {
    // If topic doesn't exist, create it
    if (error.code === 'PGRST116') {
      const { data: newTopic, error: insertError } = await supabase
        .from('conversation_topics')
        .insert({
          conversation_id: conversationId,
          topic_id: topicId,
          [updateField]: covered
        })
        .select()
        .single();
      if (insertError) throw insertError;
      return newTopic as ConversationTopic;
    }
    throw error;
  }

  return data as ConversationTopic;
}

