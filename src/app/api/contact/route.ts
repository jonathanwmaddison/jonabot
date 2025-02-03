import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Ensure this route runs in a Node.js environment (not Edge)
export const runtime = 'nodejs';

// Simple in-memory rate limiting (Note: This state is not shared between serverless instances)
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds
const MAX_EMAILS_PER_WINDOW = 3; // Max 3 emails per hour
const emailLog = new Map<string, number[]>();

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const userEmails = emailLog.get(identifier) || [];
  
  // Clean up old entries
  const recentEmails = userEmails.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  
  if (recentEmails.length >= MAX_EMAILS_PER_WINDOW) {
    return true;
  }
  
  // Update the log with the new email timestamp
  emailLog.set(identifier, [...recentEmails, now]);
  return false;
}

// Create a nodemailer transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    console.log('Contact API called');

    // Extract client IP from the x-forwarded-for header (if available)
    const forwardedFor = req.headers.get('x-forwarded-for');
    const identifier = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';

    // Check rate limit for this IP
    if (isRateLimited(identifier)) {
      console.log('Rate limit exceeded for:', identifier);
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { name, email, message } = await req.json();
    console.log('Received contact info:', { name, email, message });

    // Basic validation
    if (!email || !message) {
      console.log('Validation failed: missing email or message');
      return NextResponse.json(
        { error: 'Email and message are required.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format.' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length < 10 || message.length > 1000) {
      console.log('Validation failed: message length');
      return NextResponse.json(
        { error: 'Message must be between 10 and 1000 characters.' },
        { status: 400 }
      );
    }

    console.log('Attempting to send email via nodemailer...');
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: `New Contact from JonaBot: ${name || 'Anonymous'}`,
      text: `
Name: ${name || 'Anonymous'}
Email: ${email}
Message: ${message}
      `,
      html: `
<h2>New Contact from JonaBot</h2>
<p><strong>Name:</strong> ${name || 'Anonymous'}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong></p>
<p>${message}</p>
      `,
    });
    console.log('Email sent successfully');

    return NextResponse.json({ 
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
