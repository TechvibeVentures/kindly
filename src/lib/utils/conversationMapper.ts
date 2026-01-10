/**
 * Utility to map database Conversation to frontend Conversation format
 */

import type { Conversation as DbConversation, ConversationTopic } from '@/lib/db/conversations';
import type { Conversation, Topic } from '@/data/conversations';
import { useCurrentUserProfile } from '@/hooks/useProfile';

const topicTranslationMap: Record<string, string> = {
  'parenting': 'topicParenting',
  'conception': 'topicConception',
  'custody': 'topicCustody',
  'living': 'topicLiving',
  'legal': 'topicLegal',
  'financial': 'topicFinancial',
};

/**
 * Map database conversation to frontend format
 */
export function mapDbConversationToFrontend(
  dbConv: DbConversation,
  messages: any[],
  topics: ConversationTopic[],
  currentUserId: string
): Conversation {
  // Determine if current user is the seeker (user_id) or candidate
  const isSeeker = dbConv.user_id === currentUserId;
  const otherProfile = isSeeker ? dbConv.candidate_profile : dbConv.user_profile;
  
  return {
    id: dbConv.id,
    candidateId: dbConv.candidate_id,
    seekerName: isSeeker ? (dbConv.user_profile?.display_name || dbConv.user_profile?.full_name || 'You') : (otherProfile?.display_name || otherProfile?.full_name || 'Unknown'),
    messages: messages.map(msg => ({
      id: msg.id,
      senderId: msg.sender_id === currentUserId ? 'seeker' : 'candidate',
      text: msg.text,
      timestamp: msg.created_at,
    })),
    topics: topics.map(topic => ({
      id: topic.topic_id,
      name: topic.topic_id.charAt(0).toUpperCase() + topic.topic_id.slice(1).replace(/_/g, ' '),
      translationKey: topicTranslationMap[topic.topic_id] || topic.topic_id,
      seekerCovered: topic.seeker_covered,
      candidateCovered: topic.candidate_covered,
    })),
    status: dbConv.status as 'active' | 'interested' | 'declined',
    lastUpdated: dbConv.last_message_at ? new Date(dbConv.last_message_at).toISOString().split('T')[0] : new Date(dbConv.created_at).toISOString().split('T')[0],
  };
}

