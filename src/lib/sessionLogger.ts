import { supabaseAdmin } from './supabaseAdmin';

export async function createSession(userId?: string, metadata?: object, chatOrigin?: string) {
  const { data, error } = await supabaseAdmin
    .from('conversation_sessions')
    .insert([{ user_id: userId, metadata, chat_origin: chatOrigin }])
    .select();

  if (error) {
    console.error('Failed to create session:', error);
    throw error;
  }
  return data[0];
}

export async function endSession(sessionId: string) {
  const { error } = await supabaseAdmin
    .from('conversation_sessions')
    .update({ ended_at: new Date().toISOString() })
    .eq('session_id', sessionId);

  if (error) {
    console.error('Failed to end session:', error);
    throw error;
  }
}