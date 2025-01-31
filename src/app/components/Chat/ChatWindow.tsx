'use client';

import { useState, useRef, useEffect } from 'react';
import {
  VStack,
  Card,
  CardBody,
  Container,
  useColorModeValue,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from './ChatContext';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { LoadingSkeleton } from './LoadingSkeleton';
import { FiRefreshCw } from 'react-icons/fi';
import { SuggestedPrompts } from './SuggestedPrompts';

const MotionVStack = motion(VStack);

export function ChatWindow() {
  const { messages, error, isInitializing, sendMessage } = useChat();
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  const handlePromptClick = async (prompt: string) => {
    try {
      setIsTyping(true);
      await sendMessage(prompt);
    } finally {
      setIsTyping(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (isInitializing) {
    return (
      <Box w="full" h="calc(100vh - 40px)">
        <Box 
          h="full" 
          bg={bg}
          display="flex"
          flexDirection="column"
          position="relative"
        >
          <LoadingSkeleton />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box w="full" h="calc(100vh - 40px)">
        <Box
          h="full"
          bg={bg}
          display="flex"
          flexDirection="column"
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
              leftIcon={<FiRefreshCw />}
              mt={4}
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box w="full" h="calc(100vh - 40px)">
      <Box
        h="full"
        bg={bg}
        display="flex"
        flexDirection="column"
      >
        <Box
          flex="1"
          overflowY="auto"
          px={4}
          css={{
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: 'gray.200' },
          }}
        >
          <Box maxW="4xl" mx="auto" py={4}>
            <AnimatePresence>
              <MotionVStack spacing={4} align="stretch" w="full">
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
                {isTyping && (
                  <Box alignSelf="flex-start">
                    <TypingIndicator />
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </MotionVStack>
            </AnimatePresence>
          </Box>
        </Box>
        <Box borderTop="1px solid" borderColor={borderColor}>
          <Box maxW="4xl" mx="auto" w="full">
            <SuggestedPrompts onPromptClick={handlePromptClick} />
            <ChatInput onTypingChange={setIsTyping} initialInput={input} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
} 