import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();
    
    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email and message are required.' },
        { status: 400 }
      );
    }

    // For now, we'll just log the feedback
    // In a real implementation, you would store this in a database
    console.log('Feedback received:', { name, email, message });

    // TODO: Add your preferred storage method here
    // Examples:
    // - Send an email
    // - Store in a database
    // - Create a GitHub issue
    // - Send to a CRM

    return NextResponse.json({ 
      success: true,
      message: 'Feedback received successfully'
    });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 