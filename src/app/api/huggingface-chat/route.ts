import { OpenAIStream, StreamingTextResponse, MODELS } from '@/lib/openai';
import { getHuggingFaceChatPrompt } from '@/lib/huggingFacePrompt';
import { NextRequest } from 'next/server';
import { handleChatSession, createStreamingResponse, createChatResponse } from '@/lib/chatSessionHandler';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const { userMessages } = await req.json();
    
    if (!Array.isArray(userMessages)) {
      throw new Error('Messages must be an array');
    }

    // Handle session creation/retrieval
    const { sessionId, isNewSession } = await handleChatSession({
      userMessages,
      startTime,
      req,
      chatOrigin: 'huggingface-chat'
    });

    const finalMessages = [
      { role: 'system', content: getHuggingFaceChatPrompt() },
      ...userMessages
    ];

    const stream = await OpenAIStream({
      model: MODELS.GPT_4,
      messages: finalMessages,
      temperature: 0.7,
    });

    // Create a streaming response with logging
    const processedStream = createStreamingResponse(stream, {
      sessionId,
      userMessages,
      startTime,
      req,
      chatOrigin: 'huggingface-chat'
    });

    // Create the final response with cookie handling
    return createChatResponse(processedStream, sessionId, isNewSession);
  } catch (error) {
    console.error('Hugging Face chat error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 