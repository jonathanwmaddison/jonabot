
interface ContactInfo {
  name?: string;
  email: string;
  message: string;
}

export function extractContactInfo(content: string): ContactInfo | null {
  // Try to match structured format first
  const nameMatch = content.match(/name:\s*([^\n]+)/i);
  const emailMatch = content.match(/email:\s*([^\n]+)/i);
  const messageMatch = content.match(/message:\s*([^\n]+(?:\n[^\n]+)*)/i);

  if (emailMatch) {
    return {
      name: nameMatch?.[1]?.trim(),
      email: emailMatch[1].trim(),
      message: messageMatch?.[1]?.trim() || '',
    };
  }

  // If structured format not found, try to extract email from natural language
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const foundEmail = content.match(emailRegex);
  
  if (foundEmail) {
    // Try to extract name from common patterns
    let name: string | undefined;
    const namePatterns = [
      /my name is ([^,\.]+)/i,
      /i(?:'|')?m ([^,\.]+)/i,
      /this is ([^,\.]+)/i
    ];

    for (const pattern of namePatterns) {
      const nameMatch = content.match(pattern);
      if (nameMatch) {
        name = nameMatch[1].trim();
        break;
      }
    }

    // Extract message: everything after "message is:" or "message:" or the entire content minus email
    let message = content;
    const messagePatterns = [
      /(?:message is:|message:)\s*(.+)$/i,
      /and (?:the )?message (?:is:?)?\s*(.+)$/i
    ];

    for (const pattern of messagePatterns) {
      const messageMatch = content.match(pattern);
      if (messageMatch) {
        message = messageMatch[1].trim();
        break;
      }
    }

    // Clean up the message by removing email and name parts
    message = message
      .replace(foundEmail[0], '')
      .replace(/my name is [^,\.]+/i, '')
      .replace(/i(?:'|')?m [^,\.]+/i, '')
      .replace(/this is [^,\.]+/i, '')
      .replace(/message is:/i, '')
      .replace(/and the message is:/i, '')
      .replace(/emial is/i, '') // Handle common typo
      .replace(/email is/i, '')
      .trim();

    return {
      name,
      email: foundEmail[0],
      message: message || 'No message provided'
    };
  }

  return null;
} 