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

// Dynamically import Snow component
const Snow = dynamic(() => import('../Snow').then(mod => ({ default: mod.Snow })), {
  ssr: false
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatWindow() {
  const { messages, error, isInitializing, sendMessage, isSnowing, matrixMode } = useChat();
  const [isTyping, setIsTyping] = useState(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);
  
  // Move hooks to top level
  const lightModeBg = useColorModeValue('white', 'gray.800');
  const lightModeBorderColor = useColorModeValue('gray.100', 'gray.700');
  
  // Use matrix mode styling when active
  const bg = matrixMode ? 'black' : lightModeBg;
  const borderColor = matrixMode ? '#00FF00' : lightModeBorderColor;
  const textColor = matrixMode ? '#00FF00' : undefined;
  const fontFamily = matrixMode ? "'Courier New', monospace" : undefined;

  const handleSubmit = async (message: string) => {
    if (!message.trim()) return;
    setIsTyping(true);
    try {
      await sendMessage(message);
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
    if (lastMessageRef.current && messages.length > 0) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages.length]);

  if (isInitializing) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        minH={{ base: '100dvh', md: 'calc(100vh - 40px)' }}
        bg={bg}
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
        bg={bg}
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
      bg={bg}
      color={textColor}
      fontFamily={fontFamily}
      transition="all 0.3s ease-in-out"
      position="relative"
    >
      <MatrixRain isActive={matrixMode} />
      <Snow isActive={isSnowing} />
      <Box
        flex="1"
        overflowY="auto"
        px={{ base: 2, md: 4 }}
        pb={{ base: "120px", md: "140px" }}
        css={{
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: matrixMode ? '#00FF00' : 'gray.200' },
        }}
      >
        <Box maxW="4xl" mx="auto" py={{ base: 2, md: 4 }}>
          <VStack spacing={{ base: 2, md: 4 }} align="stretch" w="full">
            {messages.map((msg, i) => (
              <Box
                key={i}
                ref={i === messages.length - 1 ? lastMessageRef : undefined}
              >
                <MessageBubble message={msg} isLast={i === messages.length - 1} matrixMode={matrixMode} />
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
        position="sticky"
        bottom={0}
        bg={bg}
        borderTop="1px solid"
        borderColor={borderColor}
        boxShadow={matrixMode ? 'none' : "0 -4px 6px -1px rgba(0, 0, 0, 0.1)"}
        pb={{ base: 'env(safe-area-inset-bottom)', md: 0 }}
      >
        <Box maxW="4xl" mx="auto" w="full">
          <SuggestedPrompts onPromptClick={handleSubmit} matrixMode={matrixMode} />
          <ChatInput onSubmit={handleSubmit} isDisabled={isTyping} matrixMode={matrixMode} />
        </Box>
      </Box>
    </Box>
  );
} 