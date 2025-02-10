'use client';

import { useState, useRef, useEffect } from 'react';
import {
  VStack,
  useColorModeValue,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Text
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useChat } from './ChatContext';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { LoadingSkeleton } from './LoadingSkeleton';
import { RefreshCw } from 'lucide-react';
import { SuggestedPrompts } from './SuggestedPrompts';
import dynamic from 'next/dynamic';
import { handleCommand } from '@/lib/commandHandler';
import { MatrixRain } from '../MatrixRain';
import { ChatProvider } from './ChatContext';

// Dynamically import Snow component
const Snow = dynamic(() => import('../Snow').then(mod => ({ default: mod.Snow })), {
  ssr: false
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWindowProps {
  apiEndpoint?: string;
  customTheme?: {
    background?: string;
    accentColor?: string;
    textColor?: string;
    fontFamily?: string;
    inputBorderColor?: string;
    inputFocusBorderColor?: string;
    buttonBg?: string;
    buttonHoverBg?: string;
    messageBubbleBg?: string;
    messageBubbleBorderColor?: string;
  };
  initialMessage?: string;
  commands?: Array<{ name: string; description: string; }>;
}

export function ChatWindow({ apiEndpoint = '/api/chat', customTheme, initialMessage, commands }: ChatWindowProps) {
  return (
    <ChatProvider initialMessage={initialMessage}>
      <ChatWindowContent apiEndpoint={apiEndpoint} customTheme={customTheme} commands={commands} />
    </ChatProvider>
  );
}

function ChatWindowContent({ apiEndpoint, customTheme, commands }: Omit<ChatWindowProps, 'initialMessage'>) {
  const { messages, error, isInitializing, sendMessage, isSnowing, matrixMode } = useChat();
  const [isTyping, setIsTyping] = useState(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);
  
  // Move hooks to top level
  const lightModeBg = useColorModeValue('white', 'gray.800');
  const lightModeBorderColor = useColorModeValue('gray.100', 'gray.700');
  
  // Merge default theme with customTheme
  const defaultTheme = {
    background: matrixMode ? 'black' : lightModeBg,
    accentColor: matrixMode ? '#00FF00' : 'blue.500',
    textColor: matrixMode ? '#00FF00' : undefined,
    fontFamily: matrixMode ? "'Courier New', monospace" : undefined,
  };
  const theme = { ...defaultTheme, ...customTheme };

  const handleSubmit = async (message: string) => {
    if (!message.trim()) return;
    setIsTyping(true);
    try {
      await sendMessage(message, apiEndpoint);
    } finally {
      setIsTyping(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    // Skip initial load
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    // Only scroll when a new message is added
    if (lastMessageRef.current && messages.length > 1) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages.length]);

  if (isInitializing) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        minH={{ base: '100dvh', md: 'calc(100vh - 40px)' }}
        bg={theme.background}
      >
        <LoadingSkeleton />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        minH={{ base: '100dvh', md: 'calc(100vh - 40px)' }}
        bg={theme.background}
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        gap={4}
      >
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          borderRadius="lg"
          p={6}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Connection Error
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {error}. Please try refreshing the page or try again later.
          </AlertDescription>
          <Button
            leftIcon={<RefreshCw />}
            mt={4}
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      minH={{ base: '100dvh', md: 'calc(100vh - 40px)' }}
      bg={theme.background}
      color={theme.textColor}
      fontFamily={theme.fontFamily}
      transition="all 0.3s ease-in-out"
      position="relative"
    >
      <MatrixRain isActive={matrixMode} />
      <Snow isActive={isSnowing} />
      <Box
        flex="1"
        overflowY="auto"
        px={{ base: 2, md: 4 }}
        pb={{ base: "140px", md: "160px" }}
        css={{
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: theme.accentColor },
        }}
      >
        <Box maxW="4xl" mx="auto" py={{ base: 2, md: 4 }}>
          <VStack spacing={{ base: 2, md: 4 }} align="stretch" w="full">
            {messages.map((msg, i) => (
              <Box
                key={i}
                ref={i === messages.length - 1 ? lastMessageRef : undefined}
              >
                <MessageBubble 
                  message={msg} 
                  isLast={i === messages.length - 1} 
                  matrixMode={matrixMode}
                  theme={customTheme}
                />
              </Box>
            ))}
            {isTyping && (
              <Box alignSelf="flex-start">
                <TypingIndicator matrixMode={matrixMode} />
              </Box>
            )}
          </VStack>
        </Box>
      </Box>
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        bg={theme.background}
        borderTop="1px solid"
        borderColor={theme.accentColor}
        boxShadow={matrixMode ? 'none' : "0 -4px 6px -1px rgba(0, 0, 0, 0.1)"}
        pb={{ base: 'env(safe-area-inset-bottom)', md: 0 }}
        zIndex={10}
      >
        <Box maxW="4xl" mx="auto" w="full" bg={theme.background} px={4}>
          <SuggestedPrompts onPromptClick={handleSubmit} matrixMode={matrixMode} isDisabled={isTyping} />
          <ChatInput 
            onSubmit={handleSubmit} 
            isDisabled={isTyping} 
            matrixMode={matrixMode}
            theme={customTheme}
            commands={commands}
          />
        </Box>
      </Box>
    </Box>
  );
} 