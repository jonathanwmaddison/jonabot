import { NextResponse } from 'next/server';
import { getBaseUrl } from '@/lib/utils';

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    const baseUrl = getBaseUrl(req);
    
    // Return links to both formats
    return NextResponse.json({
      message: "View or download Jonathan's resume",
      links: {
        interactive: `${baseUrl}/resume`,
        pdf: `${baseUrl}/jonathan-maddison-resume.pdf`
      }
    });
  } catch (error) {
    console.error('Error handling resume request:', error);
    return NextResponse.json(
      { error: 'Failed to handle resume request' },
      { status: 500 }
    );
  }
} 