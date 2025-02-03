import { supabaseAdmin } from './supabaseAdmin';

export type MessageRole = 'user' | 'assistant';

export async function logMessage(
  sessionId: string,
  role: MessageRole,
  message: string,
  metadata?: object,
  chatOrigin?: string
) {
  const { data, error } = await supabaseAdmin
    .from('conversation_messages')
    .insert([{
      session_id: sessionId,
      role,
      message,
      metadata,
      chat_origin: chatOrigin,
      timestamp: new Date().toISOString()
    }]);

  if (error) {
    console.error('Failed to log message:', error);
    throw error;
  }
  return data;
}