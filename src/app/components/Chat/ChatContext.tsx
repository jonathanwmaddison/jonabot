'use client';

import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { useToast, useColorMode } from '@chakra-ui/react';
import { handleCommand } from '@/lib/commands';
import { extractContactInfo } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  role: string;
  content: string;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  isInitializing: boolean;
  error: string | null;
  isSnowing: boolean;
  matrixMode: boolean;
  sessionId: string | null;
}

interface ChatContextType extends ChatState {
  sendMessage: (content: string, apiEndpoint?: string) => Promise<void>;
  clearError: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

const initialState: ChatState = {
  messages: [],
  isInitializing: true,
  error: null,
  isSnowing: false,
  matrixMode: false,
  sessionId: null,
};

interface ChatProviderProps {
  children: React.ReactNode;
  initialMessage?: string;
}

export function ChatProvider({ children, initialMessage }: ChatProviderProps) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const toast = useToast();
  const isInitialized = useRef(false);
  const { setColorMode } = useColorMode();

  // Simulate initialization delay and check API connection
  useEffect(() => {
    const checkConnection = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;
      
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userMessages: [{ role: 'system', content: 'test' }],
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to connect to chat service');
        }

        const timestamp = new Date();
        dispatch({
          type: 'ADD_MESSAGE',
          message: {
            role: 'assistant',
            content: initialMessage || 'Hi! 👋 I\'m JonaBot, your guide to Jonathan\'s professional journey. Feel free to ask me about his experience, projects, or skills - I\'m here to help!',
            timestamp,
          },
        });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          error: 'Unable to connect to chat service',
        });
      } finally {
        dispatch({ type: 'SET_INITIALIZED' });
      }
    };

    checkConnection();
  }, [initialMessage]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  function isContactRequest(content: string): boolean {
    const contactPhrases = [
      /send.*email/i,
      /send.*message/i,
      /contact/i,
      /get in touch/i,
      /reach out/i,
      /email.*you/i,
      /message.*you/i,
    ];
    return contactPhrases.some(phrase => phrase.test(content));
  }

  const sendMessage = useCallback(async (content: string, apiEndpoint: string = '/api/chat') => {
    const timestamp = new Date();
    
    // Initialize session ID and create session in Supabase if not exists
    let activeSessionId = state.sessionId;
    let sessionPromise: Promise<void> | null = null;

    if (!activeSessionId) {
      const newSessionId = uuidv4();
      activeSessionId = newSessionId;
      
      // Create session first and store the promise
      sessionPromise = fetch('/api/log-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          create_session: true,
          session_id: newSessionId,
          chat_origin: apiEndpoint === '/api/huggingface-chat' ? 'huggingface' : 'web',
          metadata: {
            timestamp: timestamp.toISOString(),
          }
        }),
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error('Failed to create session');
        }
      });

      dispatch({ 
        type: 'SET_SESSION_ID', 
        sessionId: newSessionId 
      });
    }

    // Function to log messages that ensures session exists first
    const logMessage = async (role: 'user' | 'assistant', messageContent: string, messageTimestamp: Date) => {
      try {
        // Wait for session creation if it's pending
        if (sessionPromise) {
          await sessionPromise;
        }

        await fetch('/api/log-conversation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: activeSessionId,
            role,
            message: messageContent,
            chat_origin: apiEndpoint === '/api/huggingface-chat' ? 'huggingface' : 'web',
            metadata: {
              timestamp: messageTimestamp.toISOString(),
            }
          }),
        });
      } catch (error) {
        console.error(`Failed to log ${role} message:`, error);
      }
    };

    // Log user message asynchronously without blocking the main flow
    if (activeSessionId) {
      Promise.resolve().then(() => logMessage('user', content, timestamp));
    }

    // Check for commands
    const commandResponse = handleCommand(content, { dispatch, setColorMode, timestamp });
    if (commandResponse) {
      if (commandResponse.userMessage) {
        dispatch({
          type: 'ADD_MESSAGE',
          message: {
            role: 'user',
            content: commandResponse.userMessage.content,
            timestamp
          }
        });
      }
      
      if (commandResponse.assistantMessage) {
        dispatch({
          type: 'ADD_MESSAGE',
          message: {
            role: 'assistant',
            content: commandResponse.assistantMessage.content,
            timestamp: new Date()
          }
        });
      }
      
      if (commandResponse.action) {
        commandResponse.action({ dispatch, setColorMode, timestamp });
      }
      
      return;
    }

    // Check if this is a contact info message
    const lastMessage = state.messages[state.messages.length - 1];
    const isAfterContactPrompt = lastMessage?.role === 'assistant' && 
      lastMessage.content.includes("I'll help you send a message to Jonathan");
    
    // Check if this is either a follow-up to contact prompt or a new contact request
    if (isAfterContactPrompt || isContactRequest(content)) {
      console.log('Detected potential contact message');
      const contactInfo = extractContactInfo(content);
      console.log('Extracted contact info:', contactInfo);
      
      if (contactInfo) {
        try {
          console.log('Attempting to send contact email...');
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactInfo),
          });

          console.log('Contact API response status:', response.status);
          const responseData = await response.json();
          console.log('Contact API response:', responseData);

          if (!response.ok) {
            if (response.status === 429) {
              throw new Error('Rate limit exceeded');
            }
            throw new Error('Failed to send message');
          }

          dispatch({
            type: 'ADD_MESSAGE',
            message: {
              role: 'user',
              content,
              timestamp,
            },
          });

          dispatch({
            type: 'ADD_MESSAGE',
            message: {
              role: 'assistant',
              content: responseData.error || 'Thanks! I\'ve sent your message to Jonathan. He\'ll get back to you at the email address you provided.',
              timestamp: new Date(),
            },
          });

          return;
        } catch (error: any) {
          console.error('Contact API error:', error);
          const errorMessage = error.message === 'Rate limit exceeded'
            ? 'Sorry, you\'ve sent too many messages recently. Please try again later or reach out to Jonathan directly at jonathanwm84@gmail.com'
            : 'Sorry, I encountered an error while trying to send your message. Please try again or reach out to Jonathan directly at jonathanwm84@gmail.com';
          
          dispatch({
            type: 'ADD_MESSAGE',
            message: {
              role: 'assistant',
              content: errorMessage,
              timestamp: new Date(),
            },
          });
          return;
        }
      } else if (!isAfterContactPrompt) {
        // If this was a new contact request but we couldn't extract info, show the contact prompt
        dispatch({
          type: 'ADD_MESSAGE',
          message: {
            role: 'user',
            content,
            timestamp,
          },
        });
        
        dispatch({
          type: 'ADD_MESSAGE',
          message: {
            role: 'assistant',
            content: `I'll help you send a message to Jonathan! Please provide:
1. Your name (optional)
2. Your email address (so he can reply to you)
3. Your message

You can format it like this:
\`\`\`
Name: Your Name
Email: your.email@example.com
Message: Your message here
\`\`\`

Or just tell me naturally and I'll help format it!`,
            timestamp: new Date(),
          },
        });
        return;
      } else {
        console.log('No valid contact info found in message');
        // Add a helpful response when contact info couldn't be extracted
        dispatch({
          type: 'ADD_MESSAGE',
          message: {
            role: 'assistant',
            content: "I couldn't quite extract your contact information. Could you please format it like this?\n\n```\nName: Your Name\nEmail: your.email@example.com\nMessage: Your message here\n```\n\nOr make sure to include your email address in your message.",
            timestamp: new Date(),
          },
        });
        return;
      }
    }

    // If no contact info found or not a contact message, proceed with normal message handling
    dispatch({ 
      type: 'ADD_MESSAGE', 
      message: { role: 'user', content, timestamp } 
    });

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userMessages: [...state.messages, { role: 'user', content }] 
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = '';

      dispatch({
        type: 'ADD_MESSAGE',
        message: { 
          role: 'assistant', 
          content: '', 
          timestamp: new Date() 
        },
      });

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistantResponse += decoder.decode(value);
        dispatch({
          type: 'UPDATE_LAST_ASSISTANT_MESSAGE',
          content: assistantResponse,
        });
      }

      // Log assistant message asynchronously without blocking
      if (activeSessionId) {
        const assistantTimestamp = new Date();
        Promise.resolve().then(() => logMessage('assistant', assistantResponse, assistantTimestamp));
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        error: 'Failed to send message. Please try again.',
      });
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [state.messages, state.sessionId, toast]);

  return (
    <ChatContext.Provider value={{ ...state, sendMessage, clearError }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'UPDATE_LAST_ASSISTANT_MESSAGE'; content: string }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_INITIALIZED' }
  | { type: 'SET_SNOW'; isSnowing: boolean }
  | { type: 'TOGGLE_MATRIX_MODE' }
  | { type: 'SET_SESSION_ID'; sessionId: string };

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message],
        error: null,
      };
    case 'UPDATE_LAST_ASSISTANT_MESSAGE':
      const messages = [...state.messages];
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        messages[messages.length - 1] = {
          ...lastMessage,
          content: action.content,
        };
      }
      return { ...state, messages, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_INITIALIZED':
      return { ...state, isInitializing: false };
    case 'SET_SNOW':
      return { ...state, isSnowing: action.isSnowing };
    case 'TOGGLE_MATRIX_MODE':
      return { ...state, matrixMode: !state.matrixMode };
    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.sessionId };
    default:
      return state;
  }
} 