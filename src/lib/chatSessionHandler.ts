import { NextRequest } from 'next/server';
import { createSession } from './sessionLogger';
import { logMessage, MessageRole } from './logger';
import { waitUntil } from '@vercel/functions';

export type StreamResponse = ReadableStream<Uint8Array>;

interface ChatSessionConfig {
  sessionId?: string;
  userMessages: { role: string; content: string }[];
  startTime: number;
  req: NextRequest;
  chatOrigin?: string;
}

interface StreamProcessor {
  stream: StreamResponse;
  processChunk?: (chunk: Uint8Array) => void;
}

export async function handleChatSession(config: ChatSessionConfig) {
  const { sessionId: existingSessionId, userMessages, startTime, req } = config;
  
  // Check for an existing session_id in the cookies or use provided one
  let sessionId = existingSessionId || req.cookies.get('session_id')?.value || '';
  let isNewSession = false;
  
  if (!sessionId) {
    isNewSession = true;
    // Create a new session record in Supabase
    const sessionRecord = await createSession(undefined, {
      ip: req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown'
    }, config.chatOrigin);
    sessionId = sessionRecord.session_id;
  }

  if (!sessionId) {
    throw new Error('Failed to create or retrieve session ID');
  }

  return {
    sessionId,
    isNewSession
  };
}

export function createStreamingResponse(
  originalStream: StreamResponse,
  config: {
    sessionId: string;
    userMessages: { role: string; content: string }[];
    startTime: number;
    req: NextRequest;
    chatOrigin?: string;
  }
) {
  const { sessionId, userMessages, startTime, req, chatOrigin } = config;

  // Create a TransformStream to duplicate the stream
  const transformStream = new TransformStream();
  const writer = transformStream.writable.getWriter();
  const reader = originalStream.getReader();

  // Create a background task to handle all logging
  waitUntil((async () => {
    try {
      const duration = Date.now() - startTime;
      console.log(`Chat request processed in ${duration}ms`, {
        messagesCount: userMessages.length,
        region: process.env.VERCEL_REGION,
        sessionId,
        chat_origin: chatOrigin
      });

      // Log all user messages in the background
      await Promise.all(userMessages.map(msg =>
        logMessage(
          sessionId,
          'user' as MessageRole,
          msg.content,
          {
            ip: req.headers.get('x-forwarded-for') || 'unknown',
            timestamp: new Date().toISOString()
          },
          chatOrigin
        )
      ));

      // Process and log the assistant's response
      let fullResponse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Write to both the response stream and our buffer
        await writer.write(value);
        fullResponse += new TextDecoder().decode(value);
      }

      // Log the complete assistant response
      await logMessage(
        sessionId,
        'assistant',
        fullResponse,
        {
          duration,
          region: process.env.VERCEL_REGION || 'unknown',
          timestamp: new Date().toISOString()
        },
        chatOrigin
      );
    } catch (error) {
      console.error('Background logging error:', error);
    } finally {
      await writer.close();
    }
  })());

  return transformStream.readable;
}

export function createChatResponse(
  stream: ReadableStream,
  sessionId: string,
  isNewSession: boolean
) {
  const response = new Response(stream);
  
  // If this is a new session, set the session cookie
  if (isNewSession) {
    response.headers.set(
      'Set-Cookie',
      `session_id=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 30}` // 30 days
    );
  }

  return response;
}