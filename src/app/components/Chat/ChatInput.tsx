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
import { CommandSuggestions } from './CommandSuggestions';
import { AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  onTypingChange: (isTyping: boolean) => void;
  initialInput?: string;
}

export function ChatInput({ onTypingChange, initialInput = '' }: ChatInputProps) {
  const [input, setInput] = useState(initialInput);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
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
      setShowCommands(false);
      await sendMessage(trimmedInput);
    } finally {
      setIsSubmitting(false);
      onTypingChange(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommands) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCommandIndex(prev => prev + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCommandIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const commandElements = document.querySelectorAll('[data-command]');
        if (commandElements[selectedCommandIndex]) {
          const command = commandElements[selectedCommandIndex].getAttribute('data-command');
          if (command) {
            setInput(command);
            setShowCommands(false);
          }
        }
      } else if (e.key === 'Escape') {
        setShowCommands(false);
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    
    // Show commands when typing '/' at the start of input or after a newline
    if (newValue === '/' || /\n\/$/.test(newValue)) {
      setShowCommands(true);
      setSelectedCommandIndex(0);
    } else if (!newValue.endsWith('/')) {
      setShowCommands(false);
    }
  };

  const handleCommandSelect = (command: string) => {
    setInput(command);
    setShowCommands(false);
    textareaRef.current?.focus();
  };

  return (
    <Box p={{ base: 3, md: 4 }} borderTop="1px" borderColor={borderColor}>
      <Box position="relative">
        <AnimatePresence>
          <CommandSuggestions
            isOpen={showCommands}
            filter={input.slice(input.lastIndexOf('/') + 1)}
            onSelect={handleCommandSelect}
            selectedIndex={selectedCommandIndex}
          />
        </AnimatePresence>
        <HStack spacing={2}>
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            placeholder={isSubmitting ? 'Sending message...' : 'Type your message...'}
            size="sm"
            resize="none"
            rows={1}
            minH={{ base: "44px", md: "40px" }}
            maxH={{ base: "160px", md: "200px" }}
            overflowY="auto"
            onKeyDown={handleKeyDown}
            isDisabled={isSubmitting}
            _focus={{
              borderColor: 'blue.500',
              boxShadow: 'none',
            }}
            sx={{
              // Improve touch handling on mobile
              '@media (hover: none)': {
                fontSize: '16px', // Prevent iOS zoom
              }
            }}
          />
          <IconButton
            aria-label="Send message"
            icon={isSubmitting ? <Spinner size="sm" /> : <FiSend />}
            colorScheme="blue"
            onClick={handleSubmit}
            isDisabled={!input.trim() || isSubmitting}
            isLoading={isSubmitting}
            size={{ base: "md", md: "sm" }}
            minW={{ base: "44px", md: "32px" }}
            height={{ base: "44px", md: "32px" }}
          />
        </HStack>
      </Box>
    </Box>
  );
} 