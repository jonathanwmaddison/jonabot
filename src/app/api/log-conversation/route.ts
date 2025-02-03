import { NextRequest, NextResponse } from 'next/server';
import {
  logConversationMessage,
  createConversationSession,
  type ConversationRole,
  type ChatOrigin
} from '@/lib/conversationLogger';

interface LogConversationRequest {
  create_session?: boolean;
  session_id: string;
  role?: ConversationRole;
  message?: string;
  chat_origin: ChatOrigin;
  metadata?: Record<string, any>;
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json() as LogConversationRequest;
    const { create_session, session_id, role, message, chat_origin, metadata } = payload;

    // Validate session_id is provided
    if (!session_id) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      );
    }

    // Handle session creation
    if (create_session) {
      const session = await createConversationSession(null, chat_origin, {
        ...metadata,
        session_id, // Pass the client-generated session ID
      });
      return NextResponse.json({ 
        success: true, 
        session_id: session.session_id 
      });
    }

    // For message logging, validate required fields
    if (!role || !message || !chat_origin) {
      return NextResponse.json(
        { error: 'Missing required fields: role, message, and chat_origin are required for message logging.' },
        { status: 400 }
      );
    }

    // Log the message
    await logConversationMessage(session_id, role, message, chat_origin, metadata);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in log-conversation API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
} 