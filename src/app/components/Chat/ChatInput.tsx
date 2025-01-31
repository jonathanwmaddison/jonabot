'use client';

import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import {
  Box,
  Textarea,
  IconButton,
  HStack,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import { FiSend } from 'react-icons/fi';
import { useChat } from './ChatContext';

interface ChatInputProps {
  onTypingChange: (isTyping: boolean) => void;
  initialInput?: string;
}

export function ChatInput({ onTypingChange, initialInput = '' }: ChatInputProps) {
  const [input, setInput] = useState(initialInput);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage } = useChat();
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    setInput(initialInput);
  }, [initialInput]);

  const handleSubmit = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isSubmitting) return;

    try {
      setIsSubmitting(true);
      onTypingChange(true);
      setInput('');
      await sendMessage(trimmedInput);
    } finally {
      setIsSubmitting(false);
      onTypingChange(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Box p={4} borderTop="1px" borderColor={borderColor}>
      <HStack spacing={2}>
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isSubmitting ? 'Sending message...' : 'Type your message...'}
          size="sm"
          resize="none"
          rows={1}
          minH="40px"
          maxH="200px"
          overflowY="auto"
          onKeyDown={handleKeyDown}
          isDisabled={isSubmitting}
          _focus={{
            borderColor: 'blue.500',
            boxShadow: 'none',
          }}
        />
        <IconButton
          aria-label="Send message"
          icon={isSubmitting ? <Spinner size="sm" /> : <FiSend />}
          colorScheme="blue"
          onClick={handleSubmit}
          isDisabled={!input.trim() || isSubmitting}
          isLoading={isSubmitting}
        />
      </HStack>
    </Box>
  );
} 