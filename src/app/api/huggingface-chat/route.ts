import { OpenAIStream, StreamingTextResponse, MODELS } from '@/lib/openai';
import { getHuggingFaceChatPrompt } from '@/lib/huggingFacePrompt';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userMessages } = await req.json();
    
    if (!Array.isArray(userMessages)) {
      throw new Error('Messages must be an array');
    }

    const finalMessages = [
      { role: 'system', content: getHuggingFaceChatPrompt() },
      ...userMessages
    ];

    const stream = await OpenAIStream({
      model: MODELS.GPT_4,
      messages: finalMessages,
      temperature: 0.7,
    });

    return new StreamingTextResponse(stream);
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