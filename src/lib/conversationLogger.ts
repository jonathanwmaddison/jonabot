import { supabaseAdmin } from './supabaseAdmin';

export type ConversationRole = 'user' | 'assistant' | 'system';
export type ChatOrigin = 'web' | 'mobile' | 'huggingface';

interface ConversationMessage {
  session_id: string;
  role: ConversationRole;
  message: string;
  chat_origin: ChatOrigin;
  metadata?: Record<string, any>;
}

interface ConversationSession {
  session_id: string;
  user_id?: string | null;
  started_at: string;
  ended_at?: string | null;
  metadata?: Record<string, any>;
  chat_origin: ChatOrigin;
}

/**
 * Logs a new conversation message.
 */
export async function logConversationMessage(
  sessionId: string,
  role: ConversationRole,
  message: string,
  chatOrigin: ChatOrigin,
  metadata?: Record<string, any>
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('conversation_messages')
    .insert([{
      session_id: sessionId,
      role,
      message,
      chat_origin: chatOrigin,
      metadata,
      timestamp: new Date().toISOString()
    }]);

  if (error) {
    console.error('Error logging conversation message:', error);
    throw error;
  }
}

/**
 * Creates a new conversation session.
 */
export async function createConversationSession(
  userId: string | null,
  chatOrigin: ChatOrigin,
  metadata?: Record<string, any>
): Promise<ConversationSession> {
  // Extract session_id from metadata if provided
  const sessionId = metadata?.session_id;
  if (!sessionId) {
    throw new Error('session_id is required in metadata');
  }
  delete metadata.session_id; // Remove it from metadata to avoid duplication

  const { data, error } = await supabaseAdmin
    .from('conversation_sessions')
    .insert([{
      session_id: sessionId,
      user_id: userId,
      chat_origin: chatOrigin,
      metadata,
      started_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating conversation session:', error);
    throw error;
  }

  return data;
}

/**
 * Ends a conversation session.
 */
export async function endConversationSession(sessionId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('conversation_sessions')
    .update({ ended_at: new Date().toISOString() })
    .eq('session_id', sessionId);

  if (error) {
    console.error('Error ending conversation session:', error);
    throw error;
  }
}

/**
 * Retrieves all messages for a given session.
 */
export async function getSessionMessages(sessionId: string): Promise<ConversationMessage[]> {
  const { data, error } = await supabaseAdmin
    .from('conversation_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Error retrieving session messages:', error);
    throw error;
  }

  return data;
}

/**
 * Retrieves session details.
 */
export async function getSessionDetails(sessionId: string): Promise<ConversationSession | null> {
  const { data, error } = await supabaseAdmin
    .from('conversation_sessions')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (error) {
    console.error('Error retrieving session details:', error);
    throw error;
  }

  return data;
} 