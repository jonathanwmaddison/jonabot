import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    // Return links to both formats using relative URLs
    return NextResponse.json({
      message: "View or download Jonathan's resume",
      links: {
        interactive: '/resume',
        pdf: '/jonathan-maddison-resume.pdf'
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