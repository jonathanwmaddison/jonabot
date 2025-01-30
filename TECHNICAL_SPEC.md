# JonaBot Technical Specification (Simplified Architecture)

## Table of Contents
1. [System Overview](#1-system-overview)  
2. [Data Management](#2-data-management)  
3. [Conversation Flow](#3-conversation-flow)  
4. [Implementation Details](#4-implementation-details)  
   1. [Directory Structure](#41-directory-structure)  
   2. [Route Handlers](#42-route-handlers)  
   3. [LLM Streaming](#43-llm-streaming)  
   4. [Feedback Collection](#44-feedback-collection)  
5. [Security & Privacy](#5-security--privacy)  
6. [Deployment Strategy](#6-deployment-strategy)  
7. [Testing Strategy](#7-testing-strategy)  
8. [Monitoring & Analytics](#8-monitoring--analytics)  
9. [Future Enhancements](#9-future-enhancements)  

## 1. System Overview

### High-Level Architecture
- **Next.js 14** (or 13+) application with the new App Router
- **Single Repository** hosting all front-end and back-end code
- **OpenAI** for LLM completions (using streaming responses)
- **Static Prompt Context** containing resume, project details, and relevant data
- **Feedback Collection** via Next.js route that stores user inquiries

### Key Advantages
- No separate Express or Node server needed; Next.js route handlers suffice
- Streaming responses from OpenAI give a real-time "typing" feel without WebSockets
- Easy to deploy on platforms like Vercel (which fully supports Next.js functions)

## 2. Data Management

### Knowledge Base Structure
```typescript
// src/app/lib/basePrompt.ts
export const BASE_PROMPT = `
You are JonaBot, Jonathan's personal AI assistant. 
You have the following context about Jonathan:

--RESUME--
- Name: Jonathan ...
- Title: Full-Stack Developer
- Skills: React, Node.js, Next.js, etc.
- Resume Link: https://my-website.com/resume.pdf

--PROJECTS--
Project A:
- GitHub: https://github.com/jonathan/project-a
- Description: ...
Project B:
- Live Demo: https://my-website.com/project-b
- Description: ...

When users ask about Jonathan's background, share details from the context.
When they ask for the resume, provide the direct link: 
https://my-website.com/resume.pdf

If they want to leave feedback or contact info, ask them for:
- Name
- Email
- Message

Then submit that to the feedback endpoint at /api/feedback.
Always maintain a friendly, professional tone.
`;
```

## 3. Conversation Flow

1. **User** types a message in the chat frontend
2. **Frontend** sends a POST request to Next.js route (e.g., `/api/chat`) with conversation history
3. **Next.js Route Handler**:
   - Prepends the system prompt (which includes `BASE_PROMPT`) to the conversation
   - Calls OpenAI's Chat Completion API with streaming enabled
   - Streams tokens back to the client
4. **Frontend** receives tokens in real time and updates chat UI with "typing" effect
5. **If Feedback is Collected**: Assistant prompts for contact info, frontend calls `/api/feedback`

## 4. Implementation Details

### 4.1 Directory Structure
```
my-jonabot-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          // Main layout
│   │   ├── page.tsx            // Landing page or chat UI
│   │   └── api/
│   │       ├── chat/
│   │       │   └── route.ts    // Chat completion route (streaming)
│   │       └── feedback/
│   │           └── route.ts    // Feedback submission route
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── InputArea.tsx
│   │   │   └── StreamingText.tsx  // Renders streaming tokens
│   │   └── ...
│   ├── lib/
│   │   ├── basePrompt.ts
│   │   ├── types.ts
│   │   └── openai.ts           // LLM utility
│   └── types/                  // Global TypeScript types
└── ...
```

### 4.2 Route Handlers

#### Chat Route (Streaming)
```typescript
// constants
const MODELS = {
  GPT_4o: 'gpt-4o',
};

// app/api/chat/route.ts
import { OpenAIStream, StreamingTextResponse } from 'lib/openai';
import { BASE_PROMPT } from 'lib/basePrompt';

export async function POST(req: Request) {
  try {
    const { userMessages } = await req.json();
    
    const finalMessages = [
      { role: 'system', content: BASE_PROMPT },
      ...userMessages,
    ];

    const stream = await OpenAIStream({
      model: MODELS.GPT_4o,
      messages: finalMessages,
      temperature: 0.7,
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Chat error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
```

#### Feedback Route
```typescript
// app/api/feedback/route.ts
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

    // Store in DB or send email
    // e.g., await db.feedback.create({ data: { name, email, message } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### 4.3 LLM Streaming
```typescript
// lib/openai.ts
import { createParser } from 'eventsource-parser';

interface OpenAIRequest {
  model: string;
  messages: { role: string; content: string }[];
  temperature?: number;
  max_tokens?: number;
}

export async function OpenAIStream(options: OpenAIRequest) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY || ''}`,
    },
    body: JSON.stringify({ ...options, stream: true }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`OpenAI API Error: ${await res.text()}`);
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const parser = createParser((event) => {
        if (event.type === 'event') {
          const data = event.data;
          if (data === '[DONE]') {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0]?.delta?.content || '';
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          } catch (err) {
            controller.error(err);
          }
        }
      });

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}
```

### 4.4 Frontend Components

We'll use Chakra UI, a comprehensive component library that provides:

- **Accessible Components**: Built following WAI-ARIA standards
- **Composable System**: Mix and match components
- **Theme-Aware**: Light/dark mode support
- **Motion Support**: Built-in animations
- **React Server Components**: For optimal performance

#### Component Architecture
```typescript
// app/components/Chat/layout.tsx
import { Suspense } from 'react';
import { ChakraProvider, Spinner, Center } from '@chakra-ui/react';
import { ChatProvider } from './ChatContext';

export default function ChatLayout({ children }) {
  return (
    <ChakraProvider>
      <ChatProvider>
        <Suspense fallback={
          <Center h="100vh">
            <Spinner size="xl" color="blue.500" />
          </Center>
        }>
          {children}
        </Suspense>
      </ChatProvider>
    </ChakraProvider>
  );
}

// app/components/Chat/ChatWindow.tsx
'use client';

import { useState } from 'react';
import {
  VStack,
  Card,
  CardBody,
  Container,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from './ChatContext';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';

const MotionVStack = motion(VStack);

export function ChatWindow() {
  const { messages, sendMessage } = useChat();
  const [isTyping, setIsTyping] = useState(false);
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <Container maxW="2xl" h="600px">
      <Card h="full" bg={bg} shadow="xl">
        <CardBody
          display="flex"
          flexDirection="column"
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: 'gray.200' },
          }}
        >
          <AnimatePresence>
            <MotionVStack spacing={4} align="stretch" flex={1}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <MessageBubble message={msg} />
                </motion.div>
              ))}
              {isTyping && <TypingIndicator />}
            </MotionVStack>
          </AnimatePresence>
        </CardBody>
        <ChatInput onSend={sendMessage} onTypingChange={setIsTyping} />
      </Card>
    </Container>
  );
}

// app/components/Chat/MessageBubble.tsx
import { memo } from 'react';
import {
  Box,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface MessageProps {
  message: {
    role: string;
    content: string;
  };
}

const MotionBox = motion(Box);

export const MessageBubble = memo(function MessageBubble({ message }: MessageProps) {
  const isUser = message.role === 'user';
  const sanitizedHtml = DOMPurify.sanitize(marked(message.content));
  
  const bg = useColorModeValue(
    isUser ? 'blue.500' : 'gray.100',
    isUser ? 'blue.400' : 'gray.700'
  );
  const color = useColorModeValue(
    isUser ? 'white' : 'gray.900',
    isUser ? 'white' : 'gray.100'
  );

  return (
    <MotionBox
      display="flex"
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <Box
        maxW="80%"
        bg={bg}
        color={color}
        px={4}
        py={2}
        borderRadius="xl"
      >
        <Text
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          sx={{
            'p': { margin: 0 },
            'a': { color: 'blue.200', textDecoration: 'underline' },
            'code': { bg: 'gray.700', px: 1, borderRadius: 'sm' },
          }}
        />
      </Box>
    </MotionBox>
  );
});

// app/components/Chat/ChatInput.tsx
'use client';

import { useState, useRef } from 'react';
import {
  Box,
  Textarea,
  IconButton,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSend } from 'react-icons/fi';

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  onTypingChange: (isTyping: boolean) => void;
}

export function ChatInput({ onSend, onTypingChange }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    onTypingChange(true);
    setInput('');
    await onSend(input);
    onTypingChange(false);
  };

  return (
    <Box p={4} borderTop="1px" borderColor={borderColor}>
      <HStack spacing={2}>
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          size="sm"
          resize="none"
          rows={1}
          maxRows={4}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <IconButton
          aria-label="Send message"
          icon={<FiSend />}
          colorScheme="blue"
          onClick={() => handleSubmit()}
          isDisabled={!input.trim()}
        />
      </HStack>
    </Box>
  );
}

// app/components/Chat/TypingIndicator.tsx
import { HStack, Circle } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionCircle = motion(Circle);

export function TypingIndicator() {
  return (
    <HStack spacing={2} p={4}>
      {[0, 1, 2].map((i) => (
        <MotionCircle
          key={i}
          size="2"
          bg="gray.400"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </HStack>
  );
}

// app/components/Chat/ChatContext.tsx
'use client';

import { createContext, useContext, useReducer, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';

interface Message {
  role: string;
  content: string;
}

interface ChatState {
  messages: Message[];
}

interface ChatContextType extends ChatState {
  sendMessage: (content: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, { messages: [] });
  const toast = useToast();

  const sendMessage = useCallback(async (content: string) => {
    dispatch({ type: 'ADD_MESSAGE', message: { role: 'user', content } });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ userMessages: [...state.messages, { role: 'user', content }] }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistantResponse += decoder.decode(value);
        dispatch({
          type: 'UPDATE_LAST_ASSISTANT_MESSAGE',
          content: assistantResponse,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [state.messages, toast]);

  return (
    <ChatContext.Provider value={{ ...state, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
}

function chatReducer(state: ChatState, action: any): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message],
      };
    case 'UPDATE_LAST_ASSISTANT_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages.slice(0, -1),
          { role: 'assistant', content: action.content },
        ],
      };
    default:
      return state;
  }
}
```

This modern component architecture includes:

1. **Accessible Components**:
   - Radix UI ScrollArea for smooth scrolling
   - ARIA-compliant form controls
   - Keyboard navigation support

2. **Fluid Animations**:
   - Message entrance/exit animations
   - Typing indicator animation
   - Button press feedback
   - Smooth height transitions

3. **Smart Features**:
   - Markdown rendering with sanitization
   - Auto-resizing textarea
   - Enter to send (with shift+enter for new line)
   - Real-time typing indicator

4. **Performance Optimizations**:
   - React Server Components where possible
   - Memoized message bubbles
   - Efficient context updates
   - Suspense boundaries for loading states

5. **Developer Experience**:
   - Type-safe components
   - Modular architecture
   - Reusable hooks and utilities
   - Clear separation of concerns

Required dependencies:
```json
{
  "dependencies": {
    "@chakra-ui/react": "^2.8.0",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "framer-motion": "^10.16.4",
    "marked": "^9.1.2",
    "dompurify": "^3.0.6",
    "react-icons": "^4.11.0"
  }
}
```

## 5. Security & Privacy

### 5.1 API Security
- Rate limiting (optional): Use tools like Upstash Rate Limit for Next.js
- Input validation and sanitization
- HTTPS-only connections

### 5.2 Environment Variables
- OpenAI API Key stored securely in environment variables
- Never exposed on the client side

## 6. Deployment Strategy

### 6.1 Infrastructure
- Single repository deployed on Vercel
- Automatic HTTPS and edge functions
- Environment variables configured in Vercel project settings

### 6.2 Resume Hosting
- Store PDF in `public/` folder or use S3 bucket
- Link to it in the `BASE_PROMPT`

## 7. Testing Strategy

### 7.1 Unit Tests
- Test OpenAI streaming function
- Validate feedback submission with various inputs
- Mock API responses for consistent testing

### 7.2 Integration Tests
- End-to-end conversation flow
- Feedback submission process
- Resume link functionality

### 7.3 Manual Testing
- Deploy to test environment
- Verify streaming responses
- Test feedback collection

## 8. Monitoring & Analytics

### 8.1 Key Metrics
- Page visits and performance (Vercel Analytics)
- OpenAI token usage and costs
- Error rates and types
- Feedback submission tracking

### 8.2 Logging
- Server-side logs for debugging
- Client-side error tracking
- Usage analytics for optimization

## 9. Future Enhancements

### 9.1 Potential Improvements
1. **Conditional Context**
   - Split context by topic, inject relevant sections
2. **Database Integration**
   - Add robust feedback storage and management
3. **Authentication**
   - Secure admin features if needed
4. **UI/UX**
   - Polish chat interface and animations
5. **Multi-step Contact Flow**
   - Guided data collection for specific inquiries

---

This technical specification provides a streamlined approach to building JonaBot using Next.js Route Handlers and streaming responses, eliminating the need for WebSockets or separate servers while maintaining core functionality.
