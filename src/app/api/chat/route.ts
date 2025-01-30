import { OpenAIStream, StreamingTextResponse, MODELS } from '@/lib/openai';
import { getBasePrompt } from '@/lib/basePrompt';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { userMessages } = await req.json();
    
    if (!Array.isArray(userMessages)) {
      return new Response('Invalid request: userMessages must be an array', { 
        status: 400 
      });
    }

    const finalMessages = [
      { role: 'system', content: getBasePrompt() },
      ...userMessages,
    ];

    const stream = await OpenAIStream({
      model: MODELS.GPT_3_5_TURBO,
      messages: finalMessages,
      temperature: 0.7,
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Chat error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 