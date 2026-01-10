-- Create conversation status enum
CREATE TYPE public.conversation_status AS ENUM ('active', 'interested', 'declined', 'archived');

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status conversation_status DEFAULT 'active' NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  -- Ensure one conversation per user-candidate pair
  UNIQUE(user_id, candidate_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create conversation topics table (to track which topics have been covered)
CREATE TABLE public.conversation_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  topic_id TEXT NOT NULL,
  seeker_covered BOOLEAN DEFAULT FALSE,
  candidate_covered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(conversation_id, topic_id)
);

-- Create indexes for performance
CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX idx_conversations_candidate_id ON public.conversations(candidate_id);
CREATE INDEX idx_conversations_last_message_at ON public.conversations(last_message_at DESC);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_conversation_topics_conversation_id ON public.conversation_topics(conversation_id);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_topics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
-- Users can view their own conversations
CREATE POLICY "Users can view their own conversations"
ON public.conversations FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = candidate_id);

-- Users can create conversations
CREATE POLICY "Users can create conversations"
ON public.conversations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own conversations
CREATE POLICY "Users can update their own conversations"
ON public.conversations FOR UPDATE
USING (auth.uid() = user_id OR auth.uid() = candidate_id);

-- RLS Policies for messages
-- Users can view messages in their conversations
CREATE POLICY "Users can view messages in their conversations"
ON public.messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = messages.conversation_id
    AND (conversations.user_id = auth.uid() OR conversations.candidate_id = auth.uid())
  )
);

-- Users can send messages in their conversations
CREATE POLICY "Users can send messages in their conversations"
ON public.messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = messages.conversation_id
    AND (conversations.user_id = auth.uid() OR conversations.candidate_id = auth.uid())
  )
);

-- RLS Policies for conversation_topics
-- Users can view topics in their conversations
CREATE POLICY "Users can view topics in their conversations"
ON public.conversation_topics FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = conversation_topics.conversation_id
    AND (conversations.user_id = auth.uid() OR conversations.candidate_id = auth.uid())
  )
);

-- Users can update topics in their conversations
CREATE POLICY "Users can update topics in their conversations"
ON public.conversation_topics FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = conversation_topics.conversation_id
    AND (conversations.user_id = auth.uid() OR conversations.candidate_id = auth.uid())
  )
);

-- Users can insert topics in their conversations
CREATE POLICY "Users can insert topics in their conversations"
ON public.conversation_topics FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = conversation_topics.conversation_id
    AND (conversations.user_id = auth.uid() OR conversations.candidate_id = auth.uid())
  )
);

-- Function to update last_message_at when a message is inserted
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at,
      updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

-- Trigger to update last_message_at
CREATE TRIGGER update_conversation_last_message_trigger
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_last_message();

-- Function to initialize conversation topics when a conversation is created
CREATE OR REPLACE FUNCTION public.initialize_conversation_topics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.conversation_topics (conversation_id, topic_id, seeker_covered, candidate_covered)
  VALUES
    (NEW.id, 'parenting', FALSE, FALSE),
    (NEW.id, 'conception', FALSE, FALSE),
    (NEW.id, 'custody', FALSE, FALSE),
    (NEW.id, 'living', FALSE, FALSE),
    (NEW.id, 'legal', FALSE, FALSE),
    (NEW.id, 'financial', FALSE, FALSE);
  RETURN NEW;
END;
$$;

-- Trigger to initialize topics
CREATE TRIGGER initialize_conversation_topics_trigger
AFTER INSERT ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.initialize_conversation_topics();

