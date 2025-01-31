'use client';

import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { useToast, useColorMode } from '@chakra-ui/react';
import { handleCommand } from '@/lib/commands';

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
}

interface ChatContextType extends ChatState {
  sendMessage: (content: string) => Promise<void>;
  clearError: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

const initialState: ChatState = {
  messages: [],
  isInitializing: true,
  error: null,
  isSnowing: false,
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
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
            content: 'Hi! 👋 I\'m JonaBot, your guide to Jonathan\'s professional journey. Feel free to ask me about his experience, projects, or skills - I\'m here to help!',
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
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const timestamp = new Date();
    
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

    // If no command matched, proceed with normal message handling
    dispatch({ 
      type: 'ADD_MESSAGE', 
      message: { role: 'user', content, timestamp } 
    });

    try {
      const response = await fetch('/api/chat', {
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
  }, [state.messages, toast, setColorMode]);

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
  | { type: 'SET_SNOW'; isSnowing: boolean };

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
    default:
      return state;
  }
} 