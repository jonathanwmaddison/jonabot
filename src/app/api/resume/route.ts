import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getBaseUrl } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');
    const headersList = headers();
    const accept = headersList.get('accept');
    const baseUrl = getBaseUrl();

    // If format=pdf is specified, redirect to the PDF download URL
    if (format === 'pdf') {
      return NextResponse.redirect(`${baseUrl}/resume/download`);
    }

    // If the client accepts HTML, redirect to the resume page
    if (accept?.includes('text/html')) {
      return NextResponse.redirect(`${baseUrl}/resume`);
    }

    // Otherwise, return links to both formats
    return NextResponse.json({
      message: "View or download Jonathan's resume",
      links: {
        interactive: `${baseUrl}/resume`,
        pdf: `${baseUrl}/resume?format=pdf`
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