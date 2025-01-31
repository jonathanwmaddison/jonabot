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
      <Container maxW="2xl" h="calc(100vh - 100px)" p={4}>
        <Card h="full" bg={bg} shadow="xl">
          <CardBody
            display="flex"
            flexDirection="column"
            position="relative"
          >
            <LoadingSkeleton />
          </CardBody>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="2xl" h="calc(100vh - 100px)" p={4}>
        <Card h="full" bg={bg} shadow="xl">
          <CardBody
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
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxW="2xl" h="calc(100vh - 100px)" p={4}>
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
              {isTyping && (
                <Box alignSelf="flex-start">
                  <TypingIndicator />
                </Box>
              )}
              <div ref={messagesEndRef} />
            </MotionVStack>
          </AnimatePresence>
        </CardBody>
        <SuggestedPrompts onPromptClick={handlePromptClick} />
        <ChatInput onTypingChange={setIsTyping} initialInput={input} />
      </Card>
    </Container>
  );
} 