Below is a summary of the minimal changes you need to make to your existing codebase so that you can offer an employer‐specific chat route (for example, for Hugging Face) that both merges your base prompt with employer-specific details and applies custom styling. The idea is to:

1. **Add a new prompt file** for the employer that merges your existing base prompt with custom job details.
2. **Create a new API route** (e.g. `/api/huggingface-chat`) that uses the merged prompt.
3. **Modify your existing ChatWindow component** so it accepts an API endpoint (and optionally a custom theme) so you can reuse it on a new employer-specific page (like `/huggingface`).

Below, the changes are “highlighted” as modifications (or additions) to your existing files rather than a complete rewrite.

---

### 1. New Employer-Specific Prompt File

**Create a new file:**  
`src/lib/huggingFacePrompt.ts`

```ts
// NEW FILE: src/lib/huggingFacePrompt.ts
import { getBasePrompt } from './basePrompt';

export function getHuggingFaceChatPrompt() {
  return `
${getBasePrompt()}

--- Employer-Specific Context (Hugging Face) ---
Employer: Hugging Face  
Brand Colors: Primary orange (#FF9900) with a modern dark background and clean white text.
Job Listing Context:
At Hugging Face, we're on a journey to democratize good AI. We are building the fastest growing platform for AI builders with over 5 million users and 100k organizations. Our open-source libraries have over 400k+ stars on GitHub.

About the Role:
As a frontend engineer, you'll work with core web technologies and Python to build complex UI components that empower users with minimal code. You'll also help maintain a popular open-source library and collaborate daily with researchers, ML practitioners, data scientists, and software engineers.

About the Candidate:
Jonathan is a seasoned frontend engineer experienced in TypeScript, React, and modern web APIs. He is passionate about open source and has built scalable, responsive UIs.

Instructions:
- Emphasize how Jonathan’s technical strengths and open-source passion align with Hugging Face’s mission.
- Use a friendly yet professional tone.
`;
}
```

---

### 2. New API Route for Employer Chat

**Create a new API route:**  
`src/app/api/huggingface-chat/route.ts`

```ts
// NEW FILE: src/app/api/huggingface-chat/route.ts
import { OpenAIStream, StreamingTextResponse, MODELS } from '@/lib/openai';
import { getHuggingFaceChatPrompt } from '@/lib/huggingFacePrompt';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { employerMessages } = await req.json();
    const finalMessages = [
      { role: 'system', content: getHuggingFaceChatPrompt() },
      ...employerMessages,
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
```

---

### 3. Changes to the Existing ChatWindow Component

Assuming you already have a ChatWindow component (e.g. in `src/components/Chat/ChatWindow.tsx`), you want to enable passing a custom API endpoint and custom theme. Here’s how to adjust the component:

#### a. **Add Props for the API Endpoint and Custom Theme**

Modify the component’s props to accept an optional `apiEndpoint` and `customTheme`. For example:

```tsx
// In your ChatWindow.tsx component:
interface ChatWindowProps {
  apiEndpoint?: string; // NEW: allows specifying the API endpoint (default to your standard endpoint)
  customTheme?: {
    background?: string;
    accentColor?: string;
    textColor?: string;
    fontFamily?: string;
  };
}

export function ChatWindow({ apiEndpoint = '/api/chat', customTheme }: ChatWindowProps) {
  // ... existing code ...

  // Merge default theme with customTheme
  const defaultTheme = {
    background: 'white',
    accentColor: 'blue.500',
    textColor: 'black',
    fontFamily: 'sans-serif',
  };
  const theme = { ...defaultTheme, ...customTheme };

  // Use theme.background, theme.accentColor, etc. in your component styles.
  return (
    <Box
      p={4}
      bg={theme.background}
      fontFamily={theme.fontFamily}
      minH="calc(100vh - 60px)"
      overflowY="auto"
    >
      {/* Render messages using theme.accentColor for user messages etc. */}
      {/* ... existing message rendering code ... */}
      <Box mt={4} as="form" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
        <Box display="flex">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            bg="white"
          />
          <IconButton
            aria-label="Send message"
            icon={<FiSend />}
            onClick={sendMessage}
            isDisabled={isSending || !input.trim()}
          />
        </Box>
      </Box>
    </Box>
  );
}
```

#### b. **Update the Fetch Call**

Replace any hard-coded endpoint with the passed `apiEndpoint` prop:
```tsx
// Replace this:
const res = await fetch('/api/chat', { ... });

// With:
const res = await fetch(apiEndpoint, { ... });
```

---

### 4. New Employer-Specific Frontend Page

Create a new page (for example, at `/huggingface`) that uses your updated ChatWindow with employer-specific settings.

**File: `src/app/huggingface/page.tsx`**
```tsx
'use client';

import { Box, Text, Image } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

// Use dynamic import so that ChatWindow only loads on the client
const EmployerChatWindow = dynamic(
  () => import('@/components/Chat/ChatWindow').then(mod => mod.ChatWindow),
  { ssr: false }
);

export default function HuggingFacePage() {
  const bg = '#1a1a1a';           // Custom dark background
  const accentColor = '#FF9900';  // Hugging Face orange
  const textColor = 'white';

  return (
    <Box minH="100vh" bg={bg} color={textColor}>
      <Box p={4} borderBottom={`2px solid ${accentColor}`} textAlign="center">
        <Image 
          src="/huggingface-logo.png"   // Place this logo in your public folder
          alt="Hugging Face Logo"
          maxH="50px"
          mx="auto"
        />
        <Text fontSize="lg" fontWeight="bold" mt={2}>
          Employer Chat for Hugging Face Applications
        </Text>
      </Box>
      
      <EmployerChatWindow 
        apiEndpoint="/api/huggingface-chat" 
        customTheme={{
          background: bg,
          accentColor: accentColor,
          textColor: textColor,
          fontFamily: `'Roboto Mono', monospace`
        }}
      />
    </Box>
  );
}
```

---

### Summary of Changes

- **New Prompt File:** Create `src/lib/huggingFacePrompt.ts` that merges your base prompt with employer-specific details.
- **New API Route:** Add a dedicated route at `src/app/api/huggingface-chat/route.ts` that uses the merged prompt.
- **ChatWindow Modifications:**  
  - Add new props `apiEndpoint` and `customTheme`.
  - Replace hard-coded API calls with the `apiEndpoint` prop.
  - Adjust styling to use values from `customTheme` if provided.
- **Employer Page:** Create a new page (e.g. `/huggingface`) that imports the ChatWindow, passes the new endpoint, and applies employer-specific styling (custom colors, logo, font, etc.).

By applying these changes to your existing components, you’ll be able to offer a custom, employer-specific chat experience that includes both your core background context and job-listing details.