import { OpenAIStream, StreamingTextResponse, MODELS } from '@/lib/openai';
import { getBasePrompt } from '@/lib/basePrompt';
import { NextRequest } from 'next/server';
import { waitUntil } from '@vercel/functions';

// // Configure the function
// export const runtime = 'nodejs';
// export const maxDuration = 60; // Maximum duration in seconds
// export const dynamic = 'force-dynamic'; // Ensure the route is dynamic

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  console.log('Request received');
  try {
    // Verify content type
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return new Response('Invalid content type. Expected application/json', { 
        status: 415 
      });
    }

    const { userMessages } = await req.json();
    
    if (!Array.isArray(userMessages)) {
      return new Response('Invalid request: userMessages must be an array', { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const finalMessages = [
      { role: 'system', content: getBasePrompt() },
      ...userMessages,
    ];

    const stream = await OpenAIStream({
      model: MODELS.GPT_4,
      messages: finalMessages,
      temperature: 0.7,
    });

    // Log request details after sending response
    waitUntil(
      (async () => {
        const duration = Date.now() - startTime;
        console.log(`Chat request processed in ${duration}ms`, {
          messagesCount: userMessages.length,
          region: process.env.VERCEL_REGION
        });
      })()
    );

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Chat error:', error);
    
    // Return a more detailed error response
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 